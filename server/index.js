import express from 'express';
import cors from 'cors';
import pkg from 'pg';

const { Pool } = pkg;
const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // ✅ must exactly match frontend URL
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false, // needed for Render's self-signed cert
  }
});

pool.query(`
  CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    text VARCHAR(255) NOT NULL
  );
`);

app.get('/todos', async (req, res) => {
  const result = await pool.query('SELECT * FROM todos ORDER BY id DESC');
  res.json(result.rows);
});

app.post('/todos', async (req, res) => {
  const { text } = req.body;
  await pool.query('INSERT INTO todos (text) VALUES ($1)', [text]);
  res.status(201).json({ message: 'Added' });
});

app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM todos WHERE id = $1', [id]);
  res.status(200).json({ message: 'Deleted' });
});

app.listen(4000, () => console.log('✅ Backend running on http://localhost:4000'));
