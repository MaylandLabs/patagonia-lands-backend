import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/sequelize';

interface PropertyImageAttributes {
  id?: number;
  property_id: number;
  url: string;
  position?: number;
  created_at?: Date;
}

class PropertyImage extends Model<PropertyImageAttributes> implements PropertyImageAttributes {
  declare id: number;
  declare property_id: number;
  declare url: string;
  declare position: number;
  declare created_at: Date;
}

PropertyImage.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    property_id: { type: DataTypes.INTEGER, allowNull: false },
    url: { type: DataTypes.TEXT, allowNull: false },
    position: { type: DataTypes.INTEGER, defaultValue: 0 },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    tableName: 'property_images',
    timestamps: false,
  }
);

export default PropertyImage;
