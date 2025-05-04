import express from 'express';
import cors from 'cors';
import pkg from 'pg';

const { Pool } = pkg;
const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // or use '*' for production
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));
app.use(express.json());

console.log("🔗 DATABASE_URL:", process.env.DATABASE_URL);
async function startServer() {
  try {
    const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});


    // ✅ Ensure table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        text VARCHAR(255) NOT NULL
      );
    `);

    // ✅ Routes
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

    // ✅ Start server only if DB is good
    app.listen(4000, () => {
      console.log('✅ Backend running on http://localhost:4000');
    });

  } catch (err) {
    console.error('❌ Failed to connect to PostgreSQL or start server:', err);
    process.exit(1); // crash the container so Render restarts
  }
}

startServer();

