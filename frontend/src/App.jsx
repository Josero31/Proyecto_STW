import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import ListaItems from './components/ListaItems.jsx';
import Filtros from './components/Filtros.jsx';
import Estadisticas from './components/Estadisticas.jsx';
import Graficas from './components/Graficas.jsx';
import { useTema } from './context/ThemeContext.jsx';
import { itemsReducer, estadoInicial } from './reducers/itemsReducer.js';
import { generarCatalogo, siguienteEstado } from './utils/album.js';
import {
  calcularEstadisticas,
  datosPorCategoria,
  datosApiladosPorCategoria,
  datosActividad7Dias,
} from './utils/estadisticas.js';

const LLAVE_ESTADOS = 'album_mundial2026_estados';
const LLAVE_ACTIVIDAD = 'album_mundial2026_actividad';

// fecha local de hoy en 'YYYY-MM-DD'. Vive en el componente (no en el reducer)
// para que el reducer no dependa de Date.now y siga siendo puro.
function hoyISO() {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}

function restarDias(hoy, dias) {
  const d = new Date(hoy + 'T00:00:00');
  d.setDate(d.getDate() - dias);
  return d.toISOString().slice(0, 10);
}

function leerJSON(llave, porDefecto) {
  try {
    const raw = localStorage.getItem(llave);
    return raw ? JSON.parse(raw) : porDefecto;
  } catch {
    return porDefecto;
  }
}

