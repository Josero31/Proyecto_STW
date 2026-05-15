-- tablas del album mundial 2026

CREATE TABLE IF NOT EXISTS items (
  id           UUID PRIMARY KEY,
  nombre       TEXT NOT NULL,
  categoria_id TEXT NOT NULL,
  estado       TEXT NOT NULL,
  atributos    JSONB DEFAULT '{}'::jsonb,
  activo       BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS registros (
  id      UUID PRIMARY KEY,
  item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  fecha   DATE NOT NULL,
  valor   NUMERIC NOT NULL,
  notas   TEXT DEFAULT ''
);
