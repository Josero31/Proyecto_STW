# Album Mundial 2026

Proyecto Web - STW 2026, UVG. Fase 3.

App para llevar control de mi album Panini del Mundial 2026. Marco estampas faltantes, repetidas y pegadas, organizadas por equipo (las 48 selecciones + las oficiales FWC y las de Coca-Cola).

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

## El album es una planilla de botones (no se escribe nada)

El album ya viene cargado con **las 993 estampas oficiales** y su numeracion real:
48 equipos × 20 (`MEX1`..`MEX20`, `RSA1`..`RSA20`, …, `PAN1`..`PAN20`) + las 19
oficiales `FWC1`..`FWC19` + las 14 de Coca-Cola `CC1`..`CC14`. El catalogo lo arma
`utils/album.js` con `generarCatalogo()`.

**El usuario no escribe el nombre de ninguna estampa**: cada estampa es un **boton**
(`components/ItemCard.jsx`) y al hacerle clic cicla su estado
**faltante → pegada → repetida → faltante**. El color del boton dice el estado
(rojo punteado / verde / amarillo). Asi nadie se confunde escribiendo codigos a mano.

Solo se guarda en `localStorage` el mapa `{ codigo: estado }` de las que NO estan
faltantes, asi que el album persiste entre recargas sin guardar las 993.

## Como probarlo rapido

1. `cd frontend; npm install; npm run dev`
2. Sale la planilla completa, todo en **faltante**. Hace clic en cualquier estampa
   para marcarla pegada → repetida → faltante.
3. Hay un boton **"rellenar demo"** que marca un patron de estampas y arma un
   historial de actividad de 7 dias, para ver las graficas con datos y notar el
   efecto del Profiler con volumen (993 botones). El boton **"reiniciar"** deja todo
   en faltante de nuevo.
4. Cambia un filtro o marca una estampa: las 3 graficas y el panel de numeros se
   recalculan solos.

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

Barra con **equipo/seccion + estado + busqueda por codigo**, los tres se aplican a
la vez sobre la lista (ver `itemsVisibles` en `App.jsx`, envuelto en `useMemo`).
El boton **"Limpiar filtros"** despacha `LIMPIAR_FILTROS` y se deshabilita solo
cuando no hay ningun filtro activo. Las graficas y las estadisticas se calculan
sobre `itemsVisibles`, por eso **reaccionan a los filtros en tiempo real** (ej.
filtra "Argentina" y las 3 graficas y los numeros pasan a ser solo de ese equipo).

## Las 3 graficas (`components/Graficas.jsx`)

Todas con **tooltip + leyenda + ResponsiveContainer**:

1. **Actividad ultimos 7 dias** (LineChart): cuantas estampas pegue por dia.
   Sale del array `actividad` del reducer (eventos `REGISTRAR_ACTIVIDAD`).
2. **Distribucion por confederacion** (PieChart): cuantas estampas hay por
   categoria (UEFA, CONMEBOL, CONCACAF, CAF, AFC, OFC y Especiales), cada porcion
   con su color.
3. **Avance por confederacion** (BarChart apilado) — *mi grafica original*, ver abajo.

El panel de numeros de arriba cubre el resto de lo que pedia el album: **cuantas
hay** en vista, **cuantas faltan**, **cuantas repetidas**, **cuantas pegadas**,
**cuantas especiales** (FWC + CC) y el **% de avance**.

## Mi grafica original

La tercera grafica es un **BarChart apilado** donde cada barra es una confederacion
y se divide en tres segmentos: **faltante / repetida / pegada** (rojo / amarillo /
verde, los mismos colores que uso en los botones).

**Por que la elegi:** las otras dos contestan "cuantas hay por confederacion" (pie)
y "cuanto avance esta semana" (lineas), pero ninguna me dice *donde me estoy
atorando*. Con la apilada veo de un vistazo que, por ejemplo, CAF esta casi todo
rojo (me faltan muchas africanas) mientras que CONMEBOL ya esta casi verde, y que
tengo un monton de amarillas (repetidas) en UEFA para intercambiar. Es la grafica
que de verdad usaria para decidir **que estampas buscar o cambiar**, no solo para
mirar numeros. Ademas, como los tres `<Bar>` comparten `stackId`, la altura total
de cada barra tambien me dice el tamano de esa confederacion.

## Mis 3 decisiones tecnicas

1. **Catalogo fijo + estado por separado (botones, no formulario).**
   En vez de dejar que el usuario escriba estampas (se equivocaba con los codigos),
   el catalogo de 993 estampas es **fijo** (`generarCatalogo`) y lo unico que
   cambia es el `estado` de cada una. El reducer guarda la lista completa y en
   `localStorage` solo persisto el mapa `{ codigo: estado }` de las no-faltantes.
   Le paso `item.estado` al handler `onCiclar(id, estado)` para que `App` **no**
   tenga que leer la lista al hacer clic: asi el `useCallback` queda con deps
   vacias (referencia estable) y el `React.memo` de `ItemCard` de verdad evita
   re-renders cuando filtro o busco sobre los 993 botones.

