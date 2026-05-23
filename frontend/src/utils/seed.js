import { CATEGORIAS, ESTADOS } from './categorias.js';

// cuantas estampas trae cada grupo / categoria especial, respetando la
// numeracion real del album (20 por grupo, 19 oficiales FWC, 14 de Coca-Cola).
const CUANTAS = { fwc: 19, cc: 14 };
const POR_GRUPO = 20;

// reparto de estados un poco arbitrario para que las graficas no salgan planas.
// no es aleatorio de verdad a proposito: quiero que el "ejemplo" se vea igual
// cada vez que lo cargo para comparar el Profiler antes/despues con la misma data.
function estadoDe(indice) {
  const r = indice % 5;
  if (r === 0 || r === 1) return 'pegada'; // ~40% pegadas
  if (r === 2) return 'repetida'; // ~20% repetidas
  return 'faltante'; // ~40% faltantes
}

// restar dias a una fecha 'YYYY-MM-DD' sin tocar zonas horarias raras
function restarDias(hoyISO, dias) {
  const d = new Date(hoyISO + 'T00:00:00');
  d.setDate(d.getDate() - dias);
  return d.toISOString().slice(0, 10);
}

// genera una lista de estampas de ejemplo + un historial de actividad de los
// ultimos dias. `hoyISO` lo pasa el componente (el seed no usa Date directo
// para que sea facil de testear con una fecha fija).
export function generarEjemplo(hoyISO) {
  const lista = [];
  const actividad = [];

  let n = 0;
  for (const cat of CATEGORIAS) {
    const total = CUANTAS[cat.id] ?? POR_GRUPO;
    const prefijo = cat.id.toUpperCase();
    for (let numero = 1; numero <= total; numero++) {
      const estado = estadoDe(n);
      const id = `seed-${cat.id}-${numero}`;
      lista.push({
        id,
        nombre: `${prefijo}${numero}`,
        categoriaId: cat.id,
        estado,
        numero,
        atributos: {},
        activo: true,
      });
      // si la pegue, dejo un evento repartido en los ultimos 7 dias
      if (estado === 'pegada') {
        actividad.push({
          fecha: restarDias(hoyISO, n % 7),
          tipo: 'pegada',
          itemId: id,
        });
      }
      n++;
    }
  }

  return { lista, actividad };
}

// sanity check chiquito para no equivocarme con ESTADOS al editar
export const _estadosValidos = ESTADOS;
