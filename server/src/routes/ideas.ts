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

/**
 * @swagger
 * /ideas:
 *   get:
 *     summary: Get all ideas
 *     description: Retrieve a list of all ideas with their vote counts
 *     tags: [Ideas]
 *     responses:
 *       200:
 *         description: Successfully retrieved ideas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Idea'
 *                 count:
 *                   type: integer
 *                   example: 10
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/', getAllIdeas);

/**
 * @swagger
 * /ideas/stats:
 *   get:
 *     summary: Get ideas statistics
 *     description: Retrieve statistics about ideas including total count, total votes, etc.
 *     tags: [Ideas]
 *     responses:
 *       200:
 *         description: Successfully retrieved statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalIdeas:
 *                       type: integer
 *                       example: 25
 *                     totalUpvotes:
 *                       type: integer
 *                       example: 150
 *                     totalDownvotes:
 *                       type: integer
 *                       example: 30
 *                     averageScore:
 *                       type: number
 *                       example: 4.8
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/stats', getIdeasStats);

/**
 * @swagger
 * /ideas/{id}:
 *   get:
 *     summary: Get idea by ID
 *     description: Retrieve a specific idea by its unique identifier
 *     tags: [Ideas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the idea
 *         example: 123e4567-e89b-12d3-a456-426614174000
 *     responses:
 *       200:
 *         description: Successfully retrieved the idea
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Idea'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/:id', getIdeaById);

/**
 * @swagger
 * /ideas:
 *   post:
 *     summary: Create a new idea
 *     description: Submit a new idea to the board
 *     tags: [Ideas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateIdeaRequest'
 *     responses:
 *       201:
 *         description: Idea created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Idea'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/', createIdeaLimiter, createIdeaValidation, createIdea);

/**
 * @swagger
 * /ideas/upvote:
 *   post:
 *     summary: Upvote an idea
 *     description: Increment the upvote count for a specific idea
 *     tags: [Ideas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VoteRequest'
 *     responses:
 *       200:
 *         description: Idea upvoted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Idea upvoted successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/upvote', strictLimiter, upvoteIdeaValidation, upvoteIdea);

/**
 * @swagger
 * /ideas/downvote:
 *   post:
 *     summary: Downvote an idea
 *     description: Increment the downvote count for a specific idea
 *     tags: [Ideas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VoteRequest'
 *     responses:
 *       200:
 *         description: Idea downvoted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Idea downvoted successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/downvote', strictLimiter, downvoteIdeaValidation, downvoteIdea);

export default router;
