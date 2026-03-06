import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

import sequelize from './db/sequelize';
import { Admin } from './models';

async function seed() {
  const email = process.env.ADMIN_EMAIL || 'admin@patagonialands.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123';

  const hash = await bcrypt.hash(password, 12);

  await Admin.upsert({ email, password_hash: hash });

  console.log(`Admin user created/updated: ${email}`);
  await sequelize.close();
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
