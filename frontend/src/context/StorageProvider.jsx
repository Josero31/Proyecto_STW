import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

const LLAVE_MODO = 'album_mundial2026_modo';
const LLAVE_ITEMS = 'album_mundial2026_items';

const StorageContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function leerLocal() {
  try {
    const raw = localStorage.getItem(LLAVE_ITEMS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function escribirLocal(items) {
  localStorage.setItem(LLAVE_ITEMS, JSON.stringify(items));
}

export function StorageProvider({ children }) {
  const [modo, setModoState] = useState(() => {
    const m = localStorage.getItem(LLAVE_MODO);
    return m === 'api' || m === 'local' ? m : 'local';
  });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const setModo = useCallback((nuevo) => {
    setModoState(nuevo);
    localStorage.setItem(LLAVE_MODO, nuevo);
  }, []);

  // TODO: si prendo el switch a API y el backend no esta corriendo, el fetch
  // tarda como 20s en cortar. Falta agregar un AbortController con timeout corto.
  const obtenerItems = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      if (modo === 'api') {
        const res = await fetch(`${API_URL}/api/items`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const datos = await res.json();
        // el backend devuelve categoria_id en snake_case, lo paso a camel
        return datos.map((x) => ({
          id: x.id,
          nombre: x.nombre,
          categoriaId: x.categoria_id ?? x.categoriaId,
          estado: x.estado,
          atributos: x.atributos || {},
          activo: x.activo,
        }));
      }
      return leerLocal().filter((x) => x.activo);
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setCargando(false);
    }
  }, [modo]);

  const guardarItem = useCallback(
    async (item) => {
      setError(null);
      if (modo === 'api') {
        const res = await fetch(`${API_URL}/api/items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: item.nombre,
            categoriaId: item.categoriaId,
            estado: item.estado,
            atributos: item.atributos || {},
          }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const guardado = await res.json();
        return {
          id: guardado.id,
          nombre: guardado.nombre,
          categoriaId: guardado.categoria_id,
          estado: guardado.estado,
          atributos: guardado.atributos || {},
          activo: guardado.activo,
        };
      }
      const completo = { ...item, id: item.id || crypto.randomUUID(), activo: true };
      const actuales = leerLocal();
      escribirLocal([completo, ...actuales]);
      return completo;
    },
    [modo]
  );

  const actualizarItem = useCallback(
    async (id, cambios) => {
      setError(null);
      if (modo === 'api') {
        const res = await fetch(`${API_URL}/api/items/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cambios),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      }
      const actuales = leerLocal();
      const nuevos = actuales.map((x) => (x.id === id ? { ...x, ...cambios } : x));
      escribirLocal(nuevos);
      return nuevos.find((x) => x.id === id);
    },
    [modo]
  );

  const eliminarItem = useCallback(
    async (id) => {
      setError(null);
      if (modo === 'api') {
        const res = await fetch(`${API_URL}/api/items/${id}`, { method: 'DELETE' });
        if (!res.ok && res.status !== 204) throw new Error(`HTTP ${res.status}`);
        return;
      }
      // en local hago soft delete igual que la api
      const actuales = leerLocal();
      const nuevos = actuales.map((x) => (x.id === id ? { ...x, activo: false } : x));
      escribirLocal(nuevos);
    },
    [modo]
  );

  // reset del error al cambiar de modo para no arrastrarlo
  useEffect(() => {
    setError(null);
  }, [modo]);

  return (
    <StorageContext.Provider
      value={{
        modo,
        setModo,
        cargando,
        error,
        obtenerItems,
        guardarItem,
        actualizarItem,
        eliminarItem,
      }}
    >
      {children}
    </StorageContext.Provider>
  );
}

export function useStorage() {
  const ctx = useContext(StorageContext);
  if (!ctx) throw new Error('useStorage fuera de StorageProvider');
  return ctx;
}
