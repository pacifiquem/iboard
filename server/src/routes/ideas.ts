import { Router } from 'express';
import {
  getAllIdeas,
  getIdeaById,
  createIdea,
  upvoteIdea,
  downvoteIdea,
  getIdeasStats,
  createIdeaValidation,
  upvoteIdeaValidation,
  downvoteIdeaValidation,
} from '../controllers/ideasController';
import { ideasLimiter, createIdeaLimiter, strictLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(ideasLimiter);
router.get('/', getAllIdeas);
router.get('/stats', getIdeasStats);
router.get('/:id', getIdeaById);
router.post('/', createIdeaLimiter, createIdeaValidation, createIdea);
router.post('/upvote', strictLimiter, upvoteIdeaValidation, upvoteIdea);
router.post('/downvote', strictLimiter, downvoteIdeaValidation, downvoteIdea);

export default router;
