import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './db.js';

// Route imports
import authRoutes from './routes/auth.routes.js';
import packagesRoutes from './routes/packages.routes.js';
import enquiriesRoutes from './routes/enquiries.routes.js';
import agreementsRoutes from './routes/agreements.routes.js';
import quotationsRoutes from './routes/quotations.routes.js';
import tasksRoutes from './routes/tasks.routes.js';
import scheduleRoutes from './routes/schedule.routes.js';
import invoicesRoutes from './routes/invoices.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import notificationsRoutes from './routes/notifications.routes.js';
import vendorRoutes from './routes/vendor.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[API] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Mount API Routes (supports both /api and /api/v1 prefixes)
const apiRouter = express.Router();

apiRouter.get('/health', (req, res) => {
  return res.json({
    status: 'ONLINE',
    service: 'The Royal Knot Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    architecture: 'Node.js Express + Prisma ORM + PostgreSQL',
    modules: 11,
    roles: ['ADMIN', 'PLANNER', 'CLIENT', 'VENDOR'],
  });
});

apiRouter.use('/auth', authRoutes);
apiRouter.use('/packages', packagesRoutes);
apiRouter.use('/enquiries', enquiriesRoutes);
apiRouter.use('/agreements', agreementsRoutes);
apiRouter.use('/quotations', quotationsRoutes);
apiRouter.use('/tasks', tasksRoutes);
apiRouter.use('/schedule', scheduleRoutes);
apiRouter.use('/invoices', invoicesRoutes);
apiRouter.use('/analytics', analyticsRoutes);
apiRouter.use('/notifications', notificationsRoutes);
apiRouter.use('/vendor', vendorRoutes);

// Mount under both prefixes
app.use('/api/v1', apiRouter);
app.use('/api', apiRouter);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[SERVER ERROR]', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start Server
function startServer() {
  connectDatabase().catch((err) => {
    console.warn('Database initialization note:', err.message);
  });

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`====================================================`);
    console.log(`👑 THE ROYAL KNOT — LUXURY WEDDING PLATFORM BACKEND `);
    console.log(`   Running on: http://localhost:${PORT}             `);
    console.log(`   Health:     http://localhost:${PORT}/api/health  `);
    console.log(`   Frontend:   http://localhost:5173                `);
    console.log(`====================================================`);
  });
}

startServer();
