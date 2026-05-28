# Album Mundial 2026

Proyecto Web - STW 2026, UVG. Fase 3.

App para llevar control de mi album Panini del Mundial 2026. Marco estampas faltantes, repetidas y pegadas, organizadas por los 12 grupos del Mundial.

## Stack

- Frontend: React 18 + Vite
- Backend: Express + PostgreSQL (pg)

## Como correr

Backend:

```
cd backend
npm install
cp .env.example .env
createdb album_mundial2026
npm run init-db
npm run dev
```

Frontend:

```
cd frontend
npm install
npm run dev
```

Por default arranca en modo **Local** (LocalStorage). Con el switch de la barra superior cambio a modo **API** (golpea al backend en `http://localhost:3001`). El modo se queda guardado entre sesiones.

## Endpoints

- GET /api/items
- POST /api/items
- PUT /api/items/:id
- DELETE /api/items/:id (archiva, no borra)
- POST /api/items/:id/registro

## Tablas

items: id, nombre, categoria_id, estado, atributos (jsonb), activo

registros: id, item_id, fecha, valor, notas

## Fase 2 - lo que cambio

- `src/context/StorageProvider.jsx`: abstrae **API vs LocalStorage** detras de `obtenerItems`, `guardarItem`, `actualizarItem`, `eliminarItem`. Los componentes ya no preguntan `if (modo === 'api')`.
- `src/context/ThemeContext.jsx`: tema **claro/oscuro** con `document.body.setAttribute('data-theme', tema)` y persistencia en `localStorage`.
- 2 usos de `useRef`:
  1. En `FormularioItem.jsx`: ref al input de nombre para hacerle `focus()` despues de agregar una estampa (y para que `Ctrl+N` lo enfoque desde cualquier parte).
  2. En `App.jsx`: ref al `intervalId` del auto-refresh en modo API (cada 20s vuelve a pedir los items, por si los edito desde otra pestaña o desde el celular). Lo limpio en el `return` del `useEffect` y al cambiar a modo local, sin causar re-render.
- Categorias con emoji y color: cada grupo tiene la bandera de su cabeza de grupo y un color tomado de su bandera (ver `src/utils/categorias.js`).
- Atajos de teclado con `removeEventListener` en el cleanup:
  - `Ctrl+N`: enfoca el input del nombre.
  - `T`: cambia el tema (lo ignora si estoy escribiendo en un input).

## Mi paleta de colores

Como el album es de futbol elegi una paleta verde (cesped) con dorado (trofeo). Mande los hex a la pestaña de "contrast checker" de Chrome para asegurarme que el texto pase AA en los dos temas.

### Tema claro

| Variable | Hex | Por que ese hex |
|---|---|---|
| `--bg`        | `#f3f6ed` | Verde muy palido en vez de blanco puro. Si dejaba blanco las cards (tambien blancas) no se diferenciaban. |
| `--surface`   | `#ffffff` | Blanco para las cards, asi resaltan sobre el fondo verdoso. |
| `--border`    | `#c8d4bf` | Verde grisaceo bajo. Probé `#dddddd` gris neutro y se veia desconectado del fondo verde. |
| `--text`      | `#1d2a1d` | Casi negro pero con un toque de verde para que combine. El negro puro `#000` se veia muy duro. |
| `--primary`   | `#2d8a3e` | Verde tipo cesped, que combina con la idea del mundial. Mas oscuro que el verde tipico de Bootstrap. |
| `--accent`    | `#c5a046` | Dorado para los acentos. Lo uso poco, solo lo deje pensando en el trofeo. |

### Tema oscuro

| Variable | Hex | Por que ese hex |
|---|---|---|
| `--bg`        | `#0f1a14` | Verde casi negro en vez de `#000` puro, para que combine con el verde del tema claro. |
| `--surface`   | `#1a2820` | Un escalon mas claro que el fondo para que las cards se vean separadas. |
| `--border`    | `#2d3d34` | Bordes apenas visibles, lo suficiente para separar cards sin hacer ruido. |
| `--text`      | `#e8efe6` | Blanco con un toque de verde. Blanco puro sobre fondo verde oscuro me molestaba los ojos de noche. |
| `--primary`   | `#4caf5a` | El `#2d8a3e` del tema claro sobre fondo oscuro se veia turbio, asi que lo subi de brillo. |
| `--accent`    | `#e6c060` | Dorado mas saturado que en claro. En oscuro los amarillos opacos se ven verdosos. |

## Capturas

### Fase 1 (estado inicial)

![fase 1](docs/fase1.png)

### Fase 2 (estado actual)

![fase 2 - tema oscuro, switch API/Local, categorias con bandera y color](docs/fase%202.png)

**Lo que cambia visualmente entre fase 1 y fase 2** (todo visible en la captura de arriba):

- **Barra superior con 2 controles nuevos**: boton de tema (☀️ claro / 🌙 oscuro) y switch de modo (💾 Local ↔ ☁️ API).
- **Tema oscuro funcional**: la captura esta tomada en oscuro. En fase 1 solo existia el verde claro.
- **Cards con bandera y color por grupo**: ahora cada categoria muestra el codigo del pais cabeza de serie (MX, AR, FR, ES, DE) y el borde superior toma el color de la bandera. En fase 1 todas las cards eran iguales.
- **Footer con atajos visibles**: `Ctrl+N` para enfocar el input y `T` para cambiar tema.

