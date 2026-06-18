import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import {
  LayoutDashboard, GraduationCap, Users, BookOpen, CalendarCheck,
  BarChart2, DollarSign, Library, Home, ClipboardList, X, LogOut
} from 'lucide-react';

/* Bottom nav items per role (show max 5 for mobile) */
const mobileNavItems = {
  Admin: [
    { to: '/dashboard',  icon: LayoutDashboard, label: 'Home' },
    { to: '/students',   icon: GraduationCap,   label: 'Students' },
    { to: '/courses',    icon: BookOpen,         label: 'Courses' },
    { to: '/finance',    icon: DollarSign,       label: 'Finance' },
    { to: '/audit-logs', icon: ClipboardList,    label: 'Audit' },
  ],
  Student: [
    { to: '/dashboard',  icon: LayoutDashboard, label: 'Home' },
    { to: '/enrollments',icon: ClipboardList,   label: 'Courses' },
    { to: '/attendance', icon: CalendarCheck,   label: 'Attend.' },
    { to: '/results',    icon: BarChart2,       label: 'Results' },
    { to: '/finance',    icon: DollarSign,      label: 'Fees' },
  ],
  Faculty: [
    { to: '/dashboard',  icon: LayoutDashboard, label: 'Home' },
    { to: '/courses',    icon: BookOpen,         label: 'Courses' },
    { to: '/attendance', icon: CalendarCheck,    label: 'Attend.' },
    { to: '/results',    icon: BarChart2,        label: 'Grades' },
  ],
  Finance: [
    { to: '/dashboard',  icon: LayoutDashboard, label: 'Home' },
    { to: '/finance',    icon: DollarSign,      label: 'Payments' },
    { to: '/students',   icon: GraduationCap,   label: 'Students' },
  ],
};

const AppLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const bottomItems = mobileNavItems[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden font-inter" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f8fafc 45%, #eef2ff 100%)' }}>

      {/* ── Desktop Sidebar ─────────────────────────────── */}
      <Sidebar />

      {/* ── Mobile Full-Screen Menu Overlay ─────────────── */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 md:hidden animate-fade-in"
            style={{ background: 'rgba(15,23,42,0.40)', backdropFilter: 'blur(6px)' }}
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-in Menu Panel */}
          <div
            className="fixed inset-y-0 left-0 z-50 w-72 flex flex-col md:hidden animate-slide-in-left"
            style={{
              background: 'linear-gradient(180deg, #0f172a 0%, #1a2e6b 50%, #1e3a8a 100%)',
              borderRight: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '8px 0 40px rgba(0,0,0,0.30)',
            }}
          >
            {/* Menu Header */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.04)',
              }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    boxShadow: '0 4px 14px rgba(59,130,246,0.50)',
                  }}
                >
                  <GraduationCap className="text-white" size={18} />
                </div>
                <span className="font-outfit font-extrabold text-lg text-white tracking-tight">HiSUP</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl text-blue-300 hover:text-white transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.10)' }}
              >
                <X size={17} />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex-1 overflow-y-auto py-3 px-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400/70 px-2 mb-2">Main Menu</p>
              <ul className="flex flex-col gap-0.5">
                {(mobileNavItems[user?.role] || []).map(({ to, icon: Icon, label }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) => `
                        flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold
                        transition-all duration-200
                        ${isActive ? 'text-white' : 'text-blue-200/70 hover:text-white'}
                      `}
                      style={({ isActive }) => isActive ? {
                        background: 'rgba(59,130,246,0.25)',
                        border: '1px solid rgba(59,130,246,0.30)',
                      } : { border: '1px solid transparent' }}
                    >
                      {({ isActive }) => (
                        <>
                          <Icon size={19} className={isActive ? 'text-blue-300' : 'text-blue-400/60'} />
                          <span>{label}</span>
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* User + Logout */}
            <div
              className="p-4"
              style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div
                className="flex items-center gap-3 p-3 rounded-xl mb-2"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}>
                  {user?.username?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{user?.username}</p>
                  <p className="text-xs font-semibold text-blue-400">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-sm font-semibold text-blue-200/70 hover:text-red-400 transition-all duration-200"
                style={{ border: '1px solid rgba(239,68,68,0.20)', background: 'rgba(239,68,68,0.08)' }}
              >
                <LogOut size={17} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Main Content ────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Topbar onMenuClick={() => setMobileMenuOpen(true)} />
        <main
          className="flex-1 overflow-y-auto pb-20 md:pb-0"
          style={{ padding: 'clamp(1rem, 2vw, 2rem)' }}
        >
          <div className="mx-auto max-w-7xl w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* ── Mobile Glass Bottom Nav (iPhone-style) ──────── */}
      <nav
        className="mobile-bottom-nav"
        style={{ gap: '0' }}
      >
        {bottomItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-1.5 transition-all duration-200"
          >
            {({ isActive }) => (
              <>
                <div
                  className={`p-1.5 rounded-xl transition-all duration-200 ${isActive ? 'bg-blue-100' : ''}`}
                >
                  <Icon
                    size={20}
                    className={isActive ? 'text-blue-600' : 'text-slate-400'}
                  />
                </div>
                <span
                  className={`text-[10px] font-semibold leading-none ${isActive ? 'text-blue-600' : 'text-slate-400'}`}
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
