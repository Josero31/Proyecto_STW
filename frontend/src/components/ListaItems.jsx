import ItemCard from './ItemCard.jsx';

export default function ListaItems({ items, onEstado, onEliminar }) {
  if (items.length === 0) {
    return <p>todavia no hay estampas</p>;
  }
  return (
    <div className="lista">
      {items.map((it) => (
        <ItemCard
          key={it.id}
          item={it}
          onEstado={onEstado}
          onEliminar={onEliminar}
        />
      ))}
    </div>
  );
}
