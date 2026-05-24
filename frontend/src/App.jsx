import { useCallback, useEffect, useReducer, useRef } from 'react';
import FormularioItem from './components/FormularioItem.jsx';
import ListaItems from './components/ListaItems.jsx';
import { useStorage } from './context/StorageProvider.jsx';
import { useTema } from './context/ThemeContext.jsx';
import { itemsReducer, estadoInicial } from './reducers/itemsReducer.js';
import { generarEjemplo } from './utils/seed.js';

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

  // persisto la actividad cada vez que cambia (historial de la grafica de 7 dias)
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

  // handlers memorizados con useCallback -> bajan estables a ItemCard (React.memo)
  const trasAgregar = useCallback((nuevo) => {
    dispatch({ type: 'AGREGAR', payload: nuevo });
  }, []);

  const cambiarEstado = useCallback(
    async (id, nuevoEstado) => {
      try {
        await actualizarItem(id, { estado: nuevoEstado });
        dispatch({ type: 'CAMBIAR_ESTADO', payload: { id, estado: nuevoEstado } });
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

  function cargarEjemplo() {
    const { lista, actividad } = generarEjemplo(hoyISO());
    sembrarLocal(lista); // en modo API no hace nada
    dispatch({ type: 'HIDRATAR', payload: { lista, actividad } });
  }

  const visibles = estado.lista.filter((i) => i.activo !== false);

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
        {visibles.length} estampas
        {cargando && ' · cargando…'}
        {error && ` · error: ${error}`}
        {estado.lista.length === 0 && (
          <button className="btn-ejemplo" onClick={cargarEjemplo}>
            cargar estampas de ejemplo
          </button>
        )}
      </p>

      <FormularioItem onAgregado={trasAgregar} inputRef={inputNombreRef} />

      <ListaItems
        items={visibles}
        onCambiarEstado={cambiarEstado}
        onArchivar={archivar}
      />

      <footer className="atajos">
        Atajos: <kbd>Ctrl</kbd>+<kbd>N</kbd> enfoca el nombre · <kbd>T</kbd> cambia tema
      </footer>
    </div>
  );
}
