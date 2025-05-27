import express from 'express';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import schoolRoutes from './routes/school.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

export const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD
});

app.use(express.json());
app.use('/', schoolRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
