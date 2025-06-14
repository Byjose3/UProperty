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
