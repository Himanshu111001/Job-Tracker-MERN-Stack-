import React from 'react';
import { TrendingUp, Briefcase, Clock, CheckCircle } from 'lucide-react';
import { useJobStore } from '../store/jobStore';

export const Dashboard: React.FC = () => {
  const { jobs } = useJobStore();

  const stats = {
    total: jobs.length,
    applied: jobs.filter((job) => job.status === 'Applied').length,
    interviews: jobs.filter((job) => job.status === 'Interview').length,
    offers: jobs.filter((job) => job.status === 'Offer').length,
    accepted: jobs.filter((job) => job.status === 'Accepted').length,
  };

  const successRate = stats.total > 0 ? ((stats.offers + stats.accepted) / stats.total * 100).toFixed(1) : '0';

  const statCards = [
    {
      title: 'Total Applications',
      value: stats.total,
      icon: Briefcase,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Pending Applications',
      value: stats.applied,
      icon: Clock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Interviews Scheduled',
      value: stats.interviews,
      icon: TrendingUp,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Success Rate',
      value: `${successRate}%`,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className={`${stat.bgColor} rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`${stat.color} p-3 rounded-lg`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};