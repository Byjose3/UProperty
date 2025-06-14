-- Fix for the role column in users table
-- First check if the column exists, if not add it
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'role') THEN
    ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'buyer';
  END IF;
END
$$;

-- Ensure the role column is included in the schema cache
COMMENT ON COLUMN users.role IS 'User role (buyer, owner, admin, etc)';

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
