import express from 'express';
import cors from 'cors';
import pkg from 'pg';
const { Pool } = pkg;

const app = express();

// allow both local dev and your Render domain
const allowed = new Set([
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost',
  'https://todo-docker-app-frontend.onrender.com',
]);

app.use(cors({
  origin: (origin, cb) => cb(null, !origin || allowed.has(origin)),
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

app.use(express.json());

// construct connection string safely
const DATABASE_URL =
  process.env.DATABASE_URL ||
  `postgres://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'postgres'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'tododb'}`;

// Configure SSL for production databases (Render requires SSL)
const poolConfig = {
  connectionString: DATABASE_URL,
  ...(process.env.NODE_ENV === 'production' && {
    ssl: {
      rejectUnauthorized: false
    }
  })
};

const pool = new Pool(poolConfig);

// small retry loop so we don’t crash if DB comes up a tad late
async function waitForDb(retries = 20, delayMs = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      await pool.query('SELECT 1');
      return;
    } catch (e) {
      if (i === retries - 1) throw e;
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
}

async function startServer() {
  try {
    await waitForDb();

    await pool.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        text VARCHAR(255) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT now()
      );
    `);

    app.get('/health', async (_req, res) => {
      try {
        await pool.query('SELECT 1');
        res.json({ ok: true });
      } catch (e) {
        res.status(500).json({ ok: false, error: String(e) });
      }
    });

    app.get('/todos', async (_req, res) => {
      const result = await pool.query('SELECT id, text FROM todos ORDER BY id DESC');
      res.json(result.rows);
    });

    app.post('/todos', async (req, res) => {
      const { text } = req.body ?? {};
      if (!text || !String(text).trim()) return res.status(400).json({ message: 'text is required' });
      // return the created row so the frontend can use the real id
      const result = await pool.query('INSERT INTO todos (text) VALUES ($1) RETURNING id, text', [text]);
      res.status(201).json(result.rows[0]);
    });

    app.delete('/todos/:id', async (req, res) => {
      const { id } = req.params;
      await pool.query('DELETE FROM todos WHERE id = $1', [id]);
      res.status(200).json({ message: 'Deleted' });
    });

    const PORT = Number(process.env.PORT) || 4000;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Backend running on http://localhost:${PORT}`);
    });

    // graceful shutdown
    process.on('SIGTERM', async () => { await pool.end(); process.exit(0); });
    process.on('SIGINT', async () => { await pool.end(); process.exit(0); });

  } catch (err) {
    console.error('❌ Failed to connect to PostgreSQL or start server:', err);
    process.exit(1);
  }
}

startServer();
