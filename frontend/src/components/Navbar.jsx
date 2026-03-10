import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const titles = {
  '/candidate/dashboard': 'Candidate Dashboard',
  '/candidate/profile': 'My Profile',
  '/candidate/matches': 'My Matches',
  '/recruiter/dashboard': 'Recruiter Dashboard',
  '/recruiter/create-job': 'Create Job',
  '/recruiter/jobs': 'My Jobs',
};

export default function Navbar() {
  const location = useLocation();
  const { user } = useAuth();

  const pageTitle = useMemo(() => {
    if (location.pathname.startsWith('/recruiter/matches/')) {
      return 'Match Results';
    }
    return titles[location.pathname] || 'Shortlist';
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-30 bg-gray-50/90 backdrop-blur border-b border-gray-200">
      <div className="h-16 px-4 lg:px-8 flex items-center justify-end lg:justify-between">
        <h1 className="hidden lg:block text-sm font-semibold tracking-wide text-gray-600">
          {pageTitle}
        </h1>
        <div className="text-xs sm:text-sm text-gray-600">
          <span className="font-medium text-gray-900">{user?.email}</span>
        </div>
      </div>
    </header>
  );
}
