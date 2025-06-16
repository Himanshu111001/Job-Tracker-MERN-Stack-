/*
  # Create job applications table

  1. New Tables
    - `job_applications`
      - `id` (uuid, primary key, default gen_random_uuid())
      - `user_id` (uuid, references auth.users, not null)
      - `company_name` (text, not null)
      - `job_title` (text, not null)
      - `status` (text, default 'Applied', check constraint)
      - `applied_date` (date, not null)
      - `notes` (text, nullable)
      - `created_at` (timestamptz, default now)
      - `updated_at` (timestamptz, default now)

  2. Security
    - Enable RLS on `job_applications` table
    - Add policy for users to read their own applications
    - Add policy for users to insert their own applications
    - Add policy for users to update their own applications
    - Add policy for users to delete their own applications

  3. Indexes
    - Add index on user_id for better query performance
    - Add index on applied_date for sorting
*/

-- Create job applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  company_name text NOT NULL,
  job_title text NOT NULL,
  status text DEFAULT 'Applied' CHECK (status IN ('Applied', 'Interview', 'Offer', 'Rejected', 'Accepted')),
  applied_date date NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Create policies for job applications
CREATE POLICY "Users can read own applications"
  ON job_applications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications"
  ON job_applications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications"
  ON job_applications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own applications"
  ON job_applications
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS job_applications_user_id_idx ON job_applications(user_id);
CREATE INDEX IF NOT EXISTS job_applications_applied_date_idx ON job_applications(applied_date);
CREATE INDEX IF NOT EXISTS job_applications_status_idx ON job_applications(status);