import { Request, Response } from 'express';
import { PublishRequest } from '../models';
import { sendPublishRequestNotification } from '../utils/mailer';

// Public: submit publish request
export async function createPublishRequest(req: Request, res: Response) {
  try {
    const result = await PublishRequest.create(req.body);

    // Send email notification (non-blocking)
    sendPublishRequestNotification(req.body).catch(err =>
      console.error('Failed to send notification email:', err)
    );

    res.status(201).json(result);
  } catch (err) {
    console.error('Create publish request error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Admin: list publish requests
export async function listPublishRequests(req: Request, res: Response) {
  try {
    const { read, page = '1', limit = '20' } = req.query;
    const where: any = {};

    if (read === 'true') where.read = true;
    else if (read === 'false') where.read = false;

    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 20));
    const offset = (pageNum - 1) * limitNum;

    const { count: total, rows: data } = await PublishRequest.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit: limitNum,
      offset,
    });

    res.json({
      data,
      pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    console.error('List publish requests error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Admin: mark as read
export async function markAsRead(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const request = await PublishRequest.findByPk(id);
    if (!request) {
      res.status(404).json({ error: 'Publish request not found' });
      return;
    }
    await request.update({ read: true });
    res.json(request);
  } catch (err) {
    console.error('Mark as read error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
