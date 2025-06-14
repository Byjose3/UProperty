-- Migration to remove the redundant owner role and simplify to just Administrator and User roles
-- All users can now buy and sell properties

-- Update all existing roles to the simplified structure
UPDATE users
SET 
  role = CASE 
    WHEN role IN ('administrador', 'administrator', 'admin') THEN 'administrador'
    ELSE 'comprador(a)'
  END,
  updated_at = NOW()
WHERE role IS NOT NULL;

-- Remove any tipologia column if it exists (legacy field)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'tipologia') THEN
    ALTER TABLE users DROP COLUMN tipologia;
  END IF;
END $$;

-- Update the role constraint to only allow the two simplified roles
DO $$ 
BEGIN
  -- Drop existing constraint
  BEGIN
    ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
    ALTER TABLE users DROP CONSTRAINT IF EXISTS users_type_check;
  EXCEPTION
    WHEN undefined_object THEN
      NULL;
  END;
  
  -- Add the new simplified constraint
  ALTER TABLE users
  ADD CONSTRAINT users_role_check
  CHECK (role IN ('administrador', 'comprador(a)'));
END $$;

-- Set default role for new users
ALTER TABLE users ALTER COLUMN role SET DEFAULT 'comprador(a)';
