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

/**
 * @swagger
 * /api/properties:
 *   get:
 *     tags: [Properties]
 *     summary: List visible properties
 *     parameters:
 *       - in: query
 *         name: province
 *         schema: { type: string }
 *       - in: query
 *         name: activity
 *         schema: { type: string }
 *       - in: query
 *         name: min_hectares
 *         schema: { type: integer }
 *       - in: query
 *         name: max_hectares
 *         schema: { type: integer }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: [created_at, price, hectares, title_es] }
 *       - in: query
 *         name: order
 *         schema: { type: string, enum: [asc, desc] }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 12 }
 *     responses:
 *       200:
 *         description: Paginated list of visible properties
 */
router.get('/', listProperties);

/**
 * @swagger
 * /api/properties/featured:
 *   get:
 *     tags: [Properties]
 *     summary: List featured visible properties
 *     responses:
 *       200:
 *         description: List of featured properties
 */
router.get('/featured', listFeaturedProperties);

/**
 * @swagger
 * /api/properties/{id}:
 *   get:
 *     tags: [Properties]
 *     summary: Get single property with images, characteristics, and features
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Property details
 *       404:
 *         description: Property not found
 */
router.get('/:id', getProperty);

/**
 * @swagger
 * /api/properties/admin/list:
 *   get:
 *     tags: [Admin Properties]
 *     summary: List all properties (including hidden)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Paginated list of all properties
 *       401:
 *         description: Unauthorized
 */
router.get('/admin/list', authMiddleware, adminListProperties);

/**
 * @swagger
 * /api/properties/admin:
 *   post:
 *     tags: [Admin Properties]
 *     summary: Create a property
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title_es: { type: string }
 *               title_en: { type: string }
 *               description_es: { type: string }
 *               description_en: { type: string }
 *               full_description_es: { type: string }
 *               full_description_en: { type: string }
 *               price: { type: string }
 *               hectares: { type: integer }
 *               province: { type: string }
 *               zone: { type: string }
 *               location: { type: string }
 *               activity_es: { type: string }
 *               activity_en: { type: string }
 *               status_es: { type: string }
 *               status_en: { type: string }
 *               featured: { type: boolean }
 *               visible: { type: boolean }
 *               whatsapp_message_es: { type: string }
 *               whatsapp_message_en: { type: string }
 *               lat: { type: number }
 *               lon: { type: number }
 *               characteristics:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     label_es: { type: string }
 *                     label_en: { type: string }
 *                     value: { type: string }
 *                     position: { type: integer }
 *               features:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     text_es: { type: string }
 *                     text_en: { type: string }
 *                     position: { type: integer }
 *     responses:
 *       201:
 *         description: Property created
 *       401:
 *         description: Unauthorized
 */
router.post('/admin', authMiddleware, validate(createPropertySchema), createProperty);

/**
 * @swagger
 * /api/properties/admin/{id}:
 *   put:
 *     tags: [Admin Properties]
 *     summary: Update a property
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Property updated
 *       404:
 *         description: Property not found
 */
router.put('/admin/:id', authMiddleware, validate(updatePropertySchema), updateProperty);

/**
 * @swagger
 * /api/properties/admin/{id}:
 *   delete:
 *     tags: [Admin Properties]
 *     summary: Delete a property
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Property deleted
 *       404:
 *         description: Property not found
 */
router.delete('/admin/:id', authMiddleware, deleteProperty);

/**
 * @swagger
 * /api/properties/admin/{id}/visibility:
 *   patch:
 *     tags: [Admin Properties]
 *     summary: Toggle property visibility
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Visibility toggled
 */
router.patch('/admin/:id/visibility', authMiddleware, toggleVisibility);

/**
 * @swagger
 * /api/properties/admin/{id}/featured:
 *   patch:
 *     tags: [Admin Properties]
 *     summary: Toggle property featured status
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Featured status toggled
 */
router.patch('/admin/:id/featured', authMiddleware, toggleFeatured);

/**
 * @swagger
 * /api/properties/admin/{id}/images:
 *   post:
 *     tags: [Admin Properties]
 *     summary: Upload images for a property
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Images uploaded
 *       404:
 *         description: Property not found
 */
router.post('/admin/:id/images', authMiddleware, upload.array('images', 20), uploadImages);

/**
 * @swagger
 * /api/properties/admin/{id}/images/reorder:
 *   put:
 *     tags: [Admin Properties]
 *     summary: Reorder property images
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id: { type: integer }
 *                     position: { type: integer }
 *     responses:
 *       200:
 *         description: Images reordered
 */
router.put('/admin/:id/images/reorder', authMiddleware, reorderImages);

/**
 * @swagger
 * /api/properties/admin/{id}/images/{imageId}:
 *   delete:
 *     tags: [Admin Properties]
 *     summary: Delete a property image
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Image deleted
 *       404:
 *         description: Image not found
 */
router.delete('/admin/:id/images/:imageId', authMiddleware, deleteImage);

export default router;
