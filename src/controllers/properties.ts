import { Request, Response } from 'express';
import { Op } from 'sequelize';
import path from 'path';
import fs from 'fs';
import { Property, PropertyImage, PropertyCharacteristic, PropertyFeature } from '../models';

function paramId(req: Request): string {
  return req.params.id as string;
}

// Public: list visible properties with filters
export async function listProperties(req: Request, res: Response) {
  try {
    const {
      province,
      activity,
      min_hectares,
      max_hectares,
      search,
      sort = 'created_at',
      order = 'desc',
      page = '1',
      limit = '12',
    } = req.query;

    const where: any = { visible: true };

    if (province) where.province = province;
    if (activity) {
      where[Op.or] = [
        { activity_es: activity },
        { activity_en: activity },
        { activity_pt: activity },
      ];
    }
    if (min_hectares || max_hectares) {
      where.hectares = {};
      if (min_hectares) where.hectares[Op.gte] = parseInt(min_hectares as string);
      if (max_hectares) where.hectares[Op.lte] = parseInt(max_hectares as string);
    }
    if (search) {
      const searchCondition = {
        [Op.or]: [
          { title_es: { [Op.iLike]: `%${search}%` } },
          { title_en: { [Op.iLike]: `%${search}%` } },
          { title_pt: { [Op.iLike]: `%${search}%` } },
          { description_es: { [Op.iLike]: `%${search}%` } },
          { description_en: { [Op.iLike]: `%${search}%` } },
          { description_pt: { [Op.iLike]: `%${search}%` } },
        ],
      };
      Object.assign(where, searchCondition);
    }

    const allowedSorts = ['created_at', 'price', 'hectares', 'title_es'];
    const sortCol = allowedSorts.includes(sort as string) ? (sort as string) : 'created_at';
    const sortOrder = order === 'asc' ? 'ASC' : 'DESC';

    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 12));
    const offset = (pageNum - 1) * limitNum;

    const { count: total, rows: data } = await Property.findAndCountAll({
      where,
      order: [[sortCol, sortOrder]],
      limit: limitNum,
      offset,
      include: [
        {
          model: PropertyImage,
          as: 'images',
          attributes: ['url'],
          order: [['position', 'ASC']],
          limit: 1,
          separate: true,
        },
      ],
    });

    res.json({
      data,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    console.error('List properties error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Public: featured properties
export async function listFeaturedProperties(_req: Request, res: Response) {
  try {
    const data = await Property.findAll({
      where: { visible: true, featured: true },
      order: [['updated_at', 'DESC']],
      include: [
        {
          model: PropertyImage,
          as: 'images',
          attributes: ['url'],
          order: [['position', 'ASC']],
          limit: 1,
          separate: true,
        },
      ],
    });
    res.json({ data });
  } catch (err) {
    console.error('List featured error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Public: single property with relations
export async function getProperty(req: Request, res: Response) {
  try {
    const id = paramId(req);

    const property = await Property.findOne({
      where: { id, visible: true },
      include: [
        { model: PropertyImage, as: 'images', order: [['position', 'ASC']], separate: true },
        { model: PropertyCharacteristic, as: 'characteristics', order: [['position', 'ASC']], separate: true },
        { model: PropertyFeature, as: 'features', order: [['position', 'ASC']], separate: true },
      ],
    });

    if (!property) {
      res.status(404).json({ error: 'Property not found' });
      return;
    }

    res.json(property);
  } catch (err) {
    console.error('Get property error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Admin: list all properties
export async function adminListProperties(req: Request, res: Response) {
  try {
    const { page = '1', limit = '20' } = req.query;
    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 20));
    const offset = (pageNum - 1) * limitNum;

    const { count: total, rows: data } = await Property.findAndCountAll({
      order: [['created_at', 'DESC']],
      limit: limitNum,
      offset,
      include: [
        {
          model: PropertyImage,
          as: 'images',
          attributes: ['url'],
          order: [['position', 'ASC']],
          limit: 1,
          separate: true,
        },
      ],
    });

    res.json({
      data,
      pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    console.error('Admin list properties error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Admin: create property
export async function createProperty(req: Request, res: Response) {
  try {
    const { characteristics, features, ...propertyData } = req.body;

    const property = await Property.create(propertyData);

    if (characteristics?.length) {
      await PropertyCharacteristic.bulkCreate(
        characteristics.map((c: any) => ({ ...c, property_id: property.id, position: c.position || 0 }))
      );
    }

    if (features?.length) {
      await PropertyFeature.bulkCreate(
        features.map((f: any) => ({ ...f, property_id: property.id, position: f.position || 0 }))
      );
    }

    const result = await Property.findByPk(property.id, {
      include: [
        { model: PropertyCharacteristic, as: 'characteristics' },
        { model: PropertyFeature, as: 'features' },
      ],
    });

    res.status(201).json(result);
  } catch (err) {
    console.error('Create property error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Admin: update property
export async function updateProperty(req: Request, res: Response) {
  try {
    const id = paramId(req);
    const { characteristics, features, ...propertyData } = req.body;

    const property = await Property.findByPk(id);
    if (!property) {
      res.status(404).json({ error: 'Property not found' });
      return;
    }

    if (Object.keys(propertyData).length > 0) {
      await property.update({ ...propertyData, updated_at: new Date() });
    }

    if (characteristics !== undefined) {
      await PropertyCharacteristic.destroy({ where: { property_id: id } });
      if (characteristics.length) {
        await PropertyCharacteristic.bulkCreate(
          characteristics.map((c: any) => ({ ...c, property_id: id, position: c.position || 0 }))
        );
      }
    }

    if (features !== undefined) {
      await PropertyFeature.destroy({ where: { property_id: id } });
      if (features.length) {
        await PropertyFeature.bulkCreate(
          features.map((f: any) => ({ ...f, property_id: id, position: f.position || 0 }))
        );
      }
    }

    const result = await Property.findByPk(id, {
      include: [
        { model: PropertyCharacteristic, as: 'characteristics' },
        { model: PropertyFeature, as: 'features' },
      ],
    });

    res.json(result);
  } catch (err) {
    console.error('Update property error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Admin: delete property
export async function deleteProperty(req: Request, res: Response) {
  try {
    const id = paramId(req);
    const deleted = await Property.destroy({ where: { id } });
    if (!deleted) {
      res.status(404).json({ error: 'Property not found' });
      return;
    }
    res.json({ message: 'Property deleted' });
  } catch (err) {
    console.error('Delete property error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Admin: toggle visibility
export async function toggleVisibility(req: Request, res: Response) {
  try {
    const id = paramId(req);
    const property = await Property.findByPk(id);
    if (!property) {
      res.status(404).json({ error: 'Property not found' });
      return;
    }
    await property.update({ visible: !property.visible, updated_at: new Date() });
    res.json({ id: property.id, visible: property.visible });
  } catch (err) {
    console.error('Toggle visibility error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Admin: toggle featured
export async function toggleFeatured(req: Request, res: Response) {
  try {
    const id = paramId(req);
    const property = await Property.findByPk(id);
    if (!property) {
      res.status(404).json({ error: 'Property not found' });
      return;
    }
    await property.update({ featured: !property.featured, updated_at: new Date() });
    res.json({ id: property.id, featured: property.featured });
  } catch (err) {
    console.error('Toggle featured error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Admin: upload images
export async function uploadImages(req: Request, res: Response) {
  try {
    const id = paramId(req);
    const files = req.files as Express.Multer.File[];

    if (!files?.length) {
      res.status(400).json({ error: 'No images provided' });
      return;
    }

    const property = await Property.findByPk(id);
    if (!property) {
      res.status(404).json({ error: 'Property not found' });
      return;
    }

    const maxPos = await PropertyImage.max<number, PropertyImage>('position', {
      where: { property_id: id },
    });
    let position = (maxPos || 0) + 1;

    const created = await PropertyImage.bulkCreate(
      files.map((file) => ({
        property_id: Number(id),
        url: `/uploads/${file.filename}`,
        position: position++,
      }))
    );

    res.status(201).json({ data: created });
  } catch (err) {
    console.error('Upload images error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Admin: reorder images
export async function reorderImages(req: Request, res: Response) {
  try {
    const id = paramId(req);
    const { order } = req.body as { order: { id: number; position: number }[] };

    if (!order?.length) {
      res.status(400).json({ error: 'No order provided' });
      return;
    }

    await Promise.all(
      order.map((item) =>
        PropertyImage.update({ position: item.position }, { where: { id: item.id, property_id: id } })
      )
    );

    const images = await PropertyImage.findAll({
      where: { property_id: id },
      order: [['position', 'ASC']],
    });

    res.json({ data: images });
  } catch (err) {
    console.error('Reorder images error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Admin: delete image
export async function deleteImage(req: Request, res: Response) {
  try {
    const id = paramId(req);
    const imageId = req.params.imageId as string;

    const image = await PropertyImage.findOne({ where: { id: imageId, property_id: id } });
    if (!image) {
      res.status(404).json({ error: 'Image not found' });
      return;
    }

    // Delete file from disk
    const filePath = path.join(__dirname, '../..', image.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await image.destroy();
    res.json({ message: 'Image deleted' });
  } catch (err) {
    console.error('Delete image error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
