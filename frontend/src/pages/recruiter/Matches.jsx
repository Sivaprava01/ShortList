import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMatchesForJob, getJobById, startChat } from '../../api/axios';
import { HiOutlineUser, HiOutlineXMark, HiOutlineLink, HiOutlineAcademicCap, HiOutlineWrenchScrewdriver, HiOutlineRocketLaunch, HiOutlineChatBubbleLeftRight } from 'react-icons/hi2';

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
          {/* Headline & Bio */}
          {candidate.headline && <p className="text-[var(--accent)] font-medium">{candidate.headline}</p>}
          {candidate.bio && <p className="text-sm text-[var(--text-secondary)]">{candidate.bio}</p>}

          {/* Skills */}
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

          {/* Projects */}
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

          {/* Experience */}
          {candidate.experienceYears > 0 && (
            <div>
              <h3 className="font-semibold text-[var(--text-primary)] mb-1">Experience</h3>
              <p className="text-sm text-[var(--text-secondary)]">{candidate.experienceYears} years</p>
            </div>
          )}

          {/* Education */}
          {candidate.education?.degree && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <HiOutlineAcademicCap className="w-4 h-4 text-amber-500" />
                <h3 className="font-semibold text-[var(--text-primary)]">Education</h3>
              </div>
              <p className="text-sm text-[var(--text-primary)]">{candidate.education.degree} — {candidate.education.institution}</p>
              <p className="text-xs text-[var(--text-secondary)]">Year: {candidate.education.year} {candidate.education.GPA ? `| GPA: ${candidate.education.GPA}` : ''}</p>
            </div>
          )}

          {/* Links */}
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

export default function Matches() {
  const { jobId } = useParams();
  const [matches, setMatches] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [startingChatId, setStartingChatId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [matchRes, jobRes] = await Promise.all([
          getMatchesForJob(jobId),
          getJobById(jobId)
        ]);
        setMatches(matchRes.data || []);
        setJob(jobRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [jobId]);

  const handleStartChat = async (candidateId) => {
    setStartingChatId(candidateId);
    try {
      await startChat(jobId, candidateId);
      alert('Chat started! You can now message this candidate from the Messages page.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to start chat');
    } finally {
      setStartingChatId(null);
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
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">Match Results</h1>
        {job && <p className="text-[var(--text-secondary)] mt-1">Matches for <span className="font-medium text-[var(--text-primary)]">{job.title}</span></p>}
      </div>

      {matches.length === 0 ? (
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] p-16 text-center">
          <HiOutlineUser className="w-16 h-16 text-[var(--text-secondary)] mx-auto mb-4 opacity-40" />
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No matches yet</h3>
          <p className="text-[var(--text-secondary)]">Run the matching engine on this job to find candidates.</p>
        </div>
      ) : (
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">#</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">Candidate</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">Final Score</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">Skill</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">Experience</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">Project</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">Action</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((match, i) => (
                  <tr key={i} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--hover)] transition-colors">
                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{i + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-[var(--accent)] to-purple-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm font-bold">{match.candidateProfile?.fullName?.charAt(0) || '?'}</span>
                        </div>
                        <div>
                          <div className="font-medium text-[var(--text-primary)]">{match.candidateProfile?.fullName || 'Unknown'}</div>
                          <div className="text-xs text-[var(--text-secondary)]">{match.candidateProfile?.headline || ''}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] text-sm font-bold rounded-lg">{match.finalScore}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{match.scoreBreakdown?.skillScore || 0}</td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{match.scoreBreakdown?.experienceScore || 0}</td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{match.scoreBreakdown?.projectScore || 0}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedCandidate(match.candidateProfile)}
                          className="text-sm font-medium text-[var(--accent)] hover:underline"
                        >
                          View Profile
                        </button>
                        <button
                          onClick={() => handleStartChat(match.candidateProfile.userId)}
                          disabled={startingChatId === match.candidateProfile.userId}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-500/10 rounded-lg hover:bg-blue-500/20 transition-colors disabled:opacity-50"
                        >
                          <HiOutlineChatBubbleLeftRight className="w-3.5 h-3.5" />
                          {startingChatId === match.candidateProfile.userId ? 'Starting...' : 'Start Chat'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-[var(--border)]">
            {matches.map((match, i) => (
              <div key={i} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-[var(--accent)] to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{match.candidateProfile?.fullName?.charAt(0) || '?'}</span>
                    </div>
                    <div>
                      <div className="font-medium text-[var(--text-primary)]">{match.candidateProfile?.fullName || 'Unknown'}</div>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] text-sm font-bold rounded-lg">{match.finalScore}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-[var(--bg-primary)] rounded-lg">
                    <div className="text-xs text-[var(--text-secondary)]">Skill</div>
                    <div className="font-semibold text-[var(--text-primary)] text-sm">{match.scoreBreakdown?.skillScore || 0}</div>
                  </div>
                  <div className="p-2 bg-[var(--bg-primary)] rounded-lg">
                    <div className="text-xs text-[var(--text-secondary)]">Exp</div>
                    <div className="font-semibold text-[var(--text-primary)] text-sm">{match.scoreBreakdown?.experienceScore || 0}</div>
                  </div>
                  <div className="p-2 bg-[var(--bg-primary)] rounded-lg">
                    <div className="text-xs text-[var(--text-secondary)]">Project</div>
                    <div className="font-semibold text-[var(--text-primary)] text-sm">{match.scoreBreakdown?.projectScore || 0}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedCandidate(match.candidateProfile)}
                    className="flex-1 py-2 text-sm font-medium text-[var(--accent)] bg-[var(--accent)]/10 rounded-lg"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => handleStartChat(match.candidateProfile.userId)}
                    disabled={startingChatId === match.candidateProfile.userId}
                    className="flex-1 py-2 text-sm font-medium text-blue-600 bg-blue-500/10 rounded-lg disabled:opacity-50"
                  >
                    {startingChatId === match.candidateProfile.userId ? 'Starting...' : 'Start Chat'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedCandidate && <CandidateModal candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)} />}
    </div>
  );
}
