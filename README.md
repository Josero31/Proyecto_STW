# Album Mundial 2026

Proyecto Web - STW 2026, UVG. Fase 2.

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

## Captura

![app corriendo](docs/fase1.png)

## Nota para fase 3

Por ahora las estampas se siguen agregando una por una con el formulario. En la fase 3 quiero pre-cargar el album entero (FWC, los 48 paises con sus 20 estampas, y las CC: ~1000 estampas) a la base con un seed, y cambiar la UI a un grid donde solo le hago click a cada celda para marcarla pegada o repetida (como la planilla impresa del album).
