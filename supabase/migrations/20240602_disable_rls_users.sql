-- Disable RLS on users table to allow inserts from server-side code
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Create policy for public access to users table
DROP POLICY IF EXISTS "Public users access" ON public.users;
CREATE POLICY "Public users access"
ON public.users FOR ALL
USING (true);
