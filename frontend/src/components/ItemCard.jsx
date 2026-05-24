import { memo } from 'react';
import { ESTADOS, obtenerCategoria } from '../utils/categorias.js';

// React.memo: cada tarjeta solo se vuelve a renderizar si SU item cambia.
// Antes de la fase 3, escribir en la busqueda re-renderizaba las ~270 tarjetas
// en cada tecla. Como los handlers ahora vienen memorizados con useCallback
// desde App, el memo de verdad corta los renders (ver Profiler en el README).
function ItemCard({ item, onCambiarEstado, onArchivar }) {
  const cat = obtenerCategoria(item.categoriaId);

  return (
    <div
      className={`card estado-${item.estado}`}
      style={{ borderTop: `4px solid ${cat?.color || 'var(--border)'}` }}
    >
      <div className="card-top">
        <span className="cat" style={{ background: cat?.color }}>
          {cat?.emoji} {cat?.nombre}
        </span>
        {item.numero != null && <span className="numero">#{item.numero}</span>}
      </div>
      <h3>{item.nombre}</h3>
      <div className="estados">
        {ESTADOS.map((s) => (
          <button
            key={s}
            className={item.estado === s ? 'sel' : ''}
            onClick={() => onCambiarEstado(item.id, s)}
          >
            {s}
          </button>
        ))}
      </div>
      <button className="del" onClick={() => onArchivar(item.id)}>
        archivar
      </button>
    </div>
  );
}

export default memo(ItemCard);
