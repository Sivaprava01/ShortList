import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import {
  HiOutlineHome,
  HiOutlineUser,
  HiOutlineBriefcase,
  HiOutlineArrowRightOnRectangle,
  HiOutlinePlusCircle,
  HiOutlineTableCells,
  HiOutlineChatBubbleLeftRight,
  HiOutlineSparkles,
  HiOutlineBookmark,
  HiBars3,
  HiXMark
} from 'react-icons/hi2';

const candidateLinks = [
  { to: '/candidate/dashboard', label: 'Dashboard', icon: HiOutlineHome },
  { to: '/candidate/profile', label: 'Profile', icon: HiOutlineUser },
  { to: '/candidate/matches', label: 'Matches', icon: HiOutlineBriefcase },
  { to: '/candidate/saved-jobs', label: 'Saved Jobs', icon: HiOutlineBookmark },
  { to: '/candidate/messages', label: 'Messages', icon: HiOutlineChatBubbleLeftRight },
  { to: '/candidate/for-you', label: 'For You', icon: HiOutlineSparkles },
];

const recruiterLinks = [
  { to: '/recruiter/dashboard', label: 'Dashboard', icon: HiOutlineHome },
  { to: '/recruiter/create-job', label: 'Create Job', icon: HiOutlinePlusCircle },
  { to: '/recruiter/jobs', label: 'Jobs', icon: HiOutlineTableCells },
  { to: '/recruiter/messages', label: 'Messages', icon: HiOutlineChatBubbleLeftRight },
];

export default function Sidebar({ role }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const links = role === 'recruiter' ? recruiterLinks : candidateLinks;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
        : 'text-secondary hover:bg-hover hover:text-primary'
    }`;

  const sidebarContent = (
    <>
      <div className="p-6 border-b border-custom">
        <div className="flex items-center gap-3">
          <Logo size="md" clickable={true} />
          <span className="text-lg font-bold text-primary">Shortlist</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1.5">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={linkClasses}
            onClick={() => setMobileOpen(false)}
          >
            <link.icon className="w-5 h-5" />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-custom">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 w-full transition-all duration-200"
        >
          <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 rounded-xl bg-card shadow-lg border border-custom lg:hidden"
      >
        <HiBars3 className="w-6 h-6 text-primary" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-sidebar border-r border-custom z-50 transform transition-transform duration-300 lg:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-hover"
        >
          <HiXMark className="w-5 h-5 text-secondary" />
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-72 h-screen bg-sidebar border-r border-custom sticky top-0">
        {sidebarContent}
      </aside>
    </>
  );
}
