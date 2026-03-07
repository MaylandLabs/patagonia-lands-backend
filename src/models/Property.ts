import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/sequelize';

interface PropertyAttributes {
  id?: number;
  title_es?: string;
  title_en?: string;
  description_es?: string;
  description_en?: string;
  full_description_es?: string;
  full_description_en?: string;
  price?: string;
  hectares?: number;
  province?: string;
  zone?: string;
  location?: string;
  activity_es?: string;
  activity_en?: string;
  status_es?: string;
  status_en?: string;
  featured?: boolean;
  visible?: boolean;
  whatsapp_message_es?: string;
  whatsapp_message_en?: string;
  lat?: number;
  lon?: number;
  created_at?: Date;
  updated_at?: Date;
}

class Property extends Model<PropertyAttributes> implements PropertyAttributes {
  declare id: number;
  declare title_es: string;
  declare title_en: string;
  declare description_es: string;
  declare description_en: string;
  declare full_description_es: string;
  declare full_description_en: string;
  declare price: string;
  declare hectares: number;
  declare province: string;
  declare zone: string;
  declare location: string;
  declare activity_es: string;
  declare activity_en: string;
  declare status_es: string;
  declare status_en: string;
  declare featured: boolean;
  declare visible: boolean;
  declare whatsapp_message_es: string;
  declare whatsapp_message_en: string;
  declare lat: number;
  declare lon: number;
  declare created_at: Date;
  declare updated_at: Date;
}

Property.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title_es: { type: DataTypes.STRING(500) },
    title_en: { type: DataTypes.STRING(500) },
    description_es: { type: DataTypes.TEXT },
    description_en: { type: DataTypes.TEXT },
    full_description_es: { type: DataTypes.TEXT },
    full_description_en: { type: DataTypes.TEXT },
    price: { type: DataTypes.STRING(100) },
    hectares: { type: DataTypes.INTEGER },
    province: { type: DataTypes.STRING(255) },
    zone: { type: DataTypes.STRING(255) },
    location: { type: DataTypes.STRING(500) },
    activity_es: { type: DataTypes.STRING(255) },
    activity_en: { type: DataTypes.STRING(255) },
    status_es: { type: DataTypes.STRING(100) },
    status_en: { type: DataTypes.STRING(100) },
    featured: { type: DataTypes.BOOLEAN, defaultValue: false },
    visible: { type: DataTypes.BOOLEAN, defaultValue: true },
    whatsapp_message_es: { type: DataTypes.TEXT },
    whatsapp_message_en: { type: DataTypes.TEXT },
    lat: { type: DataTypes.FLOAT },
    lon: { type: DataTypes.FLOAT },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    tableName: 'properties',
    timestamps: false,
  }
);

export default Property;
