import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineArrowRight,
  HiOutlineBriefcase,
  HiOutlineMapPin,
  HiOutlineRocketLaunch,
  HiOutlineUser,
  HiOutlineWrenchScrewdriver,
} from 'react-icons/hi2';
import { getCandidateMatches, getMyProfile } from '../../api/axios';
import Card from '../../components/Card';

export default function CandidateDashboard() {
  const [profile, setProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, matchRes] = await Promise.all([
          getMyProfile().catch(() => ({ data: null })),
          getCandidateMatches().catch(() => ({ data: [] })),
        ]);
        setProfile(profileRes.data);
        setMatches(matchRes.data || []);
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

  const profileCompletion = profile
    ? (() => {
        let score = 0;
        if (profile.fullName) score += 20;
        if (profile.skills?.length) score += 20;
        if (profile.projects?.length) score += 20;
        if (profile.education?.degree) score += 20;
        if (profile.bio) score += 20;
        return score;
      })()
    : 0;

  const stats = [
    { label: 'Profile Completion', value: `${profileCompletion}%`, icon: HiOutlineUser, color: 'from-indigo-500 to-indigo-600' },
    { label: 'Matched Jobs', value: matches.length, icon: HiOutlineBriefcase, color: 'from-emerald-500 to-emerald-600' },
    { label: 'Skills', value: profile?.skills?.length || 0, icon: HiOutlineWrenchScrewdriver, color: 'from-amber-500 to-orange-500' },
    { label: 'Projects', value: profile?.projects?.length || 0, icon: HiOutlineRocketLaunch, color: 'from-rose-500 to-pink-600' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
          Welcome back{profile?.fullName ? `, ${profile.fullName}` : ''}
        </h2>
        <p className="text-[var(--text-secondary)] mt-1">Overview of your profile and current matches.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card
            key={stat.label}
            className="p-5 hover:shadow-lg transition-all duration-300 animate-fade-in"
            style={{ animationDelay: `${index * 0.08}s`, animationFillMode: 'both' }}
          >
            <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-[var(--text-primary)]">{stat.value}</div>
            <div className="text-sm text-[var(--text-secondary)] mt-1">{stat.label}</div>
          </Card>
        ))}
      </div>

      {profileCompletion < 100 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-[var(--text-primary)]">Complete your profile</h3>
            <Link to="/candidate/profile" className="text-sm text-[var(--accent)] font-medium hover:underline flex items-center gap-1">
              Edit Profile <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="w-full bg-[var(--bg-primary)] rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-[var(--accent)] to-purple-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
          <p className="text-sm text-[var(--text-secondary)] mt-2">
            {profileCompletion}% complete - add more details to improve your match score.
          </p>
        </Card>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Recent Matched Jobs</h3>
          {matches.length > 0 && (
            <Link to="/candidate/matches" className="text-sm text-[var(--accent)] font-medium hover:underline">
              View all
            </Link>
          )}
        </div>
        {matches.length === 0 ? (
          <Card className="p-12 text-center">
            <HiOutlineBriefcase className="w-12 h-12 text-[var(--text-secondary)] mx-auto mb-4 opacity-50" />
            <p className="text-[var(--text-secondary)]">No matched jobs yet. Complete your profile to get matched.</p>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {matches.slice(0, 4).map((match) => (
              <Card key={match.jobId} className="p-5 hover:shadow-lg hover:border-[var(--accent)]/30 transition-all duration-300">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-[var(--text-primary)]">{match.jobTitle}</h4>
                  <span className="px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] text-sm font-semibold rounded-lg">
                    {match.matchScore}%
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <HiOutlineMapPin className="w-4 h-4" />
                  {match.location || 'Remote'}
                </div>
                <p className="text-sm text-[var(--text-secondary)] mt-2 line-clamp-2">{match.jobDescription}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
