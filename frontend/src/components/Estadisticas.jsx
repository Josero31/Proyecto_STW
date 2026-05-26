// panel de numeros de arriba. Recibe el objeto ya calculado (con useMemo) desde
// App, no calcula nada -> asi no re-cuenta en cada render.
export default function Estadisticas({ stats }) {
  const { total, faltantes, repetidas, pegadas, especiales, progreso } = stats;

  return (
    <section className="stats">
      <div className="barra-progreso" title={`${pegadas} de ${total} pegadas`}>
        <div className="relleno" style={{ width: `${progreso}%` }} />
        <span className="barra-texto">
          {pegadas}/{total} pegadas ({progreso}%)
        </span>
      </div>
      <div className="chips">
        <span className="chip chip-total">{total} en vista</span>
        <span className="chip chip-faltante">{faltantes} faltan</span>
        <span className="chip chip-repetida">{repetidas} repetidas</span>
        <span className="chip chip-pegada">{pegadas} pegadas</span>
        <span className="chip chip-especial">{especiales} especiales</span>
      </div>
    </section>
  );
}
