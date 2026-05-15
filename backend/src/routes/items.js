import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { query } from '../db/database.js';

const router = Router();

// devolver solo los activos
router.get('/', async (req, res) => {
  const r = await query('SELECT * FROM items WHERE activo = TRUE');
  res.json(r.rows);
});

router.post('/', async (req, res) => {
  const { nombre, categoriaId, estado, atributos } = req.body;
  if (!nombre || !categoriaId) {
    return res.status(400).json({ error: 'falta nombre o categoria' });
  }
  const id = randomUUID();
  const r = await query(
    'INSERT INTO items (id, nombre, categoria_id, estado, atributos) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [id, nombre, categoriaId, estado || 'faltante', atributos || {}]
  );
  res.status(201).json(r.rows[0]);
});

router.put('/:id', async (req, res) => {
  const { nombre, categoriaId, estado, atributos } = req.body;
  const r = await query(
    `UPDATE items SET
       nombre = COALESCE($2, nombre),
       categoria_id = COALESCE($3, categoria_id),
       estado = COALESCE($4, estado),
       atributos = COALESCE($5, atributos)
     WHERE id = $1 RETURNING *`,
    [req.params.id, nombre, categoriaId, estado, atributos]
  );
  if (r.rows.length === 0) return res.status(404).json({ error: 'no existe' });
  res.json(r.rows[0]);
});

// archiva, no borra fisico
router.delete('/:id', async (req, res) => {
  const r = await query('UPDATE items SET activo = FALSE WHERE id = $1', [req.params.id]);
  if (r.rowCount === 0) return res.status(404).json({ error: 'no existe' });
  res.status(204).end();
});

router.post('/:id/registro', async (req, res) => {
  const { fecha, valor, notas } = req.body;
  if (!fecha || valor === undefined) {
    return res.status(400).json({ error: 'falta fecha o valor' });
  }
  const id = randomUUID();
  const r = await query(
    'INSERT INTO registros (id, item_id, fecha, valor, notas) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [id, req.params.id, fecha, valor, notas || '']
  );
  res.status(201).json(r.rows[0]);
});

export default router;
