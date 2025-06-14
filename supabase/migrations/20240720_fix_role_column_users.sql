-- Fix for the role column in users table

-- First check if the column exists, if not add it
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'role') THEN
    ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'comprador(a)';
  END IF;
END
$$;

-- Update the role column from the type column if role is null (only if role column exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'role') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'type') THEN
      UPDATE users
      SET role = type
      WHERE role IS NULL AND type IS NOT NULL;
    END IF;
  END IF;
END
$$;

-- Ensure the role column is included in the schema cache
COMMENT ON COLUMN users.role IS 'User role (administrador, proprietario(a), comprador(a))';

-- Add a check constraint to ensure only allowed roles can be inserted
DO $$ 
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
  CHECK (role IN ('administrador', 'proprietario(a)', 'comprador(a)'));
END $$;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';