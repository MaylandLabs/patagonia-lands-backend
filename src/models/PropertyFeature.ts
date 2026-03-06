import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/sequelize';

interface PropertyFeatureAttributes {
  id?: number;
  property_id: number;
  text_es?: string;
  text_en?: string;
  text_pt?: string;
  position?: number;
}

class PropertyFeature extends Model<PropertyFeatureAttributes> implements PropertyFeatureAttributes {
  declare id: number;
  declare property_id: number;
  declare text_es: string;
  declare text_en: string;
  declare text_pt: string;
  declare position: number;
}

PropertyFeature.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    property_id: { type: DataTypes.INTEGER, allowNull: false },
    text_es: { type: DataTypes.TEXT },
    text_en: { type: DataTypes.TEXT },
    text_pt: { type: DataTypes.TEXT },
    position: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    sequelize,
    tableName: 'property_features',
    timestamps: false,
  }
);

export default PropertyFeature;
