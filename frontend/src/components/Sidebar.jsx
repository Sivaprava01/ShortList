import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineHome,
  HiOutlineUser,
  HiOutlineBriefcase,
  HiOutlineArrowRightOnRectangle,
  HiOutlinePlusCircle,
  HiOutlineTableCells,
  HiBars3,
  HiXMark
} from 'react-icons/hi2';

const candidateLinks = [
  { to: '/candidate/dashboard', label: 'Dashboard', icon: HiOutlineHome },
  { to: '/candidate/profile', label: 'Profile', icon: HiOutlineUser },
  { to: '/candidate/matches', label: 'Matches', icon: HiOutlineBriefcase },
];

const recruiterLinks = [
  { to: '/recruiter/dashboard', label: 'Dashboard', icon: HiOutlineHome },
  { to: '/recruiter/create-job', label: 'Create Job', icon: HiOutlinePlusCircle },
  { to: '/recruiter/jobs', label: 'Jobs', icon: HiOutlineTableCells },
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
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;

  const sidebarContent = (
    <>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="text-lg font-bold text-gray-900">Shortlist</span>
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

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 w-full transition-all duration-200"
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
        className="fixed top-4 left-4 z-50 p-2 rounded-xl bg-white shadow-lg border border-gray-200 lg:hidden"
      >
        <HiBars3 className="w-6 h-6 text-gray-900" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 lg:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100"
        >
          <HiXMark className="w-5 h-5 text-gray-600" />
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-72 h-screen bg-white border-r border-gray-200 sticky top-0">
        {sidebarContent}
      </aside>
    </>
  );
}
