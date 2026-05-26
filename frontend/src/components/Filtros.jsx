import { CATEGORIAS, ESTADOS } from '../utils/categorias.js';

// barra de filtros combinados: categoria + estado + busqueda por nombre.
// no tiene estado propio, todo vive en el reducer; aca solo despacho FILTRAR.
export default function Filtros({ filtroCategoria, filtroEstado, busqueda, onFiltrar, onLimpiar }) {
  const hayFiltros =
    filtroCategoria !== 'todas' || filtroEstado !== 'todos' || busqueda !== '';

  return (
    <div className="filtros">
      <input
        type="search"
        placeholder="buscar por nombre… (ej. MEX, Messi)"
        value={busqueda}
        onChange={(e) => onFiltrar('busqueda', e.target.value)}
      />
      <select
        value={filtroCategoria}
        onChange={(e) => onFiltrar('filtroCategoria', e.target.value)}
      >
        <option value="todas">Todas las categorias</option>
        {CATEGORIAS.map((c) => (
          <option key={c.id} value={c.id}>
            {c.emoji} {c.nombre}
          </option>
        ))}
      </select>
      <select
        value={filtroEstado}
        onChange={(e) => onFiltrar('filtroEstado', e.target.value)}
      >
        <option value="todos">Todos los estados</option>
        {ESTADOS.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <button className="limpiar" onClick={onLimpiar} disabled={!hayFiltros}>
        Limpiar filtros
      </button>
    </div>
  );
}
