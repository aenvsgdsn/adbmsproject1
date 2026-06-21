import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, CalendarCheck,
  BarChart2, DollarSign, Library, Home, LogOut,
  ChevronLeft, ChevronRight, ClipboardList
} from 'lucide-react';

export const navItems = {
  Admin: [
    { to: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/students',    icon: GraduationCap,   label: 'Students' },
    { to: '/faculty',     icon: Users,            label: 'Faculty' },
    { to: '/courses',     icon: BookOpen,         label: 'Courses' },
    { to: '/enrollments', icon: ClipboardList,    label: 'Enrollments' },
    { to: '/attendance',  icon: CalendarCheck,    label: 'Attendance' },
    { to: '/results',     icon: BarChart2,        label: 'Results' },
    { to: '/finance',     icon: DollarSign,       label: 'Finance' },
    { to: '/library',     icon: Library,          label: 'Library' },
    { to: '/hostel',      icon: Home,             label: 'Hostel' },
    { to: '/audit-logs',  icon: ClipboardList,    label: 'Audit Logs' },
  ],
  Student: [
    { to: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/enrollments', icon: ClipboardList,   label: 'My Courses' },
    { to: '/attendance',  icon: CalendarCheck,   label: 'Attendance' },
    { to: '/results',     icon: BarChart2,       label: 'Results' },
    { to: '/finance',     icon: DollarSign,      label: 'Fees' },
    { to: '/library',     icon: Library,         label: 'Library' },
    { to: '/hostel',      icon: Home,            label: 'Hostel' },
  ],
  Faculty: [
    { to: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/courses',     icon: BookOpen,         label: 'My Courses' },
    { to: '/attendance',  icon: CalendarCheck,    label: 'Attendance' },
    { to: '/results',     icon: BarChart2,        label: 'Grades' },
  ],
  Finance: [
    { to: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/finance',     icon: DollarSign,      label: 'Payments' },
    { to: '/students',    icon: GraduationCap,   label: 'Students' },
  ],
};

const roleConfig = {
  Admin:   { color: 'bg-indigo-100 text-indigo-700',    dot: 'bg-indigo-500' },
  Faculty: { color: 'bg-blue-100 text-blue-700',        dot: 'bg-blue-500' },
  Student: { color: 'bg-violet-100 text-violet-700',    dot: 'bg-violet-500' },
  Finance: { color: 'bg-emerald-100 text-emerald-700',  dot: 'bg-emerald-500' },
};

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const items = navItems[user?.role] || [];
  const rc = roleConfig[user?.role] || roleConfig.Student;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={`
        flex-col h-screen sticky top-0 z-40 overflow-visible
        transition-all duration-300 ease-in-out glass
        hidden md:flex
        ${collapsed ? 'w-[88px]' : 'w-72'}
      `}
      style={{
        borderRight: '1px solid var(--glass-border)',
        boxShadow: '4px 0 24px rgba(15,23,42,0.03)',
      }}
    >
      <div className="relative flex flex-col h-full">

        {/* Logo */}
        <div
          className={`flex items-center gap-4 px-6 py-7 ${collapsed ? 'justify-center px-0' : ''}`}
          style={{ borderBottom: '1px solid rgba(226,232,240,0.6)' }}
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-violet"
            style={{ background: 'linear-gradient(135deg, var(--violet-500), var(--violet-700))' }}
          >
            <GraduationCap className="text-white" size={24} />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <span className="font-extrabold text-2xl text-zinc-900 tracking-tight leading-none block mb-1">
                HiSUP
              </span>
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-violet-600 block">
                Platform
              </span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
          {!collapsed && (
            <div className="px-6 mb-4">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                Main Menu
              </p>
            </div>
          )}

          <ul className="flex flex-col gap-1.5 px-4">
            {items.map(({ to, icon: Icon, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  title={collapsed ? label : undefined}
                  className={({ isActive }) => `
                    flex items-center gap-4 rounded-xl text-[15px] font-bold
                    transition-all duration-200 group relative
                    ${collapsed ? 'justify-center px-0 py-4' : 'px-4 py-3.5'}
                    ${isActive
                      ? 'text-violet-700 bg-white/60 shadow-sm border border-white'
                      : 'text-zinc-500 hover:text-zinc-900 hover:bg-white/40 border border-transparent'
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={20}
                        className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                          isActive
                            ? 'text-violet-600'
                            : 'text-zinc-400 group-hover:text-zinc-600'
                        }`}
                      />
                      {!collapsed && (
                        <span className="tracking-wide">{label}</span>
                      )}
                      {isActive && !collapsed && (
                        <div className="absolute right-4 w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info + Logout */}
        <div className="p-4" style={{ borderTop: '1px solid rgba(226,232,240,0.6)' }}>
          {!collapsed && (
            <div
              className="flex items-center gap-3 mb-3 p-3 rounded-2xl glass"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-[15px] font-bold ${rc.color}`}
                style={{ boxShadow: '0 4px 12px rgba(15,23,42,0.06)' }}
              >
                {user?.username?.[0]?.toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-extrabold text-zinc-900 truncate leading-tight">{user?.username}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`w-2 h-2 rounded-full ${rc.dot}`} />
                  <p className="text-xs font-bold text-zinc-500 truncate uppercase tracking-wide">{user?.role}</p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            title={collapsed ? 'Logout' : undefined}
            className={`flex items-center gap-3 w-full rounded-xl text-[15px] font-bold
              text-zinc-500 hover:text-red-600 transition-all duration-200
              ${collapsed ? 'justify-center py-4' : 'px-4 py-3.5'}
            `}
            style={{ border: '1px solid transparent' }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.08)';
              e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            <LogOut size={20} className="shrink-0 transition-transform group-hover:-translate-x-1" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-4 top-10 z-50 w-8 h-8 rounded-full
          flex items-center justify-center text-zinc-500 hover:text-violet-600 transition-all duration-200
          hover:scale-110 glass border border-zinc-200"
        style={{
          boxShadow: '0 4px 12px rgba(15,23,42,0.08)',
        }}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  );
};

export default Sidebar;
