import { useState } from 'react';
import { CATEGORIAS, ESTADOS } from '../utils/categorias.js';

export default function FormularioItem({ onAgregar }) {
  const [nombre, setNombre] = useState('');
  const [categoriaId, setCategoriaId] = useState(CATEGORIAS[0].id);
  const [estado, setEstado] = useState('faltante');

  function submit(e) {
    e.preventDefault();
    if (!nombre.trim()) return;

    onAgregar({
      id: crypto.randomUUID(),
      nombre: nombre.trim(),
      categoriaId,
      estado,
      atributos: {},
      activo: true,
    });

    setNombre('');
    setEstado('faltante');
  }

  return (
    <form onSubmit={submit} className="form">
      <h2>Nueva estampa</h2>
      <input
        placeholder="ej. Messi"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}>
        {CATEGORIAS.map((c) => (
          <option key={c.id} value={c.id}>{c.nombre}</option>
        ))}
      </select>
      <select value={estado} onChange={(e) => setEstado(e.target.value)}>
        {ESTADOS.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
      <button type="submit">Agregar</button>
    </form>
  );
}
