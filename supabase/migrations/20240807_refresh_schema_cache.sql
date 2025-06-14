-- Refresh schema cache and fix role column recognition
-- This migration addresses the PGRST204 error by ensuring the schema cache is properly updated

-- First, ensure the users table structure is correct
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
    subscription TEXT DEFAULT 'free',
    role TEXT DEFAULT 'comprador(a)',
    avatar_url TEXT,
    image TEXT,
    credits TEXT,
    type TEXT
);

-- Ensure the role column exists with proper constraints
DO $$ 
BEGIN
    -- Add role column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'users' 
                   AND column_name = 'role') THEN
        ALTER TABLE public.users ADD COLUMN role TEXT DEFAULT 'comprador(a)';
    END IF;
    
    -- Update any NULL role values to default
    UPDATE public.users SET role = 'comprador(a)' WHERE role IS NULL;
    
    -- Drop existing constraint if it exists
    BEGIN
        ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
    EXCEPTION
        WHEN undefined_object THEN
            NULL;
    END;
    
    -- Add role constraint
    ALTER TABLE public.users
    ADD CONSTRAINT users_role_check
    CHECK (role IN ('administrador', 'comprador(a)', 'proprietario(a)', 'Administrator', 'owner', 'Buyer', 'Builder', 'Investor'));
END $$;

-- Add helpful comments to columns
COMMENT ON COLUMN public.users.role IS 'User role: administrador, comprador(a), proprietario(a) (legacy: Administrator, owner, Buyer, Builder, Investor)';
COMMENT ON TABLE public.users IS 'User profiles and authentication data - Schema refreshed: ' || NOW()::text;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);
CREATE INDEX IF NOT EXISTS idx_users_user_id ON public.users(user_id);

-- Enable realtime for users table
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;

-- Force schema cache refresh by updating table statistics
ANALYZE public.users;

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
