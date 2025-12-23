-- Add admin role support to Supabase users
-- Run this in your Supabase SQL editor to set up admin role

-- Add role column to users table if it doesn't exist
ALTER TABLE auth.users ADD COLUMN role VARCHAR DEFAULT 'user';

-- Optional: Create a function to make a user admin
CREATE OR REPLACE FUNCTION make_admin(user_email text)
RETURNS void AS $$
BEGIN
  UPDATE auth.users
  SET role = 'admin'
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql;

-- Example: Make a user admin
-- SELECT make_admin('admin@example.com');

-- Query to see all users and their roles
-- SELECT id, email, role FROM auth.users;
