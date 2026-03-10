import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineBriefcase, HiOutlineChartBar, HiOutlinePlusCircle } from 'react-icons/hi2';
import { getMyJobs } from '../../api/axios';
import Card from '../../components/Card';

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await getMyJobs();
        setJobs(res.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const openJobs = jobs.filter((job) => job.status === 'open').length;
  const closedJobs = jobs.filter((job) => job.status === 'closed').length;

  const stats = [
    { label: 'Total Jobs', value: jobs.length, icon: HiOutlineBriefcase, color: 'from-indigo-500 to-indigo-600' },
    { label: 'Open Jobs', value: openJobs, icon: HiOutlineChartBar, color: 'from-emerald-500 to-emerald-600' },
    { label: 'Closed Jobs', value: closedJobs, icon: HiOutlineBriefcase, color: 'from-rose-500 to-pink-600' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">Recruiter Dashboard</h2>
          <p className="text-[var(--text-secondary)] mt-1">Track job posts and run matching from one place.</p>
        </div>
        <Link to="/recruiter/create-job" className="inline-flex items-center gap-2 px-6 py-2.5 bg-[var(--accent)] text-white rounded-xl font-medium hover:opacity-90 transition-all shadow-lg shadow-[var(--accent)]/25 text-sm">
          <HiOutlinePlusCircle className="w-5 h-5" />
          Create Job
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card
            key={stat.label}
            className="p-5 hover:shadow-lg transition-all duration-300 animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
          >
            <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-[var(--text-primary)]">{stat.value}</div>
            <div className="text-sm text-[var(--text-secondary)] mt-1">{stat.label}</div>
          </Card>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Recent Jobs</h3>
          {jobs.length > 0 && (
            <Link to="/recruiter/jobs" className="text-sm text-[var(--accent)] font-medium hover:underline">
              View all
            </Link>
          )}
        </div>
        {jobs.length === 0 ? (
          <Card className="p-12 text-center">
            <HiOutlineBriefcase className="w-12 h-12 text-[var(--text-secondary)] mx-auto mb-4 opacity-50" />
            <p className="text-[var(--text-secondary)]">No jobs posted yet. Create your first listing.</p>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {jobs.slice(0, 4).map((job) => (
              <Card key={job._id} className="p-5 hover:shadow-lg hover:border-[var(--accent)]/30 transition-all duration-300">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-[var(--text-primary)]">{job.title}</h4>
                  <span className={`px-2.5 py-0.5 rounded-lg text-xs font-medium ${job.status === 'open' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-gray-500/10 text-gray-600 dark:text-gray-400'}`}>
                    {job.status}
                  </span>
                </div>
                <p className="text-sm text-[var(--text-secondary)] mb-3 line-clamp-2">{job.description}</p>
                <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
                  <span>{job.location || 'Remote'}</span>
                  <span>•</span>
                  <span>{job.mustHaveSkills?.length || 0} required skills</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
