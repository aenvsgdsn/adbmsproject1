import { useState, useEffect, useRef } from 'react';
import { Bell, Search, CheckCheck, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getNotifications, markAllNotificationsRead, markNotificationRead } from '../api';

const roleConfig = {
  Admin:   { bg: 'bg-rose-100 text-rose-600',     dot: 'bg-rose-500' },
  Faculty: { bg: 'bg-indigo-100 text-indigo-600',  dot: 'bg-indigo-500' },
  Student: { bg: 'bg-violet-100 text-violet-600',  dot: 'bg-violet-500' },
  Finance: { bg: 'bg-emerald-100 text-emerald-600', dot: 'bg-emerald-500' },
};

const timeAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60)    return 'Just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const Topbar = ({ onMenuClick }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef(null);
  const unread = notifications.filter(n => !n.is_read).length;

  const load = async () => {
    try {
      const { data } = await getNotifications();
      setNotifications(data || []);
    } catch (_) {}
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleMarkAll = async () => {
    await markAllNotificationsRead();
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const handleMarkOne = async (id) => {
    await markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.notification_id === id ? { ...n, is_read: true } : n));
  };

  const rc = roleConfig[user?.role] || roleConfig.Student;

  return (
    <header
      className="h-14 flex items-center px-4 sm:px-5 justify-between sticky top-0 z-30 gap-3 bg-white"
      style={{ borderBottom: '1px solid #e4e4e7' }}
    >
      {/* Left: Mobile menu + Search */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Mobile Hamburger */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-xl text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 transition-all duration-200 border border-zinc-200"
        >
          <Menu size={18} />
        </button>

        {/* Search */}
        <div
          className="hidden sm:flex items-center gap-2.5 flex-1 max-w-xs rounded-xl px-3.5 py-2 transition-all duration-200 focus-within:max-w-sm border border-zinc-200 bg-zinc-50 focus-within:bg-white focus-within:border-violet-300 focus-within:shadow-[0_0_0_3px_rgba(124,58,237,0.10)]"
        >
          <Search size={14} className="text-zinc-400 shrink-0" />
          <input
            type="text"
            placeholder="Search anything..."
            className="bg-transparent border-none outline-none text-sm w-full text-zinc-700 placeholder:text-zinc-400"
          />
        </div>
      </div>

      {/* Right: Notifications + User */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            id="notif-bell-btn"
            onClick={() => setShowNotif(v => !v)}
            className="relative p-2 rounded-xl text-zinc-500 hover:text-violet-600 hover:bg-violet-50 border border-zinc-200 hover:border-violet-200 transition-all duration-200"
          >
            <Bell size={18} />
            {unread > 0 && (
              <span className="absolute top-1 right-1 bg-violet-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-white leading-none">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotif && (
            <div
              className="absolute right-0 top-12 w-80 sm:w-96 rounded-2xl overflow-hidden z-50 animate-slide-up bg-white border border-zinc-200"
              style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.06)' }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-100 bg-zinc-50"
              >
                <div className="flex items-center gap-2">
                  <p className="font-bold text-sm text-zinc-900">Notifications</p>
                  {unread > 0 && (
                    <span className="bg-violet-100 text-violet-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-violet-200">
                      {unread} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unread > 0 && (
                    <button
                      onClick={handleMarkAll}
                      className="text-xs text-violet-600 hover:text-violet-800 flex items-center gap-1 font-semibold transition-colors"
                    >
                      <CheckCheck size={13} /> Mark all
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotif(false)}
                    className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="max-h-72 overflow-y-auto divide-y divide-zinc-100">
                {notifications.length === 0 ? (
                  <div className="py-10 text-center">
                    <div className="w-11 h-11 mx-auto mb-3 rounded-full flex items-center justify-center bg-violet-50">
                      <Bell size={18} className="text-violet-400" />
                    </div>
                    <p className="text-sm font-semibold text-zinc-700">All caught up!</p>
                    <p className="text-xs text-zinc-400 mt-1">No new notifications.</p>
                  </div>
                ) : (
                  notifications.slice(0, 10).map(n => (
                    <div
                      key={n.notification_id}
                      onClick={() => !n.is_read && handleMarkOne(n.notification_id)}
                      className="px-5 py-3.5 cursor-pointer transition-colors hover:bg-zinc-50"
                      style={{ background: !n.is_read ? 'rgba(245,243,255,0.50)' : 'transparent' }}
                    >
                      <div className="flex gap-3">
                        {!n.is_read && (
                          <div className="w-2 h-2 rounded-full bg-violet-500 mt-1.5 shrink-0" style={{ boxShadow: '0 0 5px rgba(124,58,237,0.5)' }} />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2 mb-0.5">
                            <p className={`text-sm font-semibold ${!n.is_read ? 'text-zinc-900' : 'text-zinc-700'}`}>{n.title}</p>
                            <span className="text-[11px] text-zinc-400 shrink-0 whitespace-nowrap">{timeAgo(n.created_at)}</span>
                          </div>
                          <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">{n.message}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-5 bg-zinc-200" />

        {/* User */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-bold text-zinc-900 leading-tight">{user?.username}</p>
            <p className="text-[11px] font-semibold text-zinc-400 leading-tight uppercase tracking-wider">{user?.role}</p>
          </div>
          <div
            className={`w-8 h-8 rounded-full ${rc.bg} flex items-center justify-center shrink-0 text-sm font-bold`}
            style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}
          >
            {user?.username?.charAt(0)?.toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