2. **La accion mas dificil: `REGISTRAR_ACTIVIDAD` (mantener el reducer puro).**
   El reto no fue el `switch` sino *no romper la pureza*. La tentacion era hacer
   `fecha: new Date()` dentro del reducer, pero eso lo vuelve impuro (no se puede
   testear con un input fijo). La solucion fue que `App` calcule `hoyISO()` **antes**
   de despachar y la mande en el `payload`. Por eso, cuando un clic deja una estampa
   en `pegada`, `App` despacha **dos** acciones: `CAMBIAR_ESTADO` y luego
   `REGISTRAR_ACTIVIDAD` con la fecha ya resuelta.

3. **La grafica mas compleja: el BarChart apilado.**
   Las otras dos son casi directas. La apilada me obligo a transformar la lista a
   un formato con una fila por confederacion y tres llaves (`faltante`, `repetida`,
   `pegada`) — eso es `datosApiladosPorCategoria` en `utils/estadisticas.js` —, a
   compartir `stackId="a"` entre los tres `<Bar>`, y a pelear con el eje X
   (etiquetas rotadas -35° con `interval={0}` para que no se encimen). Esa
   transformacion es la que envuelvo en `useMemo` para que solo se recalcule cuando
   cambian los filtros.

## Optimizacion (useMemo / useCallback / React.memo)

- **`useMemo`**: `itemsVisibles` (lista filtrada), `stats`, `porCategoria`,
  `apiladas` y `actividad7`. Sin esto, cada tecla en la busqueda recalculaba el
  filtro sobre 993 estampas + 3 transformaciones de grafica.
- **`useCallback`**: `ciclar`, `filtrar`, `limpiarFiltros`. Como `dispatch` es
  estable y a `ciclar` le paso el estado actual por parametro, estos handlers
  mantienen la misma referencia entre renders (deps vacias).
- **`React.memo`** en `ItemCard`: combinado con los handlers estables de arriba,
  al escribir en la busqueda **solo** se re-renderizan los botones que cambian,
  no los 993.

### Evidencia del Profiler

Medido con el album lleno (993 estampas, usando "rellenar demo") e interactuando
sobre la planilla, capturando los commits con React DevTools → Profiler.

![profiler con la optimizacion activa](docs/fase%203.png)

**Que muestra la captura (con `React.memo` + `useCallback` activos):** al
interactuar, cada commit se resuelve en **~0.2 ms** (Render). En el flamegraph lo
unico que aparece coloreado ("did render") son unos pocos componentes; **los ~993
botones `ItemCard` quedan en gris ("did not render")**, es decir NO se vuelven a
renderizar.

**Por que pasa eso (el antes/despues, explicado):** `ItemCard` esta envuelto en
`React.memo`, y los handlers que le bajo (`onCiclar`) van memorizados con
`useCallback` (deps vacias, referencia estable). Por eso, cuando cambia el estado
o un filtro, React compara las props de cada boton, ve que no cambiaron, y **se
salta su render**. Sin la optimizacion (quitando el `memo` de `ItemCard` o el
`useCallback`), `App` le pasaria una funcion nueva en cada render y los cientos de
botones se redibujarian todos (todos en color "did render"), multiplicando el
tiempo del commit. La captura es justamente la prueba de que eso **no** esta
pasando: la mayoria de los componentes estan en gris.

## Estado de los pendientes de fase 2

Lo que deje anotado para fase 3 en el README anterior, y que paso:

- **Numeracion real de las estampas**: hecho. El album entero usa la numeracion
  oficial (`FWC1`-`FWC19`, `MEX1`-`MEX20`, …, `CC1`-`CC14`) y cada boton muestra su
  codigo y su `#numero`.
- **Vista grid tipo planilla**: hecha. La planilla agrupa las estampas por
  seccion/equipo, con bandera, nombre y contador "pegadas/total", y se marca con
  un clic (`components/ListaItems.jsx`).
- **Categorias especiales FWC y Coca-Cola**: hechas (`especial: true`), se cuentan
  aparte en el chip "especiales".
- **Indicador de progreso "X/Y pegadas (%)"**: hecho, es la barra de arriba del panel.
- **Pendiente real para mas adelante**: persistir el album en el *backend*
  (columnas `codigo`/`pais`/`numero` en postgres y `PATCH /api/items/:codigo/estado`).
  En fase 3 el album persiste en `localStorage`; preferi enfocar la rubrica
  (reducer, graficas, memoizacion) antes que el backend.
