import express from 'express';
import session from 'express-session';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import './database.js';
import authRouter from './routes/auth.js';
import productsRouter from './routes/products.js';
import categoriesRouter from './routes/categories.js';
import ordersRouter from './routes/orders.js';
import settingsRouter from './routes/settings.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3001;

// Uploads dir
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'electric-store-secret-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));

app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/settings', settingsRouter);

app.listen(PORT, () => {
  console.log(`🚀 API server running on port ${PORT}`);
});
