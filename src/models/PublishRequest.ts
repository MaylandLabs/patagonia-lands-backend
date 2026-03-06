import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/sequelize';

interface PublishRequestAttributes {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  province?: string;
  hectares?: number;
  activity?: string;
  description?: string;
  read?: boolean;
  created_at?: Date;
}

class PublishRequest extends Model<PublishRequestAttributes> implements PublishRequestAttributes {
  declare id: number;
  declare name: string;
  declare email: string;
  declare phone: string;
  declare province: string;
  declare hectares: number;
  declare activity: string;
  declare description: string;
  declare read: boolean;
  declare created_at: Date;
}

PublishRequest.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false },
    phone: { type: DataTypes.STRING(100) },
    province: { type: DataTypes.STRING(255) },
    hectares: { type: DataTypes.INTEGER },
    activity: { type: DataTypes.STRING(255) },
    description: { type: DataTypes.TEXT },
    read: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    tableName: 'publish_requests',
    timestamps: false,
  }
);

export default PublishRequest;
