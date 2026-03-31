import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { StringValue } from 'ms';
import { Op } from 'sequelize';
import { Admin } from '../models';

export async function login(req: Request, res: Response) {
  try {
    const { email, username, password } = req.body;

    const login = username || email;
    if (!login) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const admin = await Admin.findOne({
      where: { [Op.or]: [{ email: login }, { username: login }] },
    });
    if (!admin) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET!, {
      expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as StringValue,
    });

    res.json({ token, admin: { id: admin.id, email: admin.email } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
