import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineBriefcase, HiOutlineChartBar, HiOutlinePlusCircle, HiOutlineUsers, HiOutlineSparkles } from 'react-icons/hi2';
import { getMyJobs, getRecruiterInsights } from '../../api/axios';
import Card from '../../components/Card';

function SkillBar({ name, count, max }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-primary font-medium">{name}</span>
        <span className="text-xs text-secondary">{count}</span>
      </div>
      <div className="w-full bg-primary rounded-full h-1.5">
        <div
          className="h-1.5 rounded-full bg-indigo-500 transition-all duration-700"
          style={{ width: `${max ? (count / max) * 100 : 0}%` }}
        />
      </div>
    </div>
  );
}

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobRes, insightsRes] = await Promise.all([
          getMyJobs(),
          getRecruiterInsights().catch(() => ({ data: null }))
        ]);
        setJobs(jobRes.data || []);
        setInsights(insightsRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
    { label: 'Total Applicants', value: insights?.totalApplicants ?? '—', icon: HiOutlineUsers, color: 'from-amber-500 to-orange-500' },
  ];

  const maxSkillCount = insights?.topSkills?.[0]?.count || 1;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">Recruiter Dashboard</h2>
          <p className="text-[var(--text-secondary)] mt-1">Track job posts and run matching from one place.</p>
        </div>
        <Link to="/recruiter/create-job" className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all">
          <HiOutlinePlusCircle className="w-5 h-5" />
          Create Job
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Insights Row */}
      {insights && (
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Avg match score */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <HiOutlineSparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text-primary)]">Avg Match Score</h3>
                <p className="text-xs text-[var(--text-secondary)]">Across all matched candidates</p>
              </div>
            </div>
            <div className="text-4xl font-bold text-indigo-500 mb-2">
              {insights.avgMatchScore || 0}
              <span className="text-lg text-[var(--text-secondary)] ml-1">/ 100</span>
            </div>
            <div className="w-full bg-primary rounded-full h-2">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700"
                style={{ width: `${insights.avgMatchScore || 0}%` }}
              />
            </div>
          </Card>

          {/* Top Skills */}
          <Card className="p-6">
            <h3 className="font-semibold text-[var(--text-primary)] mb-4">Top Skills in Candidate Pool</h3>
            {insights.topSkills?.length > 0 ? (
              <div className="space-y-2.5">
                {insights.topSkills.slice(0, 6).map(skill => (
                  <SkillBar key={skill.name} name={skill.name} count={skill.count} max={maxSkillCount} />
                ))}
              </div>
            ) : (
              <p className="text-[var(--text-secondary)] text-sm">Run matching on your jobs to see skill distribution.</p>
            )}
          </Card>
        </div>
      )}

      {/* Recent Jobs */}
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
