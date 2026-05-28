import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { COLOR_ESTADO } from '../utils/album.js';

// Las 3 graficas. Reciben los datos YA calculados con useMemo desde App, asi
// que cuando cambia un filtro App recalcula los datos y estas se redibujan
// solas. Cada una con Tooltip + Legend + ResponsiveContainer (responsivas).
export default function Graficas({ actividad7, porCategoria, apiladas }) {
  return (
    <section className="graficas">
      {/* Grafica 1: actividad de los ultimos 7 dias (LineChart) */}
      <div className="grafica">
        <h3>Estampas pegadas (ultimos 7 dias)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={actividad7} margin={{ top: 8, right: 16, bottom: 4, left: -16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="etiqueta" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="pegadas"
              name="pegadas"
              stroke="var(--primary)"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Grafica 2: distribucion por confederacion (PieChart) */}
      <div className="grafica">
        <h3>Estampas por confederacion</h3>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={porCategoria}
              dataKey="valor"
              nameKey="nombre"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label={(d) => d.valor}
            >
              {porCategoria.map((d) => (
                <Cell key={d.nombre} fill={d.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 11 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Grafica 3 (ORIGINAL): desglose apilado faltante/repetida/pegada por confederacion */}
      <div className="grafica grafica-ancha">
        <h3>Avance por confederacion (faltante / repetida / pegada)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={apiladas} margin={{ top: 8, right: 16, bottom: 40, left: -16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="nombre"
              angle={-35}
              textAnchor="end"
              interval={0}
              height={60}
              tick={{ fontSize: 10 }}
            />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="faltante" stackId="a" name="faltante" fill={COLOR_ESTADO.faltante} />
            <Bar dataKey="repetida" stackId="a" name="repetida" fill={COLOR_ESTADO.repetida} />
            <Bar dataKey="pegada" stackId="a" name="pegada" fill={COLOR_ESTADO.pegada} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
