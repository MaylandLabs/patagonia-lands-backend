ALTER TABLE properties DROP COLUMN IF EXISTS google_maps_embed;
ALTER TABLE properties DROP COLUMN IF EXISTS title_pt;
ALTER TABLE properties DROP COLUMN IF EXISTS description_pt;
ALTER TABLE properties DROP COLUMN IF EXISTS full_description_pt;
ALTER TABLE properties DROP COLUMN IF EXISTS activity_pt;
ALTER TABLE properties DROP COLUMN IF EXISTS status_pt;
ALTER TABLE properties DROP COLUMN IF EXISTS whatsapp_message_pt;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS lat FLOAT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS lon FLOAT;

ALTER TABLE property_characteristics DROP COLUMN IF EXISTS label_pt;
ALTER TABLE property_features DROP COLUMN IF EXISTS text_pt;
