import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar, { navItems } from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { GraduationCap, LogOut, X } from 'lucide-react';

const AppLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const items = navItems[user?.role] || [];
  
  // Only show the first 5 items on the bottom nav to prevent crowding
  const bottomItems = items.slice(0, 5);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden font-inter">

      {/* ── Desktop Sidebar ─────────────────────────────── */}
      <Sidebar />

      {/* ── Mobile Full-Screen Menu Overlay ─────────────── */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 md:hidden animate-fade-in"
            style={{ background: 'rgba(15,23,42,0.50)', backdropFilter: 'blur(8px)' }}
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-in Menu Panel */}
          <div
            className="fixed inset-y-0 left-0 z-50 w-80 flex flex-col md:hidden animate-slide-in-left glass"
            style={{
              background: 'rgba(255,255,255,0.85)',
              borderRight: '1px solid var(--glass-border)',
              boxShadow: '8px 0 40px rgba(15,23,42,0.15)',
            }}
          >
            {/* Menu Header */}
            <div
              className="flex items-center justify-between px-6 py-5"
              style={{
                borderBottom: '1px solid rgba(226,232,240,0.8)',
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-violet"
                  style={{ background: 'linear-gradient(135deg, var(--violet-500), var(--violet-700))' }}
                >
                  <GraduationCap className="text-white" size={20} />
                </div>
                <div>
                  <span className="font-jakarta font-extrabold text-xl text-zinc-900 tracking-tight block leading-none mb-1">HiSUP</span>
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-violet-600 block">Platform</span>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl text-zinc-500 hover:text-zinc-900 bg-white shadow-sm border border-zinc-200 transition-all hover:scale-105"
              >
                <X size={18} />
              </button>
            </div>

            {/* Mobile Nav Links - NOW SHOWS ALL ITEMS */}
            <nav className="flex-1 overflow-y-auto py-4 px-4">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 px-3 mb-3">Main Menu</p>
              <ul className="flex flex-col gap-1.5">
                {items.map(({ to, icon: Icon, label }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) => `
                        flex items-center gap-4 px-4 py-3.5 rounded-xl text-[15px] font-bold
                        transition-all duration-200 group
                        ${isActive ? 'text-violet-700 bg-white/80 shadow-sm border border-white' : 'text-zinc-500 hover:text-zinc-900 hover:bg-white/50 border border-transparent'}
                      `}
                    >
                      {({ isActive }) => (
                        <>
                          <Icon size={20} className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-violet-600' : 'text-zinc-400 group-hover:text-zinc-600'}`} />
                          <span>{label}</span>
                          {isActive && <div className="ml-auto w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* User + Logout */}
            <div
              className="p-5"
              style={{ borderTop: '1px solid rgba(226,232,240,0.8)' }}
            >
              <div
                className="flex items-center gap-3 p-3.5 rounded-2xl mb-3 glass"
                style={{ background: 'rgba(255,255,255,0.7)' }}
              >
                <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-[15px] shadow-sm">
                  {user?.username?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-[15px] font-extrabold text-zinc-900">{user?.username}</p>
                  <p className="text-xs font-bold text-violet-600 uppercase tracking-wide mt-0.5">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-3 w-full px-4 py-3.5 rounded-xl text-[15px] font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 transition-all duration-200 group"
              >
                <LogOut size={18} className="transition-transform group-hover:-translate-x-1" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Main Content ────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        <Topbar onMenuClick={() => setMobileMenuOpen(true)} />
        <main
          className="flex-1 overflow-y-auto pb-24 md:pb-6 pt-6"
          style={{ paddingInline: 'clamp(1.5rem, 3vw, 3rem)' }}
        >
          <div className="mx-auto max-w-[1400px] w-full animate-fade-in-up">
            <Outlet />
          </div>
        </main>
      </div>

      {/* ── Mobile Glass Bottom Nav (iPhone-style) ──────── */}
      <nav
        className="mobile-bottom-nav justify-around px-2"
      >
        {bottomItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className="flex flex-col items-center justify-center gap-1.5 p-2 transition-all duration-200 flex-1"
          >
            {({ isActive }) => (
              <>
                <div
                  className={`p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-violet-100 shadow-[0_0_12px_rgba(99,102,241,0.2)] scale-110' : ''}`}
                >
                  <Icon
                    size={22}
                    className={isActive ? 'text-violet-600' : 'text-zinc-400'}
                  />
                </div>
                <span
                  className={`text-[11px] font-bold tracking-wide leading-none ${isActive ? 'text-violet-700' : 'text-zinc-400'}`}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AppLayout;