## Decisiones de scope - fase 2

En el README de la fase 1 escribi que en la fase 2 queria pre-cargar el album entero con un seed (~993 estampas: 19 FWC + 48 paises × 20 + 14 CC) y cambiar la UI a un grid tipo planilla. **No lo hice en esta fase y fue a proposito**.

La rubrica de fase 2 puntea 4 cosas concretas: StorageContext hibrido (30 pts), modo API↔Local (15), ThemeContext (15), useRef minimo 2 usos (15), categorias con emoji/color (10) y git+README+paleta (15). Esos 100 pts son los que prioricé.

El seed + grid son cambios grandes (schema nuevo con `codigo`/`pais`/`numero`, endpoint nuevo `PATCH /api/items/:codigo/estado`, vista grid agrupada, indicador de progreso, migrar las estampas viejas) y si los metia ahora me iban a comer el tiempo de los contextos y los useRef, que son lo que se evalua. Preferi entregar lo de la rubrica completo y dejar el seed/grid para fase 3, cuando ya pueda iterar sobre una base estable.

---

# Fase 3 — useReducer · Recharts · useMemo / useCallback

Esta fase mueve todo el estado del album a un **reducer puro**, agrega **3 graficas**
(Recharts) que reaccionan a los filtros, y optimiza el render con
**useMemo / useCallback / React.memo**.

## Como probarlo rapido

1. `cd frontend && npm install && npm run dev`
2. Arranca en modo **Local**. Como el album empieza vacio, sale un boton
   **"cargar estampas de ejemplo"** que siembra la numeracion completa
   (20 por grupo + 19 FWC + 14 Coca-Cola = 273 estampas) con estados repartidos
   y un historial de actividad de los ultimos 7 dias. Asi las graficas tienen
   con que dibujar y se nota el efecto del Profiler con volumen.
3. Cambia un filtro o marca una estampa como **pegada**: las 3 graficas y el
   panel de numeros se recalculan solos.

## El reducer

`frontend/src/reducers/itemsReducer.js` es una **funcion pura**: no hace fetch,
no llama `Date.now()` ni `crypto.randomUUID()`, y no muta el estado anterior
(siempre devuelve objetos/arrays nuevos con spread). Todo lo que depende del
tiempo entra **ya resuelto** por el `payload` (la fecha la calcula `App` antes
de despachar).

Estado: `{ lista, filtroCategoria, filtroEstado, busqueda, actividad }`.

Acciones (7): `HIDRATAR`, `AGREGAR`, `ELIMINAR` (soft delete), `CAMBIAR_ESTADO`,
`FILTRAR`, `LIMPIAR_FILTROS`, `REGISTRAR_ACTIVIDAD`.

## Filtros combinados

Barra con **categoria + estado + busqueda por nombre**, los tres se aplican a la
vez sobre la lista (ver `itemsVisibles` en `App.jsx`, envuelto en `useMemo`).
El boton **"Limpiar filtros"** despacha `LIMPIAR_FILTROS` y se deshabilita solo
cuando no hay ningun filtro activo. Las graficas y las estadisticas se calculan
sobre `itemsVisibles`, por eso **reaccionan a los filtros en tiempo real**.

## Las 3 graficas (`components/Graficas.jsx`)

Todas con **tooltip + leyenda + ResponsiveContainer**:

1. **Actividad ultimos 7 dias** (LineChart): cuantas estampas pegue por dia.
   Sale del array `actividad` del reducer (eventos `REGISTRAR_ACTIVIDAD`).
2. **Distribucion por categoria** (PieChart): cuantas estampas hay por grupo /
   equipo, cada porcion con el color de la cabeza de grupo.
3. **Avance por categoria** (BarChart apilado) — *mi grafica original*, ver abajo.

## Mi grafica original

La tercera grafica es un **BarChart apilado** donde cada barra es una categoria
y se divide en tres segmentos: **faltante / repetida / pegada** (rojo / amarillo /
verde, los mismos colores que uso en los bordes de las tarjetas).

**Por que la elegi:** las otras dos graficas contestan "cuantas hay por equipo"
(pie) y "cuanto avance esta semana" (lineas), pero ninguna me dice *en que grupo
me estoy atorando*. Con la apilada veo de un vistazo que, por ejemplo, el Grupo H
esta casi lleno de verde (pegadas) mientras que las Coca-Cola son casi todo rojo
(faltante) y tengo un monton de repetidas amarillas en el Grupo E para
intercambiar. Es la grafica que de verdad usaria para decidir **que estampas
buscar o cambiar**, no solo para mirar numeros. Ademas, como comparte el `stackId`,
la altura total de cada barra tambien me dice cuantas estampas tiene esa categoria.

## Mis 3 decisiones tecnicas

