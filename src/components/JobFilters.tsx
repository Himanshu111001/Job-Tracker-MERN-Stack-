import React from 'react';
import { Filter, ArrowUpDown, Plus } from 'lucide-react';
import { useJobStore } from '../store/jobStore';

interface JobFiltersProps {
  onAddJob: () => void;
}

export const JobFilters: React.FC<JobFiltersProps> = ({ onAddJob }) => {
  const { filter, sortBy, setFilter, setSortBy, jobs } = useJobStore();

  const statusCounts = {
    all: jobs.length,
    Applied: jobs.filter((job) => job.status === 'Applied').length,
    Interview: jobs.filter((job) => job.status === 'Interview').length,
    Offer: jobs.filter((job) => job.status === 'Offer').length,
    Rejected: jobs.filter((job) => job.status === 'Rejected').length,
    Accepted: jobs.filter((job) => job.status === 'Accepted').length,
  };

  const filterOptions = [
    { value: 'all', label: 'All Applications', count: statusCounts.all },
    { value: 'Applied', label: 'Applied', count: statusCounts.Applied },
    { value: 'Interview', label: 'Interview', count: statusCounts.Interview },
    { value: 'Offer', label: 'Offer', count: statusCounts.Offer },
    { value: 'Rejected', label: 'Rejected', count: statusCounts.Rejected },
    { value: 'Accepted', label: 'Accepted', count: statusCounts.Accepted },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filter by Status:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filter === option.value
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
                {option.count > 0 && (
                  <span className="ml-2 text-xs opacity-75">({option.count})</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <ArrowUpDown className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Sort by Date:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'asc' | 'desc')}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>

          <button
            onClick={onAddJob}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Application</span>
          </button>
        </div>
      </div>
    </div>
  );
};