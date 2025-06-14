-- Fix the properties table and its relationship with users
-- This migration ensures the properties table exists and has proper foreign key relationships

-- Create properties table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(12,2) NOT NULL,
    property_type TEXT NOT NULL,
    bedrooms INTEGER,
    bathrooms INTEGER,
    area DECIMAL(10,2) NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT,
    zip_code TEXT,
    features TEXT[] DEFAULT '{}',
    images TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'active',
    views INTEGER DEFAULT 0,
    inquiries INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drop existing foreign key if it exists and recreate it properly
ALTER TABLE public.properties DROP CONSTRAINT IF EXISTS properties_user_id_fkey;
ALTER TABLE public.properties 
ADD CONSTRAINT properties_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_properties_user_id ON public.properties(user_id);
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_city ON public.properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_property_type ON public.properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_price ON public.properties(price);

-- Enable realtime for properties table
ALTER PUBLICATION supabase_realtime ADD TABLE public.properties;

-- Add functions for incrementing views and inquiries if they don't exist
CREATE OR REPLACE FUNCTION increment_property_views(property_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.properties 
    SET views = views + 1, updated_at = NOW()
    WHERE id = property_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_property_inquiries(property_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.properties 
    SET inquiries = inquiries + 1, updated_at = NOW()
    WHERE id = property_id;
END;
$$ LANGUAGE plpgsql;

-- Add comment to help with schema cache
COMMENT ON TABLE public.properties IS 'Property listings - Updated: ' || NOW()::text;
