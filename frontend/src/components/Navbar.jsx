import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import NotificationBell from './NotificationBell';
import {
  HiOutlineSun,
  HiOutlineMoon,
} from 'react-icons/hi2';

const titles = {
  '/candidate/dashboard': 'Candidate Dashboard',
  '/candidate/profile': 'My Profile',
  '/candidate/matches': 'My Matches',
  '/candidate/saved-jobs': 'Saved Jobs',
  '/candidate/messages': 'Messages',
  '/candidate/for-you': 'For You',
  '/recruiter/dashboard': 'Recruiter Dashboard',
  '/recruiter/create-job': 'Create Job',
  '/recruiter/jobs': 'My Jobs',
  '/recruiter/messages': 'Messages',
};

export default function Navbar() {
  const location = useLocation();
  const { user } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

  const pageTitle = useMemo(() => {
    if (location.pathname.startsWith('/recruiter/matches/')) return 'Match Results';
    if (location.pathname.startsWith('/recruiter/jobs/') && location.pathname.includes('/applicants')) return 'Applicants';
    return titles[location.pathname] || 'Shortlist';
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-30 bg-sidebar/90 backdrop-blur border-b border-custom">
      <div className="h-16 px-4 lg:px-8 flex items-center justify-end lg:justify-between">
        <h1 className="hidden lg:block text-sm font-semibold tracking-wide text-secondary">
          {pageTitle}
        </h1>

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-custom text-secondary hover:bg-hover hover:text-primary transition-all duration-200"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
          >
            {darkMode
              ? <HiOutlineSun className="w-5 h-5" />
              : <HiOutlineMoon className="w-5 h-5" />
            }
          </button>

          {/* Notification Bell */}
          <NotificationBell />

          {/* User email */}
          <span className="text-xs sm:text-sm font-medium text-primary">
            {user?.email}
          </span>
        </div>
      </div>
    </header>
  );
}
