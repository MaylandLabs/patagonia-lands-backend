import Property from './Property';
import PropertyImage from './PropertyImage';
import PropertyCharacteristic from './PropertyCharacteristic';
import PropertyFeature from './PropertyFeature';
import Admin from './Admin';
import PublishRequest from './PublishRequest';

// Associations
Property.hasMany(PropertyImage, { foreignKey: 'property_id', as: 'images', onDelete: 'CASCADE' });
PropertyImage.belongsTo(Property, { foreignKey: 'property_id' });

Property.hasMany(PropertyCharacteristic, { foreignKey: 'property_id', as: 'characteristics', onDelete: 'CASCADE' });
PropertyCharacteristic.belongsTo(Property, { foreignKey: 'property_id' });

Property.hasMany(PropertyFeature, { foreignKey: 'property_id', as: 'features', onDelete: 'CASCADE' });
PropertyFeature.belongsTo(Property, { foreignKey: 'property_id' });

export { Property, PropertyImage, PropertyCharacteristic, PropertyFeature, Admin, PublishRequest };
