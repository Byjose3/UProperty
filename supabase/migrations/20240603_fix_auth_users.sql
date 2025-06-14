-- Create a function to ensure users exist in both auth.users and public.users tables
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, user_id, email, token_identifier, created_at, role)
  VALUES (
    NEW.id,
    NEW.id,
    NEW.email,
    NEW.id,
    NEW.created_at,
    COALESCE(NEW.raw_user_meta_data->>'role', 'comprador(a)')
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    email = NEW.email,
    role = COALESCE(NEW.raw_user_meta_data->>'role', public.users.role);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically sync auth users to public users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Sync existing auth users to public users
INSERT INTO public.users (id, user_id, email, token_identifier, created_at, role)
SELECT 
  id,
  id,
  email,
  id,
  created_at,
  COALESCE(raw_user_meta_data->>'role', 'comprador(a)')
FROM auth.users
ON CONFLICT (id) DO UPDATE
SET 
  email = EXCLUDED.email,
  role = COALESCE(EXCLUDED.role, public.users.role);
