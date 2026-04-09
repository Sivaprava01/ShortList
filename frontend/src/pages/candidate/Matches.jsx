import { useState, useEffect } from 'react';
import { getCandidateMatches, applyToJob, getMyApplications, saveJob, unsaveJob, getSavedJobs } from '../../api/axios';
import {
  HiOutlineBriefcase,
  HiOutlineMapPin,
  HiOutlineWrenchScrewdriver,
  HiOutlineAcademicCap,
  HiOutlineRocketLaunch,
  HiOutlinePaperAirplane,
  HiCheck,
  HiOutlineBookmark,
  HiBookmark
} from 'react-icons/hi2';

function ScoreBar({ label, score, icon: Icon, color }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5 text-xs text-secondary">
          <Icon className={`w-3.5 h-3.5 ${color}`} />
          {label}
        </div>
        <span className="text-xs font-semibold text-primary">{score || 0}</span>
      </div>
      <div className="w-full bg-primary rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full transition-all duration-700 ${color.replace('text-', 'bg-')}`}
          style={{ width: `${Math.min(score || 0, 100)}%` }}
        />
      </div>
    </div>
  );
}

export default function MatchedJobs() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [applyingJobId, setApplyingJobId] = useState(null);
  const [savingJobId, setSavingJobId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [matchRes, appRes, savedRes] = await Promise.all([
          getCandidateMatches(),
          getMyApplications().catch(() => ({ data: [] })),
          getSavedJobs().catch(() => ({ data: [] }))
        ]);
        setMatches(matchRes.data || []);

        const appliedSet = new Set();
        (appRes.data || []).forEach(app => {
          if (app.jobId?._id) appliedSet.add(app.jobId._id);
          else if (app.jobId) appliedSet.add(app.jobId);
        });
        setAppliedJobs(appliedSet);

        const savedSet = new Set();
        (savedRes.data || []).forEach(s => {
          if (s.jobId?._id) savedSet.add(s.jobId._id);
          else if (s.jobId) savedSet.add(s.jobId);
        });
        setSavedJobIds(savedSet);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleApply = async (jobId) => {
    setApplyingJobId(jobId);
    try {
      await applyToJob(jobId);
      setAppliedJobs(prev => new Set([...prev, jobId]));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplyingJobId(null);
    }
  };

  const handleToggleSave = async (jobId) => {
    setSavingJobId(jobId);
    try {
      if (savedJobIds.has(jobId)) {
        await unsaveJob(jobId);
        setSavedJobIds(prev => { const s = new Set(prev); s.delete(jobId); return s; });
      } else {
        await saveJob(jobId);
        setSavedJobIds(prev => new Set([...prev, jobId]));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingJobId(null);
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
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">My Job Matches</h1>
        <p className="text-secondary mt-1">Jobs where you've been selected as a top candidate based on your profile.</p>
      </div>

      {matches.length === 0 ? (
        <div className="bg-card rounded-2xl border border-custom p-16 text-center">
          <HiOutlineBriefcase className="w-16 h-16 text-secondary mx-auto mb-4 opacity-40" />
          <h3 className="text-lg font-semibold text-primary mb-2">No matches yet</h3>
          <p className="text-secondary">Complete your profile and wait for recruiters to run matching on their jobs.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-secondary mb-4">
            Found {matches.length} job{matches.length !== 1 ? 's' : ''} where you're a top candidate
          </div>

          <div className="grid gap-6">
            {matches.map((match, i) => {
              const isApplied = appliedJobs.has(match.jobId);
              const isApplying = applyingJobId === match.jobId;
              const isSaved = savedJobIds.has(match.jobId);
              const isSaving = savingJobId === match.jobId;

              return (
                <div
                  key={match.jobId || i}
                  className="bg-card rounded-2xl border border-custom p-6 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'both' }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <HiOutlineBriefcase className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-primary">{match.jobTitle}</h3>
                        <div className="flex items-center gap-2 text-sm text-secondary mt-1">
                          <HiOutlineMapPin className="w-4 h-4" />
                          {match.location || 'Remote'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Bookmark */}
                      <button
                        onClick={() => handleToggleSave(match.jobId)}
                        disabled={isSaving}
                        className="p-2 rounded-xl border border-custom hover:bg-hover transition-all"
                        title={isSaved ? 'Remove bookmark' : 'Save job'}
                      >
                        {isSaved
                          ? <HiBookmark className="w-5 h-5 text-indigo-500" />
                          : <HiOutlineBookmark className="w-5 h-5 text-secondary" />
                        }
                      </button>

                      {/* Match Score */}
                      <div className="text-center px-4 py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
                        <div className="text-lg font-bold">{match.matchScore}</div>
                        <div className="text-xs">Match Score</div>
                      </div>
                    </div>
                  </div>

                  <p className="text-secondary leading-relaxed mb-4 line-clamp-2 text-sm">{match.jobDescription}</p>

                  {/* Score Visualization — Progress Bars */}
                  {match.scoreBreakdown && (
                    <div className="space-y-2.5 py-4 border-y border-custom mb-4">
                      <p className="text-xs font-semibold text-secondary uppercase tracking-wide mb-3">Score Breakdown</p>
                      <ScoreBar label="Skills" score={match.scoreBreakdown.skillScore} icon={HiOutlineWrenchScrewdriver} color="text-indigo-500" />
                      <ScoreBar label="Experience" score={match.scoreBreakdown.experienceScore} icon={HiOutlineAcademicCap} color="text-amber-500" />
                      <ScoreBar label="Projects" score={match.scoreBreakdown.projectScore} icon={HiOutlineRocketLaunch} color="text-purple-500" />
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isApplied ? 'bg-green-500/10 text-green-600 dark:text-green-400' :
                        match.status === 'notified' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                        match.status === 'viewed' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                        'bg-primary text-secondary'
                      }`}>
                        {isApplied ? 'Applied' :
                          match.status === 'notified' ? 'New Match' :
                          match.status === 'viewed' ? 'Viewed by Recruiter' :
                          match.status}
                      </div>
                      <span className="text-xs text-secondary">
                        {new Date(match.createdAt).toLocaleDateString()}
                      </span>
                    </div>

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
                        onClick={() => handleApply(match.jobId)}
                        disabled={isApplying}
                        className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50"
                      >
                        {isApplying
                          ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          : <HiOutlinePaperAirplane className="w-4 h-4" />
                        }
                        {isApplying ? 'Applying...' : 'Apply'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
