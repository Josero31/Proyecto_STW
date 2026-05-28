import { CONFEDERACIONES } from './album.js';

// Estas funciones son las que envuelvo con useMemo en App. Reciben SIEMPRE la
// lista ya filtrada, por eso las graficas reaccionan a los filtros activos.

// totales para el panel de arriba: cuantas hay en vista, faltantes, repetidas,
// pegadas, cuantas son especiales (FWC + CC) y el % de avance.
export function calcularEstadisticas(items) {
  const total = items.length;
  const faltantes = items.filter((i) => i.estado === 'faltante').length;
  const repetidas = items.filter((i) => i.estado === 'repetida').length;
  const pegadas = items.filter((i) => i.estado === 'pegada').length;
  const especiales = items.filter((i) => i.especial).length;
  const progreso = total === 0 ? 0 : Math.round((pegadas / total) * 100);
  return { total, faltantes, repetidas, pegadas, especiales, progreso };
}

// PieChart -> cuantas estampas por confederacion (la "categoria" del album)
export function datosPorCategoria(items) {
  return CONFEDERACIONES.map((conf) => ({
    nombre: conf.nombre,
    valor: items.filter((i) => i.conf === conf.id).length,
    color: conf.color,
  })).filter((d) => d.valor > 0);
}

// BarChart apilado (mi grafica original) -> por cada confederacion el desglose
// faltante / repetida / pegada. Solo incluyo las que tengan algo en vista.
export function datosApiladosPorCategoria(items) {
  return CONFEDERACIONES.map((conf) => {
    const enConf = items.filter((i) => i.conf === conf.id);
    return {
      nombre: conf.nombre,
      faltante: enConf.filter((i) => i.estado === 'faltante').length,
      repetida: enConf.filter((i) => i.estado === 'repetida').length,
      pegada: enConf.filter((i) => i.estado === 'pegada').length,
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
