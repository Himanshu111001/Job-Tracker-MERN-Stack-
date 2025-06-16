import React from 'react';
import { useForm } from 'react-hook-form';
import { X, Building, Briefcase, Calendar, FileText } from 'lucide-react';
import { useJobStore } from '../store/jobStore';
import { useAuth } from '../hooks/useAuth';
import type { Database } from '../lib/supabase';

type JobApplication = Database['public']['Tables']['job_applications']['Row'];

interface JobFormProps {
  job?: JobApplication;
  onClose: () => void;
}

interface JobFormData {
  company_name: string;
  job_title: string;
  status: 'Applied' | 'Interview' | 'Offer' | 'Rejected' | 'Accepted';
  applied_date: string;
  notes: string;
}

export const JobForm: React.FC<JobFormProps> = ({ job, onClose }) => {
  const { user } = useAuth();
  const { addJob, updateJob } = useJobStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JobFormData>({
    defaultValues: job
      ? {
          company_name: job.company_name,
          job_title: job.job_title,
          status: job.status,
          applied_date: job.applied_date.split('T')[0],
          notes: job.notes || '',
        }
      : {
          status: 'Applied',
          applied_date: new Date().toISOString().split('T')[0],
        },
  });

  const onSubmit = async (data: JobFormData) => {
    if (!user) return;

    if (job) {
      await updateJob(job.id, data);
    } else {
      await addJob({
        ...data,
        user_id: user.id,
      });
    }
    onClose();
  };

  const statusOptions = [
    { value: 'Applied', color: 'text-blue-600 bg-blue-50' },
    { value: 'Interview', color: 'text-yellow-600 bg-yellow-50' },
    { value: 'Offer', color: 'text-green-600 bg-green-50' },
    { value: 'Rejected', color: 'text-red-600 bg-red-50' },
    { value: 'Accepted', color: 'text-purple-600 bg-purple-50' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {job ? 'Edit Application' : 'Add New Application'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                {...register('company_name', { required: 'Company name is required' })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="e.g., Google, Microsoft, Apple"
              />
            </div>
            {errors.company_name && (
              <p className="mt-1 text-sm text-red-600">{errors.company_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                {...register('job_title', { required: 'Job title is required' })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="e.g., Frontend Developer, Product Manager"
              />
            </div>
            {errors.job_title && (
              <p className="mt-1 text-sm text-red-600">{errors.job_title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Application Status
            </label>
            <select
              {...register('status', { required: 'Status is required' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.value}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Applied Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="date"
                {...register('applied_date', { required: 'Applied date is required' })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            {errors.applied_date && (
              <p className="mt-1 text-sm text-red-600">{errors.applied_date.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <textarea
                {...register('notes')}
                rows={4}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Add any additional notes about this application..."
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : job ? 'Update Application' : 'Add Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};