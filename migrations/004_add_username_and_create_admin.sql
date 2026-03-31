-- Add username column to admins
ALTER TABLE admins ADD COLUMN IF NOT EXISTS username VARCHAR(255) UNIQUE;

-- Create admin user with username rfv31
INSERT INTO admins (username, email, password_hash)
VALUES ('rfv31', 'rfv31@patagonialands.com', '$2b$12$7LuY8ik87SOGr32MWlwF0.ogJHar8Sebap3mylXxsbP0xAYW.yCxa')
ON CONFLICT (email) DO UPDATE SET username = EXCLUDED.username;
