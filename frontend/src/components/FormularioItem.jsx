import { useRef, useState } from 'react';
import { CATEGORIAS, ESTADOS } from '../utils/categorias.js';
import { useStorage } from '../context/StorageProvider.jsx';

export default function FormularioItem({ onAgregado, inputRef }) {
  const { guardarItem } = useStorage();
  const [nombre, setNombre] = useState('');
  const [numero, setNumero] = useState('');
  const [categoriaId, setCategoriaId] = useState(CATEGORIAS[0].id);
  const [estado, setEstado] = useState('faltante');
  const [enviando, setEnviando] = useState(false);

  // ref local por si App no pasa uno (asi el componente funciona solo)
  const refLocal = useRef(null);
  const ref = inputRef || refLocal;

  // TODO: validar que no se pueda agregar el mismo nombre dos veces dentro del mismo grupo
  // (por ahora si pongo "Messi" 3 veces se guardan los 3, lo cual no tiene sentido en un album)
  async function enviar(e) {
    e.preventDefault();
    if (!nombre.trim() || enviando) return;
    setEnviando(true);
    try {
      const guardado = await guardarItem({
        nombre: nombre.trim(),
        categoriaId,
        estado,
        // el numero es opcional (para estampas fuera de la numeracion oficial)
        numero: numero === '' ? null : Number(numero),
        atributos: {},
      });
      onAgregado(guardado);
      setNombre('');
      setNumero('');
      setEstado('faltante');
      // tras agregar quiero seguir capturando estampas sin tocar el mouse
      ref.current?.focus();
    } catch (err) {
      alert('No se pudo guardar: ' + err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={enviar} className="form">
      <h2>Nueva estampa</h2>
      <input
        ref={ref}
        placeholder="ej. MEX10 o Messi"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <input
        type="number"
        min="1"
        placeholder="# (opcional)"
        value={numero}
        onChange={(e) => setNumero(e.target.value)}
      />
      <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}>
        {CATEGORIAS.map((c) => (
          <option key={c.id} value={c.id}>
            {c.emoji} {c.nombre}
          </option>
        ))}
      </select>
      <select value={estado} onChange={(e) => setEstado(e.target.value)}>
        {ESTADOS.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <button type="submit" disabled={enviando}>
        {enviando ? 'Guardando…' : 'Agregar'}
      </button>
    </form>
  );
}
