import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

import wallpaperRoutes from './routes/wallpapers.js';
import authRoutes from './routes/auth.js';
import passwordRoutes from './routes/password.js';
import contactRoutes from './routes/contact.js';
import messageRoutes from './routes/messages.js';
import { initDatabase, db } from './database/init.js'; // Import db instance

import detectPort from 'detect-port';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PREFERRED_PORT = parseInt(process.env.BACKEND_PORT || '5001', 10);

async function startServer() {
  try {
    const PORT = await detectPort(PREFERRED_PORT);

    await initDatabase();

    // Middleware
    app.use(cors({
      origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3001'], // Added 3001 for when 3000 is busy
      credentials: true,
    }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Serve uploaded images statically
    app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/wallpapers', wallpaperRoutes);
    app.use('/api/password', passwordRoutes);
    app.use('/api/contact', contactRoutes);
    app.use('/api/messages', messageRoutes);

    // Health check
    app.get('/api/health', (req, res) => {
      res.json({ status: 'ok', message: 'Server is running' });
    });

    if (PORT !== PREFERRED_PORT) {
      console.log(`Backend: Port ${PREFERRED_PORT} was in use, switched to ${PORT}.`);
    }

    const server = app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

    // Graceful shutdown logic
    const shutdown = () => {
      console.log('\nShutting down gracefully...');
      server.close(() => {
        console.log('HTTP server closed.');
        db.close((err) => {
          if (err) {
            console.error('Error closing database:', err.message);
          } else {
            console.log('Database connection closed.');
          }
          process.exit(0);
        });
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
