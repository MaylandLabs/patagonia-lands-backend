import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createPublishRequestSchema } from '../validators/publishRequest';
import { createPublishRequest, listPublishRequests, markAsRead } from '../controllers/publishRequests';

const router = Router();

const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: 'Too many requests, please try again later' },
});

/**
 * @swagger
 * /api/publish-requests:
 *   post:
 *     tags: [Publish Requests]
 *     summary: Submit a publish request (publicar campo)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email]
 *             properties:
 *               name: { type: string }
 *               email: { type: string, format: email }
 *               phone: { type: string }
 *               province: { type: string }
 *               hectares: { type: integer }
 *               activity: { type: string }
 *               description: { type: string }
 *     responses:
 *       201:
 *         description: Request submitted
 */
router.post('/', submitLimiter, validate(createPublishRequestSchema), createPublishRequest);

/**
 * @swagger
 * /api/publish-requests/admin:
 *   get:
 *     tags: [Publish Requests]
 *     summary: List all publish requests
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: read
 *         schema: { type: string, enum: ['true', 'false'] }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Paginated list of publish requests
 *       401:
 *         description: Unauthorized
 */
router.get('/admin', authMiddleware, listPublishRequests);

/**
 * @swagger
 * /api/publish-requests/admin/{id}/read:
 *   patch:
 *     tags: [Publish Requests]
 *     summary: Mark a publish request as read
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Marked as read
 *       404:
 *         description: Request not found
 */
router.patch('/admin/:id/read', authMiddleware, markAsRead);

export default router;
