import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// pool de postgres
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export const query = (texto, params) => pool.query(texto, params);

export default pool;
