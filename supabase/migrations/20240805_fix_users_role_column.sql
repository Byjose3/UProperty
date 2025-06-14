-- Fix the users table role column and schema cache issues
-- This migration ensures the role column exists and is properly recognized

-- First, ensure the users table exists
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    name TEXT,
    token_identifier TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'active',
    nif TEXT,
    contact TEXT,
    subscription TEXT DEFAULT 'free'
);

-- Add the role column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'users' 
                   AND column_name = 'role') THEN
        ALTER TABLE public.users ADD COLUMN role TEXT DEFAULT 'comprador(a)';
    END IF;
END $$;

-- Update any NULL role values to default
UPDATE public.users SET role = 'comprador(a)' WHERE role IS NULL;

-- Add comment to the role column to help with schema cache
COMMENT ON COLUMN public.users.role IS 'User role: administrador, comprador(a)';

-- Ensure proper indexes exist
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);

-- Enable realtime for users table
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;

-- Refresh the schema cache by updating table comment
COMMENT ON TABLE public.users IS 'User profiles and authentication data - Updated: ' || NOW()::text;
