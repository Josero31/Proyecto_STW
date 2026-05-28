import { useMemo } from 'react';
import ItemCard from './ItemCard.jsx';
import { SECCIONES } from '../utils/album.js';

// Planilla del album: agrupo las estampas visibles por seccion (equipo / FWC /
// Coca-Cola) y muestro cada seccion con su bandera, su nombre y un contador
// "pegadas/total". Dentro, cada estampa es un boton (ItemCard).
export default function ListaItems({ items, onCiclar }) {
  // agrupo por seccionId respetando el orden oficial de la planilla
  const grupos = useMemo(() => {
    const porSeccion = new Map();
    for (const it of items) {
      if (!porSeccion.has(it.seccionId)) porSeccion.set(it.seccionId, []);
      porSeccion.get(it.seccionId).push(it);
    }
    return SECCIONES
      .filter((sec) => porSeccion.has(sec.id))
      .map((sec) => {
        const estampas = porSeccion.get(sec.id);
        const pegadas = estampas.filter((e) => e.estado === 'pegada').length;
        return { sec, estampas, pegadas };
      });
  }, [items]);

  if (grupos.length === 0) {
    return <p className="vacio">ninguna estampa coincide con los filtros</p>;
  }

  return (
    <div className="planilla">
      {grupos.map(({ sec, estampas, pegadas }) => (
        <section key={sec.id} className="seccion">
          <header
            className="seccion-head"
            style={{ borderLeft: `4px solid ${sec.color}` }}
          >
            <span className="seccion-nombre">
              {sec.emoji} {sec.nombre}
            </span>
            <span className="seccion-conteo">
              {pegadas}/{sec.total} pegadas
            </span>
          </header>
          <div className="seccion-estampas">
            {estampas.map((it) => (
              <ItemCard key={it.id} item={it} onCiclar={onCiclar} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
