import { useState, useEffect, useRef } from 'react';
import { Bell, Search, CheckCheck, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getNotifications, markAllNotificationsRead, markNotificationRead } from '../api';

const timeAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60)    return 'Just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const roleColors = {
  Admin:   '#7c3aed',
  Faculty: '#2563eb',
  Student: '#059669',
  Finance: '#d97706',
};

const Topbar = ({ onMenuClick }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef(null);
  const unread = notifications.filter(n => !n.is_read).length;
  const roleColor = roleColors[user?.role] || '#7c3aed';

  const load = async () => {
    try { const { data } = await getNotifications(); setNotifications(data || []); } catch (_) {}
  };

  useEffect(() => { load(); const id = setInterval(load, 60000); return () => clearInterval(id); }, []);
  useEffect(() => {
    const h = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const handleMarkAll = async () => { await markAllNotificationsRead(); setNotifications(p => p.map(n => ({ ...n, is_read: true }))); };
  const handleMarkOne = async (id) => { await markNotificationRead(id); setNotifications(p => p.map(n => n.notification_id === id ? { ...n, is_read: true } : n)); };

  return (
    <header
      className="h-14 flex items-center px-4 sm:px-5 justify-between sticky top-0 z-30 gap-3"
      style={{
        background: 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(20px) saturate(1.8)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        boxShadow: '0 1px 12px rgba(0,0,0,0.04)',
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg transition-colors"
          style={{ color: '#525252', background: 'none', border: '1px solid rgba(0,0,0,0.08)', cursor: 'pointer' }}
        >
          <Menu size={17} />
        </button>

        {/* Search — liquid glass */}
        <div
          className="hidden sm:flex items-center gap-2.5 flex-1 max-w-xs px-3.5 py-2 rounded-xl transition-all duration-200"
          style={{
            background: 'rgba(255,255,255,0.70)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1.5px solid rgba(0,0,0,0.08)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.90)',
          }}
        >
          <Search size={14} style={{ color: '#a3a3a3', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search anything..."
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '13.5px',
              width: '100%',
              color: '#0a0a0a',
              fontFamily: 'Inter, sans-serif',
            }}
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 shrink-0">

        {/* Bell */}
        <div className="relative" ref={notifRef}>
          <button
            id="notif-bell-btn"
            onClick={() => setShowNotif(v => !v)}
            className="relative p-2 rounded-xl transition-all duration-150"
            style={{
              background: showNotif ? 'rgba(124,58,237,0.08)' : 'transparent',
              border: showNotif ? '1px solid rgba(124,58,237,0.15)' : '1px solid rgba(0,0,0,0.07)',
              cursor: 'pointer',
              color: showNotif ? '#7c3aed' : '#737373',
            }}
            onMouseEnter={e => { if (!showNotif) e.currentTarget.style.background = '#f5f5f5'; }}
            onMouseLeave={e => { if (!showNotif) e.currentTarget.style.background = 'transparent'; }}
          >
            <Bell size={17} />
            {unread > 0 && (
              <span
                className="absolute top-1 right-1 text-white font-bold flex items-center justify-center border-2 border-white"
                style={{
                  width: '16px', height: '16px', borderRadius: '50%',
                  background: '#7c3aed', fontSize: '9px', lineHeight: 1,
                }}
              >
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>

          {/* Notification panel — liquid glass */}
          {showNotif && (
            <div
              className="absolute right-0 top-12 w-80 sm:w-[340px] rounded-2xl overflow-hidden z-50 animate-slide-up"
              style={{
                background: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(28px) saturate(1.8)',
                WebkitBackdropFilter: 'blur(28px) saturate(1.8)',
                border: '1px solid rgba(0,0,0,0.09)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.90)',
              }}
            >
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
              >
                <div className="flex items-center gap-2">
                  <p style={{ fontWeight: 700, fontSize: '13.5px', color: '#0a0a0a', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    Notifications
                  </p>
                  {unread > 0 && (
                    <span
                      style={{
                        background: 'rgba(124,58,237,0.10)', color: '#7c3aed',
                        fontSize: '10px', fontWeight: 700, padding: '2px 8px',
                        borderRadius: '99px', border: '1px solid rgba(124,58,237,0.15)',
                      }}
                    >{unread} new</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unread > 0 && (
                    <button
                      onClick={handleMarkAll}
                      className="flex items-center gap-1"
                      style={{ fontSize: '11.5px', fontWeight: 600, color: '#7c3aed', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      <CheckCheck size={12} /> Mark all
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotif(false)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a3a3a3', padding: '2px', display: 'flex' }}
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto" style={{ maxHeight: '280px' }}>
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-2">
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(124,58,237,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Bell size={16} style={{ color: '#7c3aed' }} />
                    </div>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#525252' }}>All caught up!</p>
                    <p style={{ fontSize: '12px', color: '#a3a3a3' }}>No new notifications</p>
                  </div>
                ) : (
                  notifications.slice(0, 10).map(n => (
                    <div
                      key={n.notification_id}
                      onClick={() => !n.is_read && handleMarkOne(n.notification_id)}
                      className="px-4 py-3 cursor-pointer transition-colors"
                      style={{
                        borderBottom: '1px solid rgba(0,0,0,0.04)',
                        background: !n.is_read ? 'rgba(124,58,237,0.03)' : 'transparent',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.025)'}
                      onMouseLeave={e => e.currentTarget.style.background = !n.is_read ? 'rgba(124,58,237,0.03)' : 'transparent'}
                    >
                      <div className="flex gap-2.5">
                        {!n.is_read && (
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#7c3aed', marginTop: '6px', flexShrink: 0 }} />
                        )}
                        <div className="flex-1 min-w-0" style={{ paddingLeft: n.is_read ? '10px' : 0 }}>
                          <div className="flex justify-between items-start gap-2">
                            <p style={{ fontSize: '13px', fontWeight: n.is_read ? 500 : 600, color: '#0a0a0a', lineHeight: 1.4 }}>{n.title}</p>
                            <span style={{ fontSize: '11px', color: '#a3a3a3', whiteSpace: 'nowrap', flexShrink: 0 }}>{timeAgo(n.created_at)}</span>
                          </div>
                          <p style={{ fontSize: '12px', color: '#737373', marginTop: '2px', lineHeight: 1.5 }} className="line-clamp-2">{n.message}</p>
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
        <div style={{ width: '1px', height: '20px', background: 'rgba(0,0,0,0.08)' }} className="hidden sm:block" />

        {/* User */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:block text-right">
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#0a0a0a', lineHeight: 1.3, letterSpacing: '-0.01em' }}>{user?.username}</p>
            <p style={{ fontSize: '10px', fontWeight: 700, color: '#a3a3a3', lineHeight: 1.3, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{user?.role}</p>
          </div>
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm"
            style={{ background: roleColor, boxShadow: `0 2px 8px ${roleColor}40` }}
          >
            {user?.username?.charAt(0)?.toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
