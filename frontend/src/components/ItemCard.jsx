import { ESTADOS, obtenerCategoria } from '../utils/categorias.js';
import { useStorage } from '../context/StorageProvider.jsx';

export default function ItemCard({ item, onActualizado, onEliminado }) {
  const { actualizarItem, eliminarItem } = useStorage();
  const cat = obtenerCategoria(item.categoriaId);

  async function cambiar(nuevoEstado) {
    if (nuevoEstado === item.estado) return;
    try {
      await actualizarItem(item.id, { estado: nuevoEstado });
      onActualizado(item.id, { estado: nuevoEstado });
    } catch (err) {
      alert('No se pudo actualizar: ' + err.message);
    }
  }

  async function archivar() {
    try {
      await eliminarItem(item.id);
      onEliminado(item.id);
    } catch (err) {
      alert('No se pudo archivar: ' + err.message);
    }
  }

  return (
    <div
      className={`card estado-${item.estado}`}
      style={{ borderTop: `4px solid ${cat?.color || 'var(--border)'}` }}
    >
      <div className="cat" style={{ background: cat?.color }}>
        {cat?.emoji} {cat?.nombre}
      </div>
      <h3>{item.nombre}</h3>
      <div className="estados">
        {ESTADOS.map((s) => (
          <button
            key={s}
            className={item.estado === s ? 'sel' : ''}
            onClick={() => cambiar(s)}
          >
            {s}
          </button>
        ))}
      </div>
      <button className="del" onClick={archivar}>archivar</button>
    </div>
  );
}
