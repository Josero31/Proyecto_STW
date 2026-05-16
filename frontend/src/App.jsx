import { useEffect, useState } from 'react';
import FormularioItem from './components/FormularioItem.jsx';
import ListaItems from './components/ListaItems.jsx';
import { leerItems, guardarItems } from './services/storage.js';

export default function App() {
  // lazy initializer: solo corre al montar
  const [items, setItems] = useState(() => leerItems());

  useEffect(() => {
    guardarItems(items);
  }, [items]);

  function agregar(item) {
    setItems([item, ...items]);
  }

  function cambiarEstado(id, estado) {
    setItems(items.map((x) => x.id === id ? { ...x, estado } : x));
  }

  function eliminar(id) {
    // soft delete
    setItems(items.map((x) => x.id === id ? { ...x, activo: false } : x));
  }

  const visibles = items.filter((x) => x.activo);

  return (
    <div className="app">
      <h1>Album Mundial 2026</h1>
      <p>{visibles.length} estampas</p>
      <FormularioItem onAgregar={agregar} />
      <ListaItems items={visibles} onEstado={cambiarEstado} onEliminar={eliminar} />
    </div>
  );
}
