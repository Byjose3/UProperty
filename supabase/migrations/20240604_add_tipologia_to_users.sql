-- Add tipologia column to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS tipologia TEXT;

-- Set default value for tipologia for existing users
-- Instead of copying from 'role' which doesn't exist, we'll set a default value
UPDATE public.users SET tipologia = 'Buyer' WHERE tipologia IS NULL;

-- Note: Removed the line that adds the table to supabase_realtime publication
-- as it was already a member of that publication
