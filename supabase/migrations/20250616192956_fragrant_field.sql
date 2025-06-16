/*
  # Create job applications table

  1. New Tables
    - `job_applications`
      - `id` (uuid, primary key, auto-generated)
      - `user_id` (uuid, foreign key to auth.users)
      - `company_name` (text, required)
      - `job_title` (text, required)
      - `status` (text, default 'Applied', constrained values)
      - `applied_date` (date, required)
      - `notes` (text, optional)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `job_applications` table
    - Add policies for authenticated users to manage their own applications

  3. Indexes
    - Add indexes for performance on user_id, status, and applied_date columns
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
CREATE INDEX IF NOT EXISTS job_applications_user_id_idx ON job_applications (user_id);
CREATE INDEX IF NOT EXISTS job_applications_status_idx ON job_applications (status);
CREATE INDEX IF NOT EXISTS job_applications_applied_date_idx ON job_applications (applied_date);