import ItemCard from './ItemCard.jsx';

export default function ListaItems({ items, onActualizado, onEliminado }) {
  if (items.length === 0) {
    return <p className="vacio">todavia no hay estampas</p>;
  }
  return (
    <div className="lista">
      {items.map((it) => (
        <ItemCard
          key={it.id}
          item={it}
          onActualizado={onActualizado}
          onEliminado={onEliminado}
        />
      ))}
    </div>
  );
}
