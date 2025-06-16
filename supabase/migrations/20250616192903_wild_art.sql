/*
  # Create user profiles table

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, not null)
      - `role` (text, default 'applicant', check constraint)
      - `created_at` (timestamptz, default now)

  2. Security
    - Enable RLS on `user_profiles` table
    - Add policy for users to read their own profile
    - Add policy for users to update their own profile

  3. Functions & Triggers
    - Create function to automatically create user profile on registration
    - Create trigger to execute function when new user is created
*/

-- Create user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid REFERENCES auth.users(id) PRIMARY KEY,
  email text NOT NULL,
  role text DEFAULT 'applicant' CHECK (role IN ('applicant', 'admin')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();