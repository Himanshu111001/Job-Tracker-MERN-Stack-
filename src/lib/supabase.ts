import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      job_applications: {
        Row: {
          id: string;
          user_id: string;
          company_name: string;
          job_title: string;
          status: 'Applied' | 'Interview' | 'Offer' | 'Rejected' | 'Accepted';
          applied_date: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          company_name: string;
          job_title: string;
          status: 'Applied' | 'Interview' | 'Offer' | 'Rejected' | 'Accepted';
          applied_date: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          company_name?: string;
          job_title?: string;
          status?: 'Applied' | 'Interview' | 'Offer' | 'Rejected' | 'Accepted';
          applied_date?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          email: string;
          role: 'applicant' | 'admin';
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: 'applicant' | 'admin';
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: 'applicant' | 'admin';
          created_at?: string;
        };
      };
    };
  };
};