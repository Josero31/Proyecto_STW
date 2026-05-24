import ItemCard from './ItemCard.jsx';

export default function ListaItems({ items, onCambiarEstado, onArchivar }) {
  if (items.length === 0) {
    return <p className="vacio">ninguna estampa coincide con los filtros</p>;
  }
  return (
    <div className="lista">
      {items.map((it) => (
        <ItemCard
          key={it.id}
          item={it}
          onCambiarEstado={onCambiarEstado}
          onArchivar={onArchivar}
        />
      ))}
    </div>
  );
}
