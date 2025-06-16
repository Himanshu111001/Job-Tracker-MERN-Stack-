import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';
import toast from 'react-hot-toast';

type JobApplication = Database['public']['Tables']['job_applications']['Row'];
type JobApplicationInsert = Database['public']['Tables']['job_applications']['Insert'];
type JobApplicationUpdate = Database['public']['Tables']['job_applications']['Update'];

interface JobState {
  jobs: JobApplication[];
  loading: boolean;
  filter: string;
  sortBy: 'asc' | 'desc';
  setJobs: (jobs: JobApplication[]) => void;
  addJob: (job: JobApplicationInsert) => Promise<void>;
  updateJob: (id: string, updates: JobApplicationUpdate) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  fetchJobs: (userId: string) => Promise<void>;
  setFilter: (filter: string) => void;
  setSortBy: (sort: 'asc' | 'desc') => void;
}

export const useJobStore = create<JobState>((set, get) => ({
  jobs: [],
  loading: false,
  filter: 'all',
  sortBy: 'desc',
  setJobs: (jobs) => set({ jobs }),
  setFilter: (filter) => set({ filter }),
  setSortBy: (sortBy) => set({ sortBy }),

  fetchJobs: async (userId: string) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('user_id', userId)
        .order('applied_date', { ascending: get().sortBy === 'asc' });

      if (error) throw error;
      set({ jobs: data || [] });
    } catch (error: any) {
      toast.error('Failed to fetch jobs');
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  addJob: async (jobData) => {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .insert(jobData)
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        jobs: [data, ...state.jobs],
      }));

      toast.success('Job application added successfully!');
    } catch (error: any) {
      toast.error('Failed to add job application');
      console.error(error);
    }
  },

  updateJob: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        jobs: state.jobs.map((job) => (job.id === id ? data : job)),
      }));

      toast.success('Job application updated successfully!');
    } catch (error: any) {
      toast.error('Failed to update job application');
      console.error(error);
    }
  },

  deleteJob: async (id) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        jobs: state.jobs.filter((job) => job.id !== id),
      }));

      toast.success('Job application deleted successfully!');
    } catch (error: any) {
      toast.error('Failed to delete job application');
      console.error(error);
    }
  },
}));