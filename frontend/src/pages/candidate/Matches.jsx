import { useState, useEffect } from 'react';
import { getCandidateMatches } from '../../api/axios';
import { HiOutlineBriefcase, HiOutlineMapPin, HiOutlineChartBar, HiOutlineWrenchScrewdriver, HiOutlineAcademicCap, HiOutlineRocketLaunch } from 'react-icons/hi2';

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
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Job Matches</h1>
        <p className="text-gray-600 mt-1">Jobs where you've been selected as a top candidate based on your profile.</p>
      </div>

      {matches.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
          <HiOutlineBriefcase className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-40" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No matches yet</h3>
          <p className="text-gray-600">Complete your profile and wait for recruiters to run matching on their jobs.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            Found {matches.length} job{matches.length !== 1 ? 's' : ''} where you're a top candidate
          </div>
          
          <div className="grid gap-6">
            {matches.map((match, i) => (
              <div key={match.jobId || i} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-indigo-300 transition-all duration-300 animate-fade-in" style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'both' }}>
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Job Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                          <HiOutlineBriefcase className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{match.jobTitle}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                            <HiOutlineMapPin className="w-4 h-4" />
                            {match.location || 'Remote'}
                          </div>
                        </div>
                      </div>
                      
                      {/* Overall Score */}
                      <div className="text-center">
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl">
                          <HiOutlineChartBar className="w-5 h-5" />
                          <span className="text-lg font-bold">{match.matchScore}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Match Score</div>
                      </div>
                    </div>

                    <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">{match.jobDescription}</p>
                    
                    {/* Score Breakdown */}
                    {match.scoreBreakdown && (
                      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <HiOutlineWrenchScrewdriver className="w-4 h-4 text-indigo-500" />
                            <span className="text-sm font-medium text-gray-900">{match.scoreBreakdown.skillScore || 0}</span>
                          </div>
                          <div className="text-xs text-gray-500">Skills</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <HiOutlineAcademicCap className="w-4 h-4 text-amber-500" />
                            <span className="text-sm font-medium text-gray-900">{match.scoreBreakdown.experienceScore || 0}</span>
                          </div>
                          <div className="text-xs text-gray-500">Experience</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <HiOutlineRocketLaunch className="w-4 h-4 text-purple-500" />
                            <span className="text-sm font-medium text-gray-900">{match.scoreBreakdown.projectScore || 0}</span>
                          </div>
                          <div className="text-xs text-gray-500">Projects</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Match Status */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    Matched on {new Date(match.createdAt).toLocaleDateString()}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    match.status === 'notified' ? 'bg-blue-50 text-blue-700' :
                    match.status === 'viewed' ? 'bg-yellow-50 text-yellow-700' :
                    match.status === 'applied' ? 'bg-green-50 text-green-700' :
                    'bg-gray-50 text-gray-700'
                  }`}>
                    {match.status === 'notified' ? 'New Match' :
                     match.status === 'viewed' ? 'Viewed by Recruiter' :
                     match.status === 'applied' ? 'Applied' :
                     match.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
