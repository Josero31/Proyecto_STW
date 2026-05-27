import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import FormularioItem from './components/FormularioItem.jsx';
import ListaItems from './components/ListaItems.jsx';
import Filtros from './components/Filtros.jsx';
import Estadisticas from './components/Estadisticas.jsx';
import Graficas from './components/Graficas.jsx';
import { useStorage } from './context/StorageProvider.jsx';
import { useTema } from './context/ThemeContext.jsx';
import { itemsReducer, estadoInicial } from './reducers/itemsReducer.js';
import { generarEjemplo } from './utils/seed.js';
import {
  calcularEstadisticas,
  datosPorCategoria,
  datosApiladosPorCategoria,
  datosActividad7Dias,
} from './utils/estadisticas.js';

const LLAVE_ACTIVIDAD = 'album_mundial2026_actividad';

// fecha local de hoy en 'YYYY-MM-DD'. Vive en el componente (no en el reducer)
// para que el reducer no dependa de Date.now y siga siendo puro.
function hoyISO() {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}

function leerActividad() {
  try {
    const raw = localStorage.getItem(LLAVE_ACTIVIDAD);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const {
    modo, setModo, cargando, error,
    obtenerItems, actualizarItem, eliminarItem, sembrarLocal,
  } = useStorage();
  const { tema, cambiarTema } = useTema();

  const [estado, dispatch] = useReducer(itemsReducer, estadoInicial);

  // ref #1 -> input del formulario para hacerle focus con Ctrl+N
  const inputNombreRef = useRef(null);
  // ref #2 -> ID del auto-refresh en modo API, para limpiarlo sin re-render
  const intervaloRef = useRef(null);

  // carga inicial: items desde storage + actividad guardada en localStorage
  useEffect(() => {
    let cancelado = false;
    obtenerItems().then((datos) => {
      if (!cancelado) {
        dispatch({ type: 'HIDRATAR', payload: { lista: datos, actividad: leerActividad() } });
      }
    });
    return () => {
      cancelado = true;
    };
  }, [obtenerItems]);

  // persisto la actividad cada vez que cambia (el historial de la grafica de 7 dias)
  useEffect(() => {
    localStorage.setItem(LLAVE_ACTIVIDAD, JSON.stringify(estado.actividad));
  }, [estado.actividad]);

  // en modo API: auto-refresh cada 20s. El ID va en ref para no re-renderizar.
  useEffect(() => {
    if (modo !== 'api') return;
    intervaloRef.current = setInterval(() => {
      obtenerItems().then((datos) =>
        dispatch({ type: 'HIDRATAR', payload: { lista: datos, actividad: leerActividad() } })
      );
    }, 20000);
    return () => {
      clearInterval(intervaloRef.current);
      intervaloRef.current = null;
    };
  }, [modo, obtenerItems]);

  // atajos: Ctrl+N enfoca input, T cambia el tema
  useEffect(() => {
    function manejarTecla(e) {
      const escribiendo =
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.tagName === 'SELECT';
      if (e.ctrlKey && (e.key === 'n' || e.key === 'N')) {
        e.preventDefault();
        inputNombreRef.current?.focus();
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
  // dispatch es estable, asi que estos handlers solo cambian si cambia la
  // funcion de storage (al cambiar de modo). Eso es lo que hace que el
  // React.memo de ItemCard de verdad evite renders al filtrar/buscar.

  const trasAgregar = useCallback((nuevo) => {
    dispatch({ type: 'AGREGAR', payload: nuevo });
  }, []);

  const cambiarEstado = useCallback(
    async (id, nuevoEstado) => {
      try {
        await actualizarItem(id, { estado: nuevoEstado });
        dispatch({ type: 'CAMBIAR_ESTADO', payload: { id, estado: nuevoEstado } });
        // si la acabo de pegar, registro el evento para la grafica de 7 dias
        if (nuevoEstado === 'pegada') {
          dispatch({
            type: 'REGISTRAR_ACTIVIDAD',
            payload: { fecha: hoyISO(), tipo: 'pegada', itemId: id },
          });
        }
      } catch (err) {
        alert('No se pudo actualizar: ' + err.message);
      }
    },
    [actualizarItem]
  );

  const archivar = useCallback(
    async (id) => {
      try {
        await eliminarItem(id);
        dispatch({ type: 'ELIMINAR', payload: id });
      } catch (err) {
        alert('No se pudo archivar: ' + err.message);
      }
    },
    [eliminarItem]
  );

  const filtrar = useCallback((campo, valor) => {
    dispatch({ type: 'FILTRAR', payload: { campo, valor } });
  }, []);

  const limpiarFiltros = useCallback(() => {
    dispatch({ type: 'LIMPIAR_FILTROS' });
  }, []);

  function cargarEjemplo() {
    const { lista, actividad } = generarEjemplo(hoyISO());
    sembrarLocal(lista); // en modo API no hace nada
    dispatch({ type: 'HIDRATAR', payload: { lista, actividad } });
  }

  // --- derivados con useMemo ---

  // lista visible: solo activas + filtros combinados (categoria + estado + busqueda)
  const itemsVisibles = useMemo(() => {
    let res = estado.lista.filter((i) => i.activo !== false);
    if (estado.busqueda) {
      const q = estado.busqueda.toLowerCase();
      res = res.filter((i) => i.nombre.toLowerCase().includes(q));
    }
    if (estado.filtroCategoria !== 'todas') {
      res = res.filter((i) => i.categoriaId === estado.filtroCategoria);
    }
    if (estado.filtroEstado !== 'todos') {
      res = res.filter((i) => i.estado === estado.filtroEstado);
    }
    return res;
  }, [estado.lista, estado.busqueda, estado.filtroCategoria, estado.filtroEstado]);

  // las estadisticas y las graficas se calculan sobre la lista YA filtrada,
  // por eso reaccionan a los filtros activos.
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
          <label className="switch-modo">
            <span>{modo === 'api' ? '☁️ API' : '💾 Local'}</span>
            <input
              type="checkbox"
              checked={modo === 'api'}
              onChange={(e) => setModo(e.target.checked ? 'api' : 'local')}
            />
          </label>
        </div>
      </header>

      <p className="estado-app">
        {itemsVisibles.length} estampas en vista
        {cargando && ' · cargando…'}
        {error && ` · error: ${error}`}
        {estado.lista.length === 0 && (
          <button className="btn-ejemplo" onClick={cargarEjemplo}>
            cargar estampas de ejemplo
          </button>
        )}
      </p>

      <Estadisticas stats={stats} />

      <Graficas actividad7={actividad7} porCategoria={porCategoria} apiladas={apiladas} />

      <FormularioItem onAgregado={trasAgregar} inputRef={inputNombreRef} />

      <Filtros
        filtroCategoria={estado.filtroCategoria}
        filtroEstado={estado.filtroEstado}
        busqueda={estado.busqueda}
        onFiltrar={filtrar}
        onLimpiar={limpiarFiltros}
      />

      <ListaItems
        items={itemsVisibles}
        onCambiarEstado={cambiarEstado}
        onArchivar={archivar}
      />

      <footer className="atajos">
        Atajos: <kbd>Ctrl</kbd>+<kbd>N</kbd> enfoca el nombre · <kbd>T</kbd> cambia tema
      </footer>
    </div>
  );
}
