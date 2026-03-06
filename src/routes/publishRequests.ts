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

// Public
router.post('/', submitLimiter, validate(createPublishRequestSchema), createPublishRequest);

// Admin
router.get('/admin', authMiddleware, listPublishRequests);
router.patch('/admin/:id/read', authMiddleware, markAsRead);

export default router;
