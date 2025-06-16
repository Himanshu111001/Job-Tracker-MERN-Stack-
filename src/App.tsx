import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import { useJobStore } from './store/jobStore';
import { AuthForm } from './components/AuthForm';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { JobFilters } from './components/JobFilters';
import { JobCard } from './components/JobCard';
import { JobForm } from './components/JobForm';
import type { Database } from './lib/supabase';

type JobApplication = Database['public']['Tables']['job_applications']['Row'];

function App() {
  const { user, loading } = useAuth();
  const { jobs, filter, sortBy, fetchJobs, deleteJob } = useJobStore();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null);

  useEffect(() => {
    if (user) {
      fetchJobs(user.id);
    }
  }, [user, fetchJobs, sortBy]);

  const filteredJobs = jobs.filter((job) => {
    if (filter === 'all') return true;
    return job.status === filter;
  });

  const handleEditJob = (job: JobApplication) => {
    setEditingJob(job);
    setShowJobForm(true);
  };

  const handleDeleteJob = (id: string) => {
    if (window.confirm('Are you sure you want to delete this job application?')) {
      deleteJob(id);
    }
  };

  const handleCloseForm = () => {
    setShowJobForm(false);
    setEditingJob(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <AuthForm mode={authMode} onToggleMode={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} />
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-gray-600">
            Track and manage your job applications in one place.
          </p>
        </div>

        <Dashboard />
        
        <JobFilters onAddJob={() => setShowJobForm(true)} />

        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-8v.01M6 8v.01" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'No applications yet' : `No ${filter.toLowerCase()} applications`}
            </h3>
            <p className="text-gray-500 mb-4">
              {filter === 'all' 
                ? 'Start tracking your job applications by adding your first one.'
                : `You don't have any applications with ${filter.toLowerCase()} status.`}
            </p>
            {filter === 'all' && (
              <button
                onClick={() => setShowJobForm(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                Add Your First Application
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onEdit={handleEditJob}
                onDelete={handleDeleteJob}
              />
            ))}
          </div>
        )}
      </main>

      {showJobForm && (
        <JobForm job={editingJob} onClose={handleCloseForm} />
      )}

      <Toaster position="top-right" />
    </div>
  );
}

export default App;