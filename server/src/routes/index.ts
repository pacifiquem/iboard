import { Router } from 'express';
import ideasRouter from './ideas';
import healthRouter from './health';

const router = Router();

// API routes
router.use('/ideas', ideasRouter);
router.use('/health', healthRouter);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    name: 'IBoard API',
    version: '1.0.0',
    description: 'Express API for IBoard application with security, rate limiting, and monitoring',
    endpoints: {
      ideas: '/api/ideas',
      health: '/api/health',
    },
    documentation: 'https://github.com/your-username/iboard-test',
  });
});

export default router;
