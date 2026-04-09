import { useState, useEffect } from 'react';
import { getSavedJobs, unsaveJob, applyToJob, getMyApplications } from '../../api/axios';
import {
  HiOutlineBookmark,
  HiBookmark,
  HiOutlineBriefcase,
  HiOutlineMapPin,
  HiOutlinePaperAirplane,
  HiCheck
} from 'react-icons/hi2';

export default function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [applyingId, setApplyingId] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [savedRes, appRes] = await Promise.all([
          getSavedJobs(),
          getMyApplications().catch(() => ({ data: [] }))
        ]);
        setSavedJobs(savedRes.data || []);
        const appliedSet = new Set();
        (appRes.data || []).forEach(app => {
          if (app.jobId?._id) appliedSet.add(app.jobId._id);
          else if (app.jobId) appliedSet.add(app.jobId);
        });
        setAppliedJobs(appliedSet);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRemove = async (jobId) => {
    setRemovingId(jobId);
    try {
      await unsaveJob(jobId);
      setSavedJobs(prev => prev.filter(s => (s.jobId?._id || s.jobId) !== jobId));
    } catch (err) {
      console.error(err);
    } finally {
      setRemovingId(null);
    }
  };

  const handleApply = async (jobId) => {
    setApplyingId(jobId);
    try {
      await applyToJob(jobId);
      setAppliedJobs(prev => new Set([...prev, jobId]));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplyingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <HiBookmark className="w-7 h-7 text-indigo-500" />
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">Saved Jobs</h1>
        </div>
        <p className="text-secondary mt-1">Jobs you've bookmarked to apply to later.</p>
      </div>

      {savedJobs.length === 0 ? (
        <div className="bg-card rounded-2xl border border-custom p-16 text-center">
          <HiOutlineBookmark className="w-16 h-16 text-secondary mx-auto mb-4 opacity-40" />
          <h3 className="text-lg font-semibold text-primary mb-2">No saved jobs</h3>
          <p className="text-secondary">Bookmark jobs from your matches page to save them here for later.</p>
        </div>
      ) : (
        <div className="grid gap-5">
          <p className="text-sm text-secondary">{savedJobs.length} saved job{savedJobs.length !== 1 ? 's' : ''}</p>
          {savedJobs.map((saved, i) => {
            const job = saved.jobId;
            if (!job) return null;
            const jobId = job._id || job;
            const isApplied = appliedJobs.has(jobId);
            const isApplying = applyingId === jobId;
            const isRemoving = removingId === jobId;

            return (
              <div
                key={saved._id || i}
                className="bg-card rounded-2xl border border-custom p-6 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'both' }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <HiOutlineBriefcase className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-primary">{job.title || 'Untitled Job'}</h3>
                      <div className="flex items-center gap-1.5 text-sm text-secondary mt-0.5">
                        <HiOutlineMapPin className="w-4 h-4" />
                        {job.location || 'Remote'}
                      </div>
                    </div>
                  </div>

                  {/* Remove bookmark */}
                  <button
                    onClick={() => handleRemove(jobId)}
                    disabled={isRemoving}
                    className="p-2 rounded-xl hover:bg-red-500/10 text-indigo-500 hover:text-red-500 transition-all"
                    title="Remove bookmark"
                  >
                    <HiBookmark className="w-5 h-5" />
                  </button>
                </div>

                {job.description && (
                  <p className="text-secondary text-sm leading-relaxed line-clamp-2 mb-4">{job.description}</p>
                )}

                {/* Skills required */}
                {job.mustHaveSkills?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {job.mustHaveSkills.slice(0, 5).map((skill, j) => (
                      <span key={j} className="px-2.5 py-1 bg-indigo-500/10 text-indigo-500 text-xs rounded-lg font-medium">
                        {typeof skill === 'string' ? skill : skill.name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-custom">
                  <span className="text-xs text-secondary">
                    Saved {new Date(saved.savedAt).toLocaleDateString()}
                  </span>

                  {isApplied ? (
                    <button
                      disabled
                      className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-green-600 bg-green-500/10 border border-green-500/20 rounded-xl cursor-not-allowed"
                    >
                      <HiCheck className="w-4 h-4" />
                      Applied ✓
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApply(jobId)}
                      disabled={isApplying}
                      className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50"
                    >
                      {isApplying
                        ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        : <HiOutlinePaperAirplane className="w-4 h-4" />
                      }
                      {isApplying ? 'Applying...' : 'Apply Now'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
