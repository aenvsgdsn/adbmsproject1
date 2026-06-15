import { useState, useEffect, useRef } from 'react';
import { Bell, Search, CheckCheck, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getNotifications, markAllNotificationsRead, markNotificationRead } from '../api';

const roleColors = {
  Admin: 'bg-rose-500',
  Faculty: 'bg-indigo-500',
  Student: 'bg-blue-500',
  Finance: 'bg-emerald-500',
};

const timeAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
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

  // Click outside to close
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
    setNotifications(notifications.map(n => ({ ...n, is_read: true })));
  };

  const handleMarkOne = async (id) => {
    await markNotificationRead(id);
    setNotifications(notifications.map(n => n.notification_id === id ? { ...n, is_read: true } : n));
  };

  const avatarColor = roleColors[user?.role] || 'bg-indigo-600';

  return (
    <div className="h-16 bg-white border-b border-slate-200 flex items-center px-4 sm:px-6 justify-between sticky top-0 z-30 shadow-sm shadow-slate-100/50">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
        >
          <Menu size={20} />
        </button>

        {/* Search placeholder */}
        <div className="hidden sm:flex items-center gap-2.5 text-slate-400 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 w-64 focus-within:bg-white focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
          <Search size={16} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            id="notif-bell-btn"
            onClick={() => setShowNotif(!showNotif)}
            className="relative p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-200"
          >
            <Bell size={20} className={unread > 0 ? "animate-pulse-glow rounded-full" : ""} />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none border-2 border-white shadow-sm">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>

          {showNotif && (
            <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-slide-up origin-top-right">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-sm text-slate-800 font-outfit">Notifications</p>
                  {unread > 0 && (
                    <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {unread} new
                    </span>
                  )}
                </div>
                {unread > 0 && (
                  <button onClick={handleMarkAll} className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-semibold transition-colors">
                    <CheckCheck size={14} /> Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-[320px] overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="py-10 text-center">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-slate-100">
                      <Bell size={20} className="text-slate-300" />
                    </div>
                    <p className="text-sm font-semibold text-slate-600">You're all caught up!</p>
                    <p className="text-xs text-slate-400 mt-1">No new notifications right now.</p>
                  </div>
                ) : (
                  notifications.slice(0, 10).map(n => (
                    <div
                      key={n.notification_id}
                      onClick={() => !n.is_read && handleMarkOne(n.notification_id)}
                      className={`px-5 py-4 cursor-pointer hover:bg-slate-50 transition-colors ${!n.is_read ? 'bg-indigo-50/30' : ''}`}
                    >
                      <div className="flex gap-3">
                        {!n.is_read && (
                          <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2 mb-1">
                            <p className={`text-sm font-semibold ${!n.is_read ? 'text-slate-900' : 'text-slate-700'}`}>{n.title}</p>
                            <span className="text-[11px] font-medium text-slate-400 shrink-0 whitespace-nowrap">{timeAgo(n.created_at)}</span>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{n.message}</p>
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
        <div className="hidden sm:block w-px h-6 bg-slate-200" />

        {/* User Avatar + Info */}
        <div className="flex items-center gap-3 pl-1 sm:pl-0">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-bold text-slate-800 leading-tight font-outfit">{user?.username}</p>
            <p className="text-[11px] font-semibold text-slate-400 leading-tight uppercase tracking-wider">{user?.role}</p>
          </div>
          <div className={`w-9 h-9 rounded-full ${avatarColor} flex items-center justify-center shrink-0 shadow-sm border-2 border-white ring-2 ring-slate-100`}>
            <span className="text-white text-sm font-bold">
              {user?.username?.charAt(0)?.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
