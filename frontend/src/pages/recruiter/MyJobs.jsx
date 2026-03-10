import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyJobs, runMatching } from '../../api/axios';
import { HiOutlinePlay, HiOutlineEye, HiOutlineMapPin, HiOutlineUserGroup } from 'react-icons/hi2';

export default function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [runningJobId, setRunningJobId] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await getMyJobs();
        setJobs(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleRunMatching = async (jobId) => {
    setRunningJobId(jobId);
    try {
      const response = await runMatching(jobId);
      const message = response.data.message || 'Matching complete!';
      alert(`${message} View results in the Matches tab.`);
    } catch (err) {
      console.error(err);
      alert('Failed to run matching: ' + (err.response?.data?.message || err.message));
    } finally {
      setRunningJobId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">My Jobs</h1>
          <p className="text-[var(--text-secondary)] mt-1">Manage your job postings and run candidate matching.</p>
        </div>
        <Link to="/recruiter/create-job" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--accent)] text-white rounded-xl font-medium hover:opacity-90 transition-all shadow-lg shadow-[var(--accent)]/25 text-sm">
          + New Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] p-16 text-center">
          <p className="text-[var(--text-secondary)]">No jobs posted yet.</p>
        </div>
      ) : (
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">Job Title</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">Location</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">Status</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--hover)] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-[var(--text-primary)]">{job.title}</div>
                      <div className="text-xs text-[var(--text-secondary)] mt-0.5">{job.mustHaveSkills?.join(', ')}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{job.location || 'Remote'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${job.status === 'open' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-gray-500/10 text-gray-600 dark:text-gray-400'}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleRunMatching(job._id)}
                          disabled={runningJobId === job._id}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[var(--accent)] bg-[var(--accent)]/10 rounded-lg hover:bg-[var(--accent)]/20 transition-colors disabled:opacity-50"
                        >
                          {runningJobId === job._id ? (
                            <div className="w-3.5 h-3.5 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <HiOutlinePlay className="w-3.5 h-3.5" />
                          )}
                          Run
                        </button>
                        <Link
                          to={`/recruiter/matches/${job._id}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 rounded-lg hover:bg-emerald-500/20 transition-colors"
                        >
                          <HiOutlineEye className="w-3.5 h-3.5" />
                          Matches
                        </Link>
                        <Link
                          to={`/recruiter/jobs/${job._id}/applicants`}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-purple-600 dark:text-purple-400 bg-purple-500/10 rounded-lg hover:bg-purple-500/20 transition-colors"
                        >
                          <HiOutlineUserGroup className="w-3.5 h-3.5" />
                          Applicants
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-[var(--border)]">
            {jobs.map((job) => (
              <div key={job._id} className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-[var(--text-primary)]">{job.title}</h3>
                    <div className="flex items-center gap-1 text-sm text-[var(--text-secondary)] mt-1">
                      <HiOutlineMapPin className="w-3.5 h-3.5" /> {job.location || 'Remote'}
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-lg text-xs font-medium ${job.status === 'open' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-gray-500/10 text-gray-500'}`}>
                    {job.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRunMatching(job._id)}
                    disabled={runningJobId === job._id}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-[var(--accent)] bg-[var(--accent)]/10 rounded-lg disabled:opacity-50"
                  >
                    <HiOutlinePlay className="w-3.5 h-3.5" /> Run Matching
                  </button>
                  <Link
                    to={`/recruiter/matches/${job._id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 rounded-lg"
                  >
                    <HiOutlineEye className="w-3.5 h-3.5" />
                    View Matches
                  </Link>
                  <Link
                    to={`/recruiter/jobs/${job._id}/applicants`}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 bg-purple-500/10 rounded-lg"
                  >
                    <HiOutlineUserGroup className="w-3.5 h-3.5" />
                    Applicants
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
