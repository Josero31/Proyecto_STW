import { SECCIONES, ESTADOS } from '../utils/album.js';

// barra de filtros combinados: seccion (equipo) + estado + busqueda por codigo.
// no tiene estado propio, todo vive en el reducer; aca solo despacho FILTRAR.
export default function Filtros({ filtroCategoria, filtroEstado, busqueda, onFiltrar, onLimpiar, inputRef }) {
  const hayFiltros =
    filtroCategoria !== 'todas' || filtroEstado !== 'todos' || busqueda !== '';

  return (
    <div className="filtros">
      <input
        ref={inputRef}
        type="search"
        placeholder="buscar por codigo… (ej. MEX10, FWC3)"
        value={busqueda}
        onChange={(e) => onFiltrar('busqueda', e.target.value)}
      />
      <select
        value={filtroCategoria}
        onChange={(e) => onFiltrar('filtroCategoria', e.target.value)}
      >
        <option value="todas">Todos los equipos</option>
        {SECCIONES.map((s) => (
          <option key={s.id} value={s.id}>
            {s.emoji} {s.nombre}
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