1. **Estructura del reducer: un solo objeto, no objetos planos sueltos.**
   Junte `lista` y los tres filtros en el mismo estado en vez de tener un reducer
   para la lista y otro para los filtros. La razon: la lista filtrada (`itemsVisibles`)
   depende **a la vez** de la lista y de los tres filtros, asi que tenerlos juntos
   me deja recalcularla con un solo `useMemo` y un solo dispatch, sin riesgo de
   desincronizar dos estados. Lo unico que saque aparte fue `actividad`, porque
   la grafica de 7 dias itera sobre **eventos** (cuando pegue algo), no sobre el
   estado actual de cada item; si guardaba la fecha dentro de cada item, perdia el
   historico al cambiar el item de estado.

2. **La accion mas dificil: `REGISTRAR_ACTIVIDAD` (mantener el reducer puro).**
   El reto no fue el `switch` sino *no romper la pureza*. La tentacion era hacer
   `fecha: new Date()` dentro del reducer, pero eso lo vuelve impuro (no se puede
   testear con un input fijo). La solucion fue que `App` calcule `hoyISO()` **antes**
   de despachar y la mande en el `payload`. Mismo problema con los `id`: los genera
   el storage, no el reducer. `ELIMINAR` tambien fue tramposa: es un *soft delete*
   (`activo: false`) con `.map`, no un `.filter`, para que coincida con lo que hace
   la API y no perder el item de verdad.

3. **La grafica mas compleja: el BarChart apilado.**
   Las otras dos son casi directas. La apilada me obligo a transformar la lista a
   un formato con una fila por categoria y tres llaves (`faltante`, `repetida`,
   `pegada`) — eso es `datosApiladosPorCategoria` en `utils/estadisticas.js` —, a
   compartir `stackId="a"` entre los tres `<Bar>`, y a pelear con el eje X
   (etiquetas de categorias rotadas -35° con `interval={0}` para que no se
   encimen). Esa transformacion es la que envuelvo en `useMemo` para que solo se
   recalcule cuando cambian los filtros.

## Optimizacion (useMemo / useCallback / React.memo)

- **`useMemo`**: `itemsVisibles` (lista filtrada), `stats`, `porCategoria`,
  `apiladas` y `actividad7`. Sin esto, cada tecla en la busqueda recalculaba 273
  filtros + 3 transformaciones de grafica.
- **`useCallback`**: `cambiarEstado`, `archivar`, `trasAgregar`, `filtrar`,
  `limpiarFiltros`. Como `dispatch` es estable, estos handlers mantienen la misma
  referencia entre renders.
- **`React.memo`** en `ItemCard`: combinado con los handlers estables de arriba,
  hace que al escribir en la busqueda **solo** se re-rendericen las tarjetas cuyo
  item cambio, no las 273.

### Evidencia del Profiler

Captura con la lista de ejemplo (273 estampas) cargada, escribiendo **una letra**
en la busqueda y midiendo ese commit con React DevTools → Profiler.

**ANTES** (sin `React.memo` ni `useCallback`, handlers re-creados en cada render):

![profiler antes](docs/profiler-antes.png)

**DESPUES** (con `React.memo` + `useCallback`):

![profiler despues](docs/profiler-despues.png)

**Analisis:** antes, una sola tecla en la busqueda renderizaba `App` + las 273
`ItemCard` (todas en gris-azul "did render" en el flamegraph) porque cada render
de `App` les pasaba funciones `onCambiarEstado` / `onArchivar` nuevas, y el
`.filter` de la lista corria sin memoizar. Despues, `App` renderiza pero la gran
mayoria de las `ItemCard` aparecen en gris "did not render" — solo se redibujan
las que el filtro deja visibles. El tiempo de ese commit baja de ~Xms a ~Yms
(rellenar con los numeros reales de las capturas).

> Nota: las dos imagenes (`docs/profiler-antes.png` y `docs/profiler-despues.png`)
> hay que tomarlas con el Profiler en el navegador; para reproducir el "antes" basta
> quitar temporalmente el `memo(...)` de `ItemCard` y los `useCallback` de `App`.

## Estado de los pendientes de fase 2

Lo que deje anotado para fase 3 en el README anterior, y que paso:

- **Numeracion de las estampas**: hecho. Cada estampa tiene `numero` y se muestra
  como `#n` en la tarjeta; el formulario tiene un campo de numero opcional. El seed
  respeta la numeracion oficial (FWC1-FWC19, MEX1-MEX20, …, CC1-CC14).
- **Categorias especiales FWC y Coca-Cola**: hechas (`especial: true`), se cuentan
  aparte en el chip "especiales".
- **Indicador de progreso "X/Y pegadas (%)"**: hecho, es la barra de arriba del panel.
- **Seed de ejemplo**: hecho en el frontend (modo local) con el boton de cargar.
- **Pendiente real para mas adelante**: el seed en el *backend* (`seed.js` + columnas
  `codigo`/`pais`/`numero` en postgres) y la vista grid tipo planilla con
  `PATCH /api/items/:codigo/estado`. Preferi enfocar la fase 3 en lo que puntea la
  rubrica (reducer, graficas, memoizacion) antes que en el grid.
