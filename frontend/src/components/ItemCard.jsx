import { memo } from 'react';

// Cada estampa es un BOTON: el usuario no escribe nada, solo hace clic y la
// estampa cicla faltante -> pegada -> repetida -> faltante. El color dice el
// estado. Le paso item.estado al handler para que App no necesite buscar en la
// lista y el useCallback pueda quedar estable (asi React.memo de verdad evita
// re-renders al filtrar/buscar sobre las ~993 estampas).
function ItemCard({ item, onCiclar }) {
  const titulo = `${item.codigo} — ${item.estado} (clic para cambiar)`;
  return (
    <button
      type="button"
      className={`estampa estado-${item.estado}`}
      title={titulo}
      onClick={() => onCiclar(item.id, item.estado)}
    >
      <span className="estampa-cod">{item.codigo}</span>
      <span className="estampa-num">#{item.numero}</span>
    </button>
  );
}

export default memo(ItemCard);
