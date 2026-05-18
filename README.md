# Album Mundial 2026

Proyecto Web - STW 2026, UVG. Fase 1.

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

## Endpoints

- GET /api/items
- POST /api/items
- PUT /api/items/:id
- DELETE /api/items/:id (archiva, no borra)
- POST /api/items/:id/registro

## Tablas

items: id, nombre, categoria_id, estado, atributos (jsonb), activo

registros: id, item_id, fecha, valor, notas

## Estampas que use de prueba

- Messi (Grupo A) - pegada
- Mbappe (Grupo D) - repetida
- Vinicius (Grupo F) - faltante
- Bellingham (Grupo G) - pegada
- Cristiano (Grupo H) - faltante
