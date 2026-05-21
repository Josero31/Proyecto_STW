import { useEffect, useRef, useState } from 'react';
import FormularioItem from './components/FormularioItem.jsx';
import ListaItems from './components/ListaItems.jsx';
import { useStorage } from './context/StorageProvider.jsx';
import { useTema } from './context/ThemeContext.jsx';

export default function App() {
  const { modo, setModo, cargando, error, obtenerItems } = useStorage();
  const { tema, cambiarTema } = useTema();

  const [items, setItems] = useState([]);

  // ref #1 -> apunta al input del formulario para hacerle focus desde aca
  const inputNombreRef = useRef(null);
  // ref #2 -> guarda el ID del setInterval para limpiarlo sin re-render
  const intervaloRef = useRef(null);

  // recargar items cada vez que cambia el modo
  useEffect(() => {
    let cancelado = false;
    obtenerItems().then((datos) => {
      if (!cancelado) setItems(datos);
    });
    return () => {
      cancelado = true;
    };
  }, [obtenerItems]);

  // en modo API hago auto-refresh cada 20s por si edito desde otra pestaña
  // o desde el celular. el ID va en ref para no causar re-render y limpiarlo
  // bien cuando cambio a local o desmonto.
  useEffect(() => {
    if (modo !== 'api') return;
    intervaloRef.current = setInterval(() => {
      obtenerItems().then((datos) => setItems(datos));
    }, 20000);
    return () => {
      clearInterval(intervaloRef.current);
      intervaloRef.current = null;
    };
  }, [modo, obtenerItems]);

  // atajos: Ctrl+N enfoca input, T cambia el tema
  useEffect(() => {
    function manejarTecla(e) {
      // si el usuario esta escribiendo, no quiero pisarle la T
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

  function trasAgregar(nuevo) {
    setItems((prev) => [nuevo, ...prev]);
  }

  function trasActualizar(id, cambios) {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...cambios } : x)));
  }

  function trasEliminar(id) {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }

  const visibles = items.filter((x) => x.activo !== false);

  return (
    <div className="app">
      <header className="topbar">
        <h1>Album Mundial 2026</h1>
        <div className="acciones">
          <button
            className="btn-toggle"
            onClick={cambiarTema}
            title="Cambiar tema (T)"
          >
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
      </p>

      <FormularioItem onAgregado={trasAgregar} inputRef={inputNombreRef} />
      <ListaItems
        items={visibles}
        onActualizado={trasActualizar}
        onEliminado={trasEliminar}
      />

      <footer className="atajos">
        Atajos: <kbd>Ctrl</kbd>+<kbd>N</kbd> enfoca el nombre · <kbd>T</kbd> cambia tema
      </footer>
    </div>
  );
}
