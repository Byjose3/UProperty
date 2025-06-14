-- Update existing user roles to standardized values

-- First, update all administrator/admin roles to 'administrador'
UPDATE users
SET 
  type = 'administrador',
  updated_at = NOW()
WHERE type IN ('administrator', 'admin') OR LOWER(type) = 'administrator' OR LOWER(type) = 'admin';

-- Update all owner/buyer/builder/investor roles to 'comprador(a)'
UPDATE users
SET 
  role = 'comprador(a)',
  updated_at = NOW()
WHERE role IN ('owner', 'proprietario(a)', 'buyer', 'builder', 'investor') 
   OR LOWER(role) IN ('owner', 'proprietario(a)', 'buyer', 'builder', 'investor');

-- Catch any remaining non-standard roles and set them to 'comprador(a)' as default
UPDATE users
SET 
  role = 'comprador(a)',
  updated_at = NOW()
WHERE role NOT IN ('administrador', 'comprador(a)');

-- Remove the type column if it exists
DO $ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'type') THEN
    ALTER TABLE users DROP COLUMN type;
  END IF;
END $;

-- Add a check constraint to ensure only allowed roles can be inserted in the future
DO $ 
BEGIN
  -- Drop the constraint if it exists
  BEGIN
    ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
  EXCEPTION
    WHEN undefined_object THEN
      NULL;
  END;
  
  -- Add the constraint
  ALTER TABLE users
  ADD CONSTRAINT users_role_check
  CHECK (role IN ('administrador', 'comprador(a)'));
END $;
