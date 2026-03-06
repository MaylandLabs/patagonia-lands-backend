import { z } from 'zod';

export const createPublishRequestSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  province: z.string().optional(),
  hectares: z.number().int().positive().optional(),
  activity: z.string().optional(),
  description: z.string().optional(),
});
