-- Enhanced properties table with all necessary fields
CREATE TABLE IF NOT EXISTS properties (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title text NOT NULL,
    description text,
    price numeric NOT NULL,
    property_type text NOT NULL CHECK (property_type IN ('apartment', 'house', 'villa', 'land', 'commercial')),
    bedrooms integer,
    bathrooms integer,
    area numeric NOT NULL,
    address text NOT NULL,
    city text NOT NULL,
    state text,
    zip_code text,
    features text[] DEFAULT '{}',
    images text[] DEFAULT '{}',
    status text DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'inactive', 'sold')),
    views integer DEFAULT 0,
    inquiries integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable realtime for properties table
ALTER PUBLICATION supabase_realtime ADD TABLE properties;

-- Function to increment property views
CREATE OR REPLACE FUNCTION increment_property_views(property_id uuid)
RETURNS void AS $$
BEGIN
    UPDATE properties 
    SET views = views + 1, updated_at = timezone('utc'::text, now())
    WHERE id = property_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment property inquiries
CREATE OR REPLACE FUNCTION increment_property_inquiries(property_id uuid)
RETURNS void AS $$
BEGIN
    UPDATE properties 
    SET inquiries = inquiries + 1, updated_at = timezone('utc'::text, now())
    WHERE id = property_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get property statistics for a user
CREATE OR REPLACE FUNCTION get_user_property_stats(user_id uuid)
RETURNS TABLE(
    total_properties bigint,
    active_properties bigint,
    draft_properties bigint,
    total_views bigint,
    total_inquiries bigint
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_properties,
        COUNT(*) FILTER (WHERE status = 'active') as active_properties,
        COUNT(*) FILTER (WHERE status = 'draft') as draft_properties,
        COALESCE(SUM(views), 0) as total_views,
        COALESCE(SUM(inquiries), 0) as total_inquiries
    FROM properties 
    WHERE properties.user_id = get_user_property_stats.user_id;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_properties_user_id ON properties(user_id);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_property_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at);
