import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler';
import { logger } from './utils/logger';
import sessionRoutes from './routes/session.routes';
import messageRoutes from './routes/message.routes';
import wppService from './services/wpp.service';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/session', sessionRoutes);
app.use('/messages', messageRoutes);

// Error handler
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server running on port ${PORT}`);
  // Initialize Whatsapp session automatically if configured or leave it to API
  logger.info('WhatsApp Service ready to be started via API');
});
