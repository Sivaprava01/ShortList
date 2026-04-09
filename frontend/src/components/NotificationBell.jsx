import { useState, useEffect, useRef } from 'react';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../api/axios';
import { HiOutlineBell, HiBell } from 'react-icons/hi2';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data || []);
    } catch (err) {
      // silent
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkOne = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) { /* silent */ }
  };

  const handleMarkAll = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) { /* silent */ }
  };

  const typeColors = {
    match: 'bg-indigo-500/10 text-indigo-500',
    job: 'bg-blue-500/10 text-blue-500',
    application: 'bg-amber-500/10 text-amber-600',
    shortlist: 'bg-emerald-500/10 text-emerald-600',
    rejection: 'bg-red-500/10 text-red-500',
    profile: 'bg-purple-500/10 text-purple-500',
    system: 'bg-gray-500/10 text-secondary',
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="relative p-2 rounded-xl border border-custom text-secondary hover:bg-hover hover:text-primary transition-all duration-200"
        aria-label="Notifications"
      >
        {unreadCount > 0
          ? <HiBell className="w-5 h-5 text-indigo-500" />
          : <HiOutlineBell className="w-5 h-5" />
        }
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-12 w-80 bg-card border border-custom rounded-2xl shadow-2xl z-50 overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-custom">
            <h3 className="font-semibold text-primary text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAll}
                className="text-xs text-indigo-500 hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notification list */}
          <div className="max-h-80 overflow-y-auto divide-y divide-custom">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-secondary text-sm">
                No notifications yet
              </div>
            ) : (
              notifications.slice(0, 10).map(n => (
                <button
                  key={n._id}
                  onClick={() => handleMarkOne(n._id)}
                  className={`w-full text-left px-4 py-3 hover:bg-hover transition-colors ${!n.read ? 'bg-indigo-500/5' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide shrink-0 ${typeColors[n.type] || typeColors.system}`}>
                      {n.type}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-snug ${!n.read ? 'text-primary font-medium' : 'text-secondary'}`}>
                        {n.message}
                      </p>
                      <p className="text-[10px] text-secondary mt-1">
                        {new Date(n.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {!n.read && (
                      <div className="w-2 h-2 bg-indigo-500 rounded-full shrink-0 mt-1.5" />
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
