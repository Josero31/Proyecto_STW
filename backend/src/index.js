import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// cors abierto al front local
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

app.listen(PORT, () => {
  console.log('api en puerto ' + PORT);
});
