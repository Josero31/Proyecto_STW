import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pool from './database.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');

pool.query(sql).then(() => {
  console.log('schema aplicado');
  pool.end();
});
