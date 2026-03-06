import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { login } from '../controllers/auth';
import { validate } from '../middleware/validate';
import { loginSchema } from '../validators/auth';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts, please try again later' },
});

router.post('/login', authLimiter, validate(loginSchema), login);

export default router;
