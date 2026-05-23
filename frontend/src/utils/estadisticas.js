import { CATEGORIAS, ESTADOS } from './categorias.js';

// Estas funciones son las que envuelvo con useMemo en App. Las saque del
// componente para poder reutilizarlas y para que App se lea mas corto.
// Reciben SIEMPRE la lista ya filtrada (las graficas reaccionan a los filtros).

// totales para el panel de arriba: cuantas hay, faltantes, repetidas, pegadas,
// cuantas son especiales (FWC + CC) y el % de avance.
export function calcularEstadisticas(items) {
  const total = items.length;
  const faltantes = items.filter((i) => i.estado === 'faltante').length;
  const repetidas = items.filter((i) => i.estado === 'repetida').length;
  const pegadas = items.filter((i) => i.estado === 'pegada').length;
  const especiales = items.filter((i) => {
    const cat = CATEGORIAS.find((c) => c.id === i.categoriaId);
    return cat?.especial;
  }).length;
  const progreso = total === 0 ? 0 : Math.round((pegadas / total) * 100);
  return { total, faltantes, repetidas, pegadas, especiales, progreso };
}

// PieChart -> cuantas estampas por categoria (por equipo / grupo)
export function datosPorCategoria(items) {
  return CATEGORIAS.map((cat) => ({
    nombre: cat.nombre,
    valor: items.filter((i) => i.categoriaId === cat.id).length,
    color: cat.color,
  })).filter((d) => d.valor > 0);
}

// BarChart apilado (mi grafica original) -> por cada categoria el desglose
// faltante / repetida / pegada. Solo incluyo categorias que tengan algo.
export function datosApiladosPorCategoria(items) {
  return CATEGORIAS.map((cat) => {
    const enCat = items.filter((i) => i.categoriaId === cat.id);
    return {
      nombre: cat.nombre,
      faltante: enCat.filter((i) => i.estado === 'faltante').length,
      repetida: enCat.filter((i) => i.estado === 'repetida').length,
      pegada: enCat.filter((i) => i.estado === 'pegada').length,
    };
  }).filter((d) => d.faltante + d.repetida + d.pegada > 0);
}

// BarChart -> actividad de los ultimos 7 dias (cuantas estampas pegue por dia).
// `hoyISO` lo pasa el componente para no usar Date dentro de un useMemo.
export function datosActividad7Dias(actividad, hoyISO) {
  const dias = [];
  const base = new Date(hoyISO + 'T00:00:00');
  for (let i = 6; i >= 0; i--) {
    const d = new Date(base);
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const etiqueta = d.toLocaleDateString('es', { weekday: 'short', day: 'numeric' });
    const cuantas = actividad.filter((a) => a.fecha === iso).length;
    dias.push({ fecha: iso, etiqueta, pegadas: cuantas });
  }
  return dias;
}

// usado por algun filtro/validacion mas adelante
export const _todosLosEstados = ESTADOS;
