import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

import sequelize from './db/sequelize';
import './models';
import authRoutes from './routes/auth';
import propertiesRoutes from './routes/properties';
import publishRequestsRoutes from './routes/publishRequests';

const app = express();
const PORT = process.env.PORT || 6789;

// Security
app.use(helmet());

// CORS
const origins = process.env.CORS_ORIGINS?.split(',') || [];
app.use(cors({ origin: origins, credentials: true }));

// Body parsing
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertiesRoutes);
app.use('/api/publish-requests', publishRequestsRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Start server
async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start:', err);
    process.exit(1);
  }
}

start();

export default app;
