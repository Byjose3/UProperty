-- Fix the foreign key relationship between properties and users tables
-- The properties table references auth.users but we need to join with public.users
-- We need to ensure the foreign key name is consistent

-- Only proceed if the properties table exists
DO $
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'properties') THEN
        -- Drop existing foreign key if it exists
        ALTER TABLE public.properties DROP CONSTRAINT IF EXISTS properties_user_id_fkey;
        
        -- Add the foreign key constraint with the correct name
        ALTER TABLE public.properties 
        ADD CONSTRAINT properties_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
        
        RAISE NOTICE 'Updated properties table foreign key constraint';
    ELSE
        RAISE NOTICE 'Properties table does not exist, skipping foreign key update';
    END IF;
END
$;

-- Update the properties table to reference public.users instead of auth.users
-- This ensures consistency with the application's user management
