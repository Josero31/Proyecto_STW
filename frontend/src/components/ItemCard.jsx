import { CATEGORIAS, ESTADOS } from '../utils/categorias.js';

export default function ItemCard({ item, onEstado, onEliminar }) {
  const cat = CATEGORIAS.find((c) => c.id === item.categoriaId);

  return (
    <div className={`card estado-${item.estado}`}>
      <div className="cat">{cat?.nombre}</div>
      <h3>{item.nombre}</h3>
      <div className="estados">
        {ESTADOS.map((s) => (
          <button
            key={s}
            className={item.estado === s ? 'sel' : ''}
            onClick={() => onEstado(item.id, s)}
          >
            {s}
          </button>
        ))}
      </div>
      <button className="del" onClick={() => onEliminar(item.id)}>archivar</button>
    </div>
  );
}
