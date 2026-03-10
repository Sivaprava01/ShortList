import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getApplicationsForJob, getJobById, updateApplicationStatus } from '../../api/axios';
import {
  HiOutlineUser,
  HiOutlineXMark,
  HiOutlineLink,
  HiOutlineAcademicCap,
  HiOutlineWrenchScrewdriver,
  HiOutlineRocketLaunch,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineChartBar
} from 'react-icons/hi2';

function CandidateModal({ candidate, onClose }) {
  if (!candidate) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">{candidate.fullName || 'Candidate Profile'}</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[var(--hover)]">
            <HiOutlineXMark className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>
        </div>
        <div className="p-6 space-y-5">
          {candidate.headline && <p className="text-[var(--accent)] font-medium">{candidate.headline}</p>}
          {candidate.bio && <p className="text-sm text-[var(--text-secondary)]">{candidate.bio}</p>}

          {candidate.skills?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <HiOutlineWrenchScrewdriver className="w-4 h-4 text-[var(--accent)]" />
                <h3 className="font-semibold text-[var(--text-primary)]">Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((s, i) => (
                  <span key={i} className="px-3 py-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)]">
                    {s.name} <span className="text-[var(--text-secondary)]">· {s.level}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {candidate.projects?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <HiOutlineRocketLaunch className="w-4 h-4 text-purple-500" />
                <h3 className="font-semibold text-[var(--text-primary)]">Projects</h3>
              </div>
              <div className="space-y-3">
                {candidate.projects.map((p, i) => (
                  <div key={i} className="p-3 bg-[var(--bg-primary)] rounded-xl border border-[var(--border)]">
                    <h4 className="font-medium text-[var(--text-primary)]">{p.title}</h4>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">{p.description}</p>
                    {p.techStack?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {p.techStack.map((t, j) => (
                          <span key={j} className="px-2 py-0.5 bg-[var(--accent)]/10 text-[var(--accent)] text-xs rounded-md">{t}</span>
                        ))}
                      </div>
                    )}
                    {p.link && (
                      <a href={p.link} target="_blank" rel="noreferrer" className="text-sm text-[var(--accent)] hover:underline mt-2 flex items-center gap-1">
                        <HiOutlineLink className="w-3 h-3" /> {p.link}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {candidate.experience?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <HiOutlineAcademicCap className="w-4 h-4 text-amber-500" />
                <h3 className="font-semibold text-[var(--text-primary)]">Experience</h3>
              </div>
              <div className="space-y-2">
                {candidate.experience.map((exp, i) => (
                  <div key={i} className="p-3 bg-[var(--bg-primary)] rounded-xl border border-[var(--border)]">
                    <h4 className="font-medium text-[var(--text-primary)]">{exp.role} at {exp.company}</h4>
                    <p className="text-xs text-[var(--text-secondary)]">{exp.years} years</p>
                    {exp.description && <p className="text-sm text-[var(--text-secondary)] mt-1">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {candidate.experienceYears > 0 && !candidate.experience?.length && (
            <div>
              <h3 className="font-semibold text-[var(--text-primary)] mb-1">Experience</h3>
              <p className="text-sm text-[var(--text-secondary)]">{candidate.experienceYears} years</p>
            </div>
          )}

          {candidate.education?.length > 0 && (
            <div>
              <h3 className="font-semibold text-[var(--text-primary)] mb-2">Education</h3>
              <div className="space-y-2">
                {candidate.education.map((edu, i) => (
                  <div key={i} className="text-sm">
                    <p className="text-[var(--text-primary)]">{edu.degree} — {edu.institution}</p>
                    <p className="text-xs text-[var(--text-secondary)]">Year: {edu.year} {edu.GPA ? `| GPA: ${edu.GPA}` : ''}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(candidate.portfolioLinks?.filter(l => l).length > 0 || candidate.codingLinks?.filter(l => l).length > 0) && (
            <div>
              <h3 className="font-semibold text-[var(--text-primary)] mb-2">Links</h3>
              <div className="space-y-1">
                {candidate.portfolioLinks?.filter(l => l).map((l, i) => (
                  <a key={i} href={l} target="_blank" rel="noreferrer" className="block text-sm text-[var(--accent)] hover:underline">{l}</a>
                ))}
                {candidate.codingLinks?.filter(l => l).map((l, i) => (
                  <a key={i} href={l} target="_blank" rel="noreferrer" className="block text-sm text-[var(--accent)] hover:underline">{l}</a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const statusConfig = {
  applied: { label: 'Applied', bg: 'bg-blue-50 text-blue-700 border-blue-200', darkBg: 'dark:bg-blue-500/10 dark:text-blue-400' },
  shortlisted: { label: 'Shortlisted', bg: 'bg-green-50 text-green-700 border-green-200', darkBg: 'dark:bg-green-500/10 dark:text-green-400' },
  rejected: { label: 'Rejected', bg: 'bg-red-50 text-red-700 border-red-200', darkBg: 'dark:bg-red-500/10 dark:text-red-400' }
};

export default function Applicants() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appRes, jobRes] = await Promise.all([
          getApplicationsForJob(jobId),
          getJobById(jobId)
        ]);
        setApplications(appRes.data || []);
        setJob(jobRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [jobId]);

  const handleStatusUpdate = async (applicationId, newStatus) => {
    setUpdatingId(applicationId);
    try {
      const res = await updateApplicationStatus(applicationId, newStatus);
      setApplications(prev =>
        prev.map(app =>
          app._id === applicationId ? { ...app, status: res.data.status } : app
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
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
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">Applicants</h1>
          {job && <p className="text-[var(--text-secondary)] mt-1">Candidates who applied to <span className="font-medium text-[var(--text-primary)]">{job.title}</span></p>}
        </div>
        <Link
          to="/recruiter/jobs"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--text-secondary)] bg-[var(--bg-card)] border border-[var(--border)] rounded-xl hover:bg-[var(--hover)] transition-all"
        >
          ← Back to Jobs
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] p-16 text-center">
          <HiOutlineUser className="w-16 h-16 text-[var(--text-secondary)] mx-auto mb-4 opacity-40" />
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No applicants yet</h3>
          <p className="text-[var(--text-secondary)]">Candidates haven't applied to this job yet. Make sure matching has been run.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-[var(--text-secondary)]">
            {applications.length} applicant{applications.length !== 1 ? 's' : ''}
          </div>

          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">#</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">Candidate</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">Match Score</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">Skills</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">Experience</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">Status</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app, i) => {
                    const candidate = app.candidateId;
                    const config = statusConfig[app.status] || statusConfig.applied;
                    const isUpdating = updatingId === app._id;

                    return (
                      <tr key={app._id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--hover)] transition-colors">
                        <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{i + 1}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-[var(--accent)] to-purple-600 rounded-lg flex items-center justify-center">
                              <span className="text-white text-sm font-bold">{candidate?.fullName?.charAt(0) || '?'}</span>
                            </div>
                            <div>
                              <div className="font-medium text-[var(--text-primary)]">{candidate?.fullName || 'Unknown'}</div>
                              <div className="text-xs text-[var(--text-secondary)]">{candidate?.headline || ''}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <HiOutlineChartBar className="w-4 h-4 text-[var(--accent)]" />
                            <span className="px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] text-sm font-bold rounded-lg">{app.matchScore}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {candidate?.skills?.slice(0, 3).map((s, j) => (
                              <span key={j} className="px-2 py-0.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded text-xs text-[var(--text-primary)]">{s.name}</span>
                            ))}
                            {candidate?.skills?.length > 3 && (
                              <span className="px-2 py-0.5 text-xs text-[var(--text-secondary)]">+{candidate.skills.length - 3}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                          {candidate?.experienceYears || 0} yrs
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${config.bg}`}>
                            {config.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedCandidate(candidate)}
                              className="text-xs font-medium text-[var(--accent)] hover:underline"
                            >
                              Profile
                            </button>

                            {app.status === 'applied' && (
                              <>
                                <button
                                  onClick={() => handleStatusUpdate(app._id, 'shortlisted')}
                                  disabled={isUpdating}
                                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-600 bg-green-500/10 rounded-lg hover:bg-green-500/20 transition-colors disabled:opacity-50"
                                >
                                  <HiOutlineCheckCircle className="w-3.5 h-3.5" />
                                  Shortlist
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(app._id, 'rejected')}
                                  disabled={isUpdating}
                                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50"
                                >
                                  <HiOutlineXCircle className="w-3.5 h-3.5" />
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-[var(--border)]">
              {applications.map((app, i) => {
                const candidate = app.candidateId;
                const config = statusConfig[app.status] || statusConfig.applied;
                const isUpdating = updatingId === app._id;

                return (
                  <div key={app._id} className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[var(--accent)] to-purple-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm font-bold">{candidate?.fullName?.charAt(0) || '?'}</span>
                        </div>
                        <div>
                          <div className="font-semibold text-[var(--text-primary)]">{candidate?.fullName || 'Unknown'}</div>
                          <div className="text-xs text-[var(--text-secondary)]">{candidate?.headline || ''}</div>
                        </div>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-medium border ${config.bg}`}>
                        {config.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 bg-[var(--bg-primary)] rounded-lg text-center">
                        <div className="text-xs text-[var(--text-secondary)]">Match Score</div>
                        <div className="font-bold text-[var(--accent)]">{app.matchScore}</div>
                      </div>
                      <div className="p-2 bg-[var(--bg-primary)] rounded-lg text-center">
                        <div className="text-xs text-[var(--text-secondary)]">Experience</div>
                        <div className="font-semibold text-[var(--text-primary)] text-sm">{candidate?.experienceYears || 0} yrs</div>
                      </div>
                    </div>

                    {candidate?.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills.slice(0, 4).map((s, j) => (
                          <span key={j} className="px-2 py-0.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded text-xs text-[var(--text-primary)]">{s.name}</span>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedCandidate(candidate)}
                        className="flex-1 py-2 text-sm font-medium text-[var(--accent)] bg-[var(--accent)]/10 rounded-lg"
                      >
                        View Profile
                      </button>
                      {app.status === 'applied' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(app._id, 'shortlisted')}
                            disabled={isUpdating}
                            className="flex-1 py-2 text-sm font-medium text-green-600 bg-green-500/10 rounded-lg disabled:opacity-50"
                          >
                            Shortlist
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(app._id, 'rejected')}
                            disabled={isUpdating}
                            className="flex-1 py-2 text-sm font-medium text-red-600 bg-red-500/10 rounded-lg disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {selectedCandidate && <CandidateModal candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)} />}
    </div>
  );
}
