CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE properties (
  id SERIAL PRIMARY KEY,
  title_es VARCHAR(500),
  title_en VARCHAR(500),
  description_es TEXT,
  description_en TEXT,
  full_description_es TEXT,
  full_description_en TEXT,
  price VARCHAR(100),
  hectares INTEGER,
  province VARCHAR(255),
  zone VARCHAR(255),
  location VARCHAR(500),
  activity_es VARCHAR(255),
  activity_en VARCHAR(255),
  status_es VARCHAR(100),
  status_en VARCHAR(100),
  featured BOOLEAN DEFAULT false,
  visible BOOLEAN DEFAULT true,
  whatsapp_message_es TEXT,
  whatsapp_message_en TEXT,
  google_maps_embed TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE property_images (
  id SERIAL PRIMARY KEY,
  property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE property_characteristics (
  id SERIAL PRIMARY KEY,
  property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  label_es VARCHAR(255),
  label_en VARCHAR(255),
  value VARCHAR(500),
  position INTEGER DEFAULT 0
);

CREATE TABLE property_features (
  id SERIAL PRIMARY KEY,
  property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  text_es TEXT,
  text_en TEXT,
  position INTEGER DEFAULT 0
);

CREATE TABLE publish_requests (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(100),
  province VARCHAR(255),
  hectares INTEGER,
  activity VARCHAR(255),
  description TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_properties_visible ON properties(visible);
CREATE INDEX idx_properties_featured ON properties(featured);
CREATE INDEX idx_properties_province ON properties(province);
CREATE INDEX idx_property_images_property_id ON property_images(property_id);
CREATE INDEX idx_property_characteristics_property_id ON property_characteristics(property_id);
CREATE INDEX idx_property_features_property_id ON property_features(property_id);
