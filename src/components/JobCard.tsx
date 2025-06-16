import React from 'react';
import { format } from 'date-fns';
import { Building, Calendar, Edit3, Trash2, FileText } from 'lucide-react';
import type { Database } from '../lib/supabase';

type JobApplication = Database['public']['Tables']['job_applications']['Row'];

interface JobCardProps {
  job: JobApplication;
  onEdit: (job: JobApplication) => void;
  onDelete: (id: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onEdit, onDelete }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Applied':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Interview':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Offer':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Accepted':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
              {job.job_title}
            </h3>
            <div className="flex items-center text-gray-600 mb-3">
              <Building className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">{job.company_name}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => onEdit(job)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
              title="Edit application"
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(job.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              title="Delete application"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
              job.status
            )}`}
          >
            {job.status}
          </span>
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{format(new Date(job.applied_date), 'MMM dd, yyyy')}</span>
          </div>
        </div>

        {job.notes && (
          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-start space-x-2">
              <FileText className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600 line-clamp-3">{job.notes}</p>
            </div>
          </div>
        )}
      </div>

      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Added {format(new Date(job.created_at), 'MMM dd')}</span>
          {job.updated_at !== job.created_at && (
            <span>Updated {format(new Date(job.updated_at), 'MMM dd')}</span>
          )}
        </div>
      </div>
    </div>
  );
};