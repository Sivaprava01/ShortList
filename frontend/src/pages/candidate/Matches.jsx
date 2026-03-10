import { useState, useEffect } from 'react';
import { getCandidateMatches } from '../../api/axios';
import { HiOutlineBriefcase, HiOutlineMapPin, HiOutlineChartBar } from 'react-icons/hi2';

export default function MatchedJobs() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await getCandidateMatches();
        setMatches(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

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
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">Matched Jobs</h1>
        <p className="text-[var(--text-secondary)] mt-1">Jobs where you've been matched based on your profile.</p>
      </div>

      {matches.length === 0 ? (
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] p-16 text-center">
          <HiOutlineBriefcase className="w-16 h-16 text-[var(--text-secondary)] mx-auto mb-4 opacity-40" />
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No matches yet</h3>
          <p className="text-[var(--text-secondary)]">When recruiters run matching on their jobs, you'll see your matches here.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches.map((match, i) => (
            <div key={i} className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] p-6 hover:shadow-xl hover:border-[var(--accent)]/30 transition-all duration-300 animate-fade-in" style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'both' }}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[var(--accent)] to-purple-600 rounded-xl flex items-center justify-center">
                  <HiOutlineBriefcase className="w-5 h-5 text-white" />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
                  <HiOutlineChartBar className="w-4 h-4" />
                  <span className="text-sm font-bold">{match.matchScore}%</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{match.jobTitle}</h3>
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-3">
                <HiOutlineMapPin className="w-4 h-4" />
                {match.location || 'Remote'}
              </div>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3">{match.jobDescription}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
