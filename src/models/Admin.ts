import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/sequelize';

interface AdminAttributes {
  id?: number;
  username?: string;
  email: string;
  password_hash: string;
  created_at?: Date;
}

class Admin extends Model<AdminAttributes> implements AdminAttributes {
  declare id: number;
  declare username: string;
  declare email: string;
  declare password_hash: string;
  declare created_at: Date;
}

Admin.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING(255), unique: true },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    password_hash: { type: DataTypes.STRING(255), allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    tableName: 'admins',
    timestamps: false,
  }
);

export default Admin;
