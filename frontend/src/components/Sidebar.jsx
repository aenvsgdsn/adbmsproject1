import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, CalendarCheck,
  BarChart2, DollarSign, Library, Home, LogOut,
  ChevronLeft, ChevronRight, ClipboardList
} from 'lucide-react';

const navItems = {
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
  Admin:   { color: 'bg-rose-100 text-rose-600',    dot: 'bg-rose-500' },
  Faculty: { color: 'bg-indigo-100 text-indigo-600', dot: 'bg-indigo-500' },
  Student: { color: 'bg-violet-100 text-violet-600', dot: 'bg-violet-500' },
  Finance: { color: 'bg-emerald-100 text-emerald-600', dot: 'bg-emerald-500' },
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
        transition-all duration-300 ease-in-out
        hidden md:flex
        ${collapsed ? 'w-[72px]' : 'w-64'}
      `}
      style={{
        background: '#ffffff',
        borderRight: '1px solid #e4e4e7',
      }}
    >
      <div className="relative flex flex-col h-full">

        {/* Logo */}
        <div
          className={`flex items-center gap-3 px-4 py-5 ${collapsed ? 'justify-center' : ''}`}
          style={{ borderBottom: '1px solid #f4f4f5' }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-md shadow-violet-400/20"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
          >
            <GraduationCap className="text-white" size={18} />
          </div>
          {!collapsed && (
            <div>
              <span className="font-extrabold text-lg text-zinc-900 tracking-tight leading-tight">
                HiSUP
              </span>
              <span className="text-[10px] block font-bold tracking-widest uppercase text-violet-500" style={{ marginTop: '-2px' }}>
                2.0
              </span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
          {!collapsed && (
            <div className="px-4 mb-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Main Menu
              </p>
            </div>
          )}

          <ul className="flex flex-col gap-0.5 px-2">
            {items.map(({ to, icon: Icon, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  title={collapsed ? label : undefined}
                  className={({ isActive }) => `
                    flex items-center gap-3 rounded-xl text-sm font-semibold
                    transition-all duration-200 group relative
                    ${collapsed ? 'justify-center px-0 py-3.5' : 'px-3 py-2.5'}
                    ${isActive
                      ? 'text-violet-700'
                      : 'text-zinc-500 hover:text-zinc-900'
                    }
                  `}
                  style={({ isActive }) => isActive ? {
                    background: '#f5f3ff',
                    border: '1px solid #ede9fe',
                  } : {
                    background: 'transparent',
                    border: '1px solid transparent',
                  }}
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={18}
                        className={`shrink-0 transition-all duration-200 ${
                          isActive
                            ? 'text-violet-600'
                            : 'text-zinc-400 group-hover:text-zinc-700'
                        }`}
                      />
                      {!collapsed && (
                        <span className="tracking-wide">{label}</span>
                      )}
                      {isActive && !collapsed && (
                        <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-violet-500" />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info + Logout */}
        <div className="p-3" style={{ borderTop: '1px solid #f4f4f5' }}>
          {!collapsed && (
            <div
              className="flex items-center gap-3 mb-2 p-2.5 rounded-xl"
              style={{ background: '#f4f4f5', border: '1px solid #e4e4e7' }}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${rc.color}`}
                style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}
              >
                {user?.username?.[0]?.toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-zinc-900 truncate leading-tight">{user?.username}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${rc.dot}`} />
                  <p className="text-[11px] font-semibold text-zinc-500 truncate leading-tight">{user?.role}</p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            title={collapsed ? 'Logout' : undefined}
            className={`flex items-center gap-3 w-full rounded-xl text-sm font-semibold
              text-zinc-400 hover:text-red-500 transition-all duration-200
              ${collapsed ? 'justify-center p-3.5' : 'px-3 py-2.5'}
            `}
            style={{ border: '1px solid transparent' }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.06)';
              e.currentTarget.style.borderColor = 'rgba(239,68,68,0.15)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            <LogOut size={17} className="shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3.5 top-[72px] z-50 w-7 h-7 rounded-full
          flex items-center justify-center text-zinc-500 hover:text-violet-600 transition-all duration-200
          hover:scale-110"
        style={{
          background: '#ffffff',
          border: '1.5px solid #e4e4e7',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}
      >
        {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
      </button>
    </aside>
  );
};

export default Sidebar;
