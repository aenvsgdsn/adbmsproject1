import { useState, useEffect, useRef } from 'react';
import { Bell, Search, CheckCheck, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getNotifications, markAllNotificationsRead, markNotificationRead } from '../api';

const roleColors = {
  Admin:   'bg-rose-500',
  Faculty: 'bg-indigo-500',
  Student: 'bg-blue-500',
  Finance: 'bg-emerald-500',
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

  const avatarBg = roleColors[user?.role] || 'bg-blue-500';

  return (
    <header
      className="h-14 flex items-center px-4 sm:px-5 justify-between sticky top-0 z-30 gap-3"
      style={{
        background: 'rgba(255,255,255,0.82)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(219,234,254,0.60)',
        boxShadow: '0 1px 12px rgba(37,99,235,0.06)',
      }}
    >
      {/* Left: Mobile menu + Search */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Mobile Hamburger */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-xl text-slate-500 transition-all duration-200"
          style={{ border: '1.5px solid rgba(219,234,254,0.80)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,246,255,0.80)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <Menu size={18} />
        </button>

        {/* Search */}
        <div
          className="hidden sm:flex items-center gap-2.5 flex-1 max-w-xs rounded-xl px-3.5 py-2
            transition-all duration-200 focus-within:max-w-sm"
          style={{
            background: 'rgba(239,246,255,0.70)',
            border: '1.5px solid rgba(219,234,254,0.80)',
            backdropFilter: 'blur(8px)',
          }}
          onFocusCapture={e => {
            e.currentTarget.style.borderColor = 'rgba(96,165,250,0.60)';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.10)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.90)';
          }}
          onBlurCapture={e => {
            e.currentTarget.style.borderColor = 'rgba(219,234,254,0.80)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.background = 'rgba(239,246,255,0.70)';
          }}
        >
          <Search size={15} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search anything..."
            className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder:text-slate-400"
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
            className="relative p-2 rounded-xl text-slate-500 transition-all duration-200"
            style={{ border: '1.5px solid rgba(219,234,254,0.80)' }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(239,246,255,0.80)';
              e.currentTarget.style.color = '#2563eb';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '';
            }}
          >
            <Bell size={18} />
            {unread > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-white leading-none">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotif && (
            <div
              className="absolute right-0 top-12 w-80 sm:w-96 rounded-2xl overflow-hidden z-50 animate-slide-up"
              style={{
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(219,234,254,0.70)',
                boxShadow: '0 20px 60px rgba(37,99,235,0.12), 0 4px 16px rgba(0,0,0,0.08)',
              }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-5 py-3.5"
                style={{
                  background: 'linear-gradient(135deg, rgba(239,246,255,0.80), rgba(238,242,255,0.60))',
                  borderBottom: '1px solid rgba(219,234,254,0.60)',
                }}
              >
                <div className="flex items-center gap-2">
                  <p className="font-bold text-sm text-slate-800 font-outfit">Notifications</p>
                  {unread > 0 && (
                    <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200">
                      {unread} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unread > 0 && (
                    <button
                      onClick={handleMarkAll}
                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold transition-colors"
                    >
                      <CheckCheck size={13} /> Mark all
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotif(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100/80">
                {notifications.length === 0 ? (
                  <div className="py-10 text-center">
                    <div className="w-11 h-11 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ background: 'rgba(239,246,255,0.80)' }}>
                      <Bell size={18} className="text-blue-300" />
                    </div>
                    <p className="text-sm font-semibold text-slate-600">All caught up!</p>
                    <p className="text-xs text-slate-400 mt-1">No new notifications.</p>
                  </div>
                ) : (
                  notifications.slice(0, 10).map(n => (
                    <div
                      key={n.notification_id}
                      onClick={() => !n.is_read && handleMarkOne(n.notification_id)}
                      className="px-5 py-3.5 cursor-pointer transition-colors"
                      style={{
                        background: !n.is_read ? 'rgba(239,246,255,0.50)' : 'transparent',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,246,255,0.70)'}
                      onMouseLeave={e => e.currentTarget.style.background = !n.is_read ? 'rgba(239,246,255,0.50)' : 'transparent'}
                    >
                      <div className="flex gap-3">
                        {!n.is_read && (
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" style={{ boxShadow: '0 0 5px rgba(59,130,246,0.5)' }} />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2 mb-0.5">
                            <p className={`text-sm font-semibold ${!n.is_read ? 'text-slate-900' : 'text-slate-700'}`}>{n.title}</p>
                            <span className="text-[11px] text-slate-400 shrink-0 whitespace-nowrap">{timeAgo(n.created_at)}</span>
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

        {/* User Avatar */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-bold text-slate-800 leading-tight font-outfit">{user?.username}</p>
            <p className="text-[11px] font-semibold text-blue-500 leading-tight uppercase tracking-wider">{user?.role}</p>
          </div>
          <div
            className={`w-8 h-8 rounded-full ${avatarBg} flex items-center justify-center shrink-0 text-white text-sm font-bold`}
            style={{
              boxShadow: '0 2px 8px rgba(37,99,235,0.25)',
              border: '2px solid rgba(255,255,255,0.90)',
              outline: '1.5px solid rgba(147,197,253,0.50)',
            }}
          >
            {user?.username?.charAt(0)?.toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
