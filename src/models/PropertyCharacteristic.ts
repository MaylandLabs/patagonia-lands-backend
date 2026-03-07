import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/sequelize';

interface PropertyCharacteristicAttributes {
  id?: number;
  property_id: number;
  label_es?: string;
  label_en?: string;
  value: string;
  position?: number;
}

class PropertyCharacteristic extends Model<PropertyCharacteristicAttributes> implements PropertyCharacteristicAttributes {
  declare id: number;
  declare property_id: number;
  declare label_es: string;
  declare label_en: string;
  declare value: string;
  declare position: number;
}

PropertyCharacteristic.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    property_id: { type: DataTypes.INTEGER, allowNull: false },
    label_es: { type: DataTypes.STRING(255) },
    label_en: { type: DataTypes.STRING(255) },
    value: { type: DataTypes.STRING(500) },
    position: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    sequelize,
    tableName: 'property_characteristics',
    timestamps: false,
  }
);

export default PropertyCharacteristic;
