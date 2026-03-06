import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/sequelize';

interface AdminAttributes {
  id?: number;
  email: string;
  password_hash: string;
  created_at?: Date;
}

class Admin extends Model<AdminAttributes> implements AdminAttributes {
  declare id: number;
  declare email: string;
  declare password_hash: string;
  declare created_at: Date;
}

Admin.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
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
