import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { upload } from '../middleware/upload';
import { createPropertySchema, updatePropertySchema } from '../validators/property';
import {
  listProperties,
  listFeaturedProperties,
  getProperty,
  adminListProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  toggleVisibility,
  toggleFeatured,
  uploadImages,
  reorderImages,
  deleteImage,
} from '../controllers/properties';

const router = Router();

// Public routes
router.get('/', listProperties);
router.get('/featured', listFeaturedProperties);
router.get('/:id', getProperty);

// Admin routes
router.get('/admin/list', authMiddleware, adminListProperties);
router.post('/admin', authMiddleware, validate(createPropertySchema), createProperty);
router.put('/admin/:id', authMiddleware, validate(updatePropertySchema), updateProperty);
router.delete('/admin/:id', authMiddleware, deleteProperty);
router.patch('/admin/:id/visibility', authMiddleware, toggleVisibility);
router.patch('/admin/:id/featured', authMiddleware, toggleFeatured);
router.post('/admin/:id/images', authMiddleware, upload.array('images', 20), uploadImages);
router.put('/admin/:id/images/reorder', authMiddleware, reorderImages);
router.delete('/admin/:id/images/:imageId', authMiddleware, deleteImage);

export default router;