export default function App() {
  const { tema, cambiarTema } = useTema();

  const [estado, dispatch] = useReducer(itemsReducer, estadoInicial);

  // ref -> input de busqueda, para enfocarlo con Ctrl+B desde cualquier lado
  const inputBuscarRef = useRef(null);

  // carga inicial: armo el catalogo completo (993 estampas) y le aplico los
  // estados que el usuario ya tenia guardados en localStorage.
  useEffect(() => {
    const estadosGuardados = leerJSON(LLAVE_ESTADOS, {});
    const actividad = leerJSON(LLAVE_ACTIVIDAD, []);
    dispatch({ type: 'HIDRATAR', payload: { lista: generarCatalogo(estadosGuardados), actividad } });
  }, []);

  // persisto solo las estampas que NO estan faltantes (mapa codigo -> estado),
  // asi el localStorage queda chico y al recargar se rehidrata el catalogo.
  useEffect(() => {
    const mapa = {};
    for (const it of estado.lista) {
      if (it.estado !== 'faltante') mapa[it.codigo] = it.estado;
    }
    localStorage.setItem(LLAVE_ESTADOS, JSON.stringify(mapa));
  }, [estado.lista]);

  useEffect(() => {
    localStorage.setItem(LLAVE_ACTIVIDAD, JSON.stringify(estado.actividad));
  }, [estado.actividad]);

  // atajos: Ctrl+B enfoca la busqueda, T cambia el tema
  useEffect(() => {
    function manejarTecla(e) {
      const escribiendo =
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.tagName === 'SELECT';
      if (e.ctrlKey && (e.key === 'b' || e.key === 'B')) {
        e.preventDefault();
        inputBuscarRef.current?.focus();
        return;
      }
      if (!escribiendo && (e.key === 't' || e.key === 'T') && !e.ctrlKey && !e.metaKey) {
        cambiarTema();
      }
    }
    window.addEventListener('keydown', manejarTecla);
    return () => window.removeEventListener('keydown', manejarTecla);
  }, [cambiarTema]);

  // --- handlers memorizados (useCallback) que bajan a los hijos ---
  // le paso item.estado al handler para no leer la lista aca: asi el useCallback
  // queda con deps vacias (estable) y el React.memo de ItemCard evita renders.

  const ciclar = useCallback((id, estadoActual) => {
    const sig = siguienteEstado(estadoActual);
    dispatch({ type: 'CAMBIAR_ESTADO', payload: { id, estado: sig } });
    // si la acabo de pegar, registro el evento para la grafica de 7 dias
    if (sig === 'pegada') {
      dispatch({
        type: 'REGISTRAR_ACTIVIDAD',
        payload: { fecha: hoyISO(), tipo: 'pegada', itemId: id },
      });
    }
  }, []);

  const filtrar = useCallback((campo, valor) => {
    dispatch({ type: 'FILTRAR', payload: { campo, valor } });
  }, []);

  const limpiarFiltros = useCallback(() => {
    dispatch({ type: 'LIMPIAR_FILTROS' });
  }, []);

  // boton de demo: marca un patron de estampas (no aleatorio, para poder comparar
  // el Profiler con la misma data) y arma un historial de actividad de 7 dias.
  function rellenarDemo() {
    const hoy = hoyISO();
    const actividad = [];
    const lista = estado.lista.map((it, idx) => {
      const r = idx % 5;
      let est = 'faltante';
      if (r === 0 || r === 1) est = 'pegada';
      else if (r === 2) est = 'repetida';
      if (est === 'pegada') {
        actividad.push({ fecha: restarDias(hoy, idx % 7), tipo: 'pegada', itemId: it.id });
      }
      return { ...it, estado: est };
    });
    dispatch({ type: 'HIDRATAR', payload: { lista, actividad } });
  }

  function reiniciarAlbum() {
    dispatch({ type: 'HIDRATAR', payload: { lista: generarCatalogo({}), actividad: [] } });
  }

  // --- derivados con useMemo ---

  // lista visible: filtros combinados (seccion/equipo + estado + busqueda por codigo)
  const itemsVisibles = useMemo(() => {
    let res = estado.lista.filter((i) => i.activo !== false);
    if (estado.busqueda) {
      const q = estado.busqueda.toLowerCase();
      res = res.filter((i) => i.codigo.toLowerCase().includes(q));
    }
    if (estado.filtroCategoria !== 'todas') {
      res = res.filter((i) => i.seccionId === estado.filtroCategoria);
    }
    if (estado.filtroEstado !== 'todos') {
      res = res.filter((i) => i.estado === estado.filtroEstado);
    }
    return res;
  }, [estado.lista, estado.busqueda, estado.filtroCategoria, estado.filtroEstado]);

  // estadisticas y graficas se calculan sobre la lista YA filtrada -> reaccionan
  // a los filtros activos.
  const stats = useMemo(() => calcularEstadisticas(itemsVisibles), [itemsVisibles]);
  const porCategoria = useMemo(() => datosPorCategoria(itemsVisibles), [itemsVisibles]);
  const apiladas = useMemo(() => datosApiladosPorCategoria(itemsVisibles), [itemsVisibles]);
  const actividad7 = useMemo(
    () => datosActividad7Dias(estado.actividad, hoyISO()),
    [estado.actividad]
  );

  return (
    <div className="app">
      <header className="topbar">
        <h1>Album Mundial 2026</h1>
        <div className="acciones">
          <button className="btn-toggle" onClick={cambiarTema} title="Cambiar tema (T)">
            {tema === 'claro' ? '🌙 oscuro' : '☀️ claro'}
          </button>
        </div>
      </header>

      <p className="estado-app">
        {itemsVisibles.length} estampas en vista · clic en una estampa para marcar
        <button className="btn-ejemplo" onClick={rellenarDemo}>
          rellenar demo
        </button>
        <button className="btn-reset" onClick={reiniciarAlbum}>
          reiniciar
        </button>
      </p>

      <Estadisticas stats={stats} />

      <Graficas actividad7={actividad7} porCategoria={porCategoria} apiladas={apiladas} />

      <Filtros
        filtroCategoria={estado.filtroCategoria}
        filtroEstado={estado.filtroEstado}
        busqueda={estado.busqueda}
        onFiltrar={filtrar}
        onLimpiar={limpiarFiltros}
        inputRef={inputBuscarRef}
      />

      <p className="leyenda-estados">
        clic para cambiar:
        <span className="punto faltante" /> faltante →
        <span className="punto pegada" /> pegada →
        <span className="punto repetida" /> repetida
      </p>

      <ListaItems items={itemsVisibles} onCiclar={ciclar} />

      <footer className="atajos">
        Atajos: <kbd>Ctrl</kbd>+<kbd>B</kbd> busca · <kbd>T</kbd> cambia tema
      </footer>
    </div>
  );
}
