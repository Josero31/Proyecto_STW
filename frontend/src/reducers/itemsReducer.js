// Reducer del album. Es una funcion PURA: no hace fetch, no llama Date.now()
// ni crypto.randomUUID(), y no muta el estado anterior. Todo lo que dependa del
// tiempo o de la red entra YA RESUELTO por el payload (la fecha la pone el
// componente antes de despachar). Asi puedo testear cada accion con un input
// fijo y siempre da el mismo output.
//
// Decidi separar la "lista" de los "filtros" en el mismo objeto en vez de tener
// dos reducers porque los filtros casi siempre se leen junto con la lista (la
// lista filtrada depende de ambos), y un solo dispatch me evita desincronizar.
// La "actividad" la guardo aparte de la lista porque la grafica de 7 dias itera
// sobre EVENTOS (cuando pegue una estampa), no sobre el estado actual de cada
// item: si la metia dentro de cada item perdia el historico al cambiar de estado.

export const estadoInicial = {
  lista: [],
  filtroCategoria: 'todas',
  filtroEstado: 'todos',
  busqueda: '',
  actividad: [], // [{ fecha: 'YYYY-MM-DD', tipo, itemId }]
};

export function itemsReducer(estado, accion) {
  switch (accion.type) {
    case 'HIDRATAR':
      // carga inicial desde storage; reemplaza lista y actividad de un solo
      return {
        ...estado,
        lista: accion.payload.lista ?? [],
        actividad: accion.payload.actividad ?? [],
      };

    case 'AGREGAR':
      return { ...estado, lista: [accion.payload, ...estado.lista] };

    case 'ELIMINAR':
      // soft delete: marco activo=false igual que la API, no lo saco del array
      return {
        ...estado,
        lista: estado.lista.map((i) =>
          i.id === accion.payload ? { ...i, activo: false } : i
        ),
      };

    case 'CAMBIAR_ESTADO':
      return {
        ...estado,
        lista: estado.lista.map((i) =>
          i.id === accion.payload.id
            ? { ...i, estado: accion.payload.estado }
            : i
        ),
      };

    case 'FILTRAR':
      // un solo case para los 3 filtros: el campo viene en el payload
      return { ...estado, [accion.payload.campo]: accion.payload.valor };

    case 'LIMPIAR_FILTROS':
      return {
        ...estado,
        filtroCategoria: 'todas',
        filtroEstado: 'todos',
        busqueda: '',
      };

    case 'REGISTRAR_ACTIVIDAD':
      // la fecha YA viene en el payload (el componente la calcula), por eso
      // el reducer sigue siendo puro
      return { ...estado, actividad: [...estado.actividad, accion.payload] };

    default:
      throw new Error(`Accion desconocida: ${accion.type}`);
  }
}
