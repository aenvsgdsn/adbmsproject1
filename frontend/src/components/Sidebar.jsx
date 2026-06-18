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
    { to: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/students',   icon: GraduationCap,   label: 'Students' },
    { to: '/faculty',    icon: Users,            label: 'Faculty' },
    { to: '/courses',    icon: BookOpen,         label: 'Courses' },
    { to: '/enrollments',icon: ClipboardList,    label: 'Enrollments' },
    { to: '/attendance', icon: CalendarCheck,    label: 'Attendance' },
    { to: '/results',    icon: BarChart2,        label: 'Results' },
    { to: '/finance',    icon: DollarSign,       label: 'Finance' },
    { to: '/library',    icon: Library,          label: 'Library' },
    { to: '/hostel',     icon: Home,             label: 'Hostel' },
    { to: '/audit-logs', icon: ClipboardList,    label: 'Audit Logs' },
  ],
  Student: [
    { to: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/enrollments',icon: ClipboardList,   label: 'My Courses' },
    { to: '/attendance', icon: CalendarCheck,   label: 'Attendance' },
    { to: '/results',    icon: BarChart2,       label: 'Results' },
    { to: '/finance',    icon: DollarSign,      label: 'Fees' },
    { to: '/library',    icon: Library,         label: 'Library' },
    { to: '/hostel',     icon: Home,            label: 'Hostel' },
  ],
  Faculty: [
    { to: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/courses',    icon: BookOpen,         label: 'My Courses' },
    { to: '/attendance', icon: CalendarCheck,    label: 'Attendance' },
    { to: '/results',    icon: BarChart2,        label: 'Grades' },
  ],
  Finance: [
    { to: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/finance',    icon: DollarSign,      label: 'Payments' },
    { to: '/students',   icon: GraduationCap,   label: 'Students' },
  ],
};

const roleAvatarStyle = {
  Admin:   'bg-rose-500',
  Faculty: 'bg-indigo-400',
  Student: 'bg-blue-400',
  Finance: 'bg-emerald-400',
};

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const items = navItems[user?.role] || [];

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
        background: 'linear-gradient(180deg, #0f172a 0%, #1a2e6b 50%, #1e3a8a 100%)',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '4px 0 32px rgba(0,0,0,0.25)',
      }}
    >
      {/* Subtle top shine */}
      <div
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 100%)',
        }}
      />

      <div className="relative flex flex-col h-full z-10">
        {/* Logo */}
        <div
          className={`flex items-center gap-3 px-4 py-5 ${collapsed ? 'justify-center' : ''}`}
          style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              boxShadow: '0 4px 14px rgba(59,130,246,0.50)',
            }}
          >
            <GraduationCap className="text-white" size={18} />
          </div>
          {!collapsed && (
            <div>
              <span
                className="font-outfit font-extrabold text-lg tracking-tight text-white"
              >
                HiSUP
              </span>
              <span className="text-[10px] block font-bold tracking-widest uppercase text-blue-400" style={{ marginTop: '-3px' }}>
                2.0
              </span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
          {!collapsed && (
            <div className="px-4 mb-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400/70">
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
                      ? 'text-white'
                      : 'text-blue-200/70 hover:text-white'
                    }
                  `}
                  style={({ isActive }) => isActive ? {
                    background: 'rgba(59,130,246,0.25)',
                    border: '1px solid rgba(59,130,246,0.30)',
                    boxShadow: '0 2px 8px rgba(59,130,246,0.20)',
                  } : {
                    background: 'transparent',
                    border: '1px solid transparent',
                  }}
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={19}
                        className={`shrink-0 transition-all duration-200 ${
                          isActive
                            ? 'text-blue-300'
                            : 'text-blue-400/60 group-hover:text-blue-300'
                        }`}
                      />
                      {!collapsed && (
                        <span className="tracking-wide">{label}</span>
                      )}
                      {isActive && !collapsed && (
                        <div
                          className="absolute right-3 w-1.5 h-1.5 rounded-full bg-blue-400"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info + Logout */}
        <div
          className="p-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          {!collapsed && (
            <div
              className="flex items-center gap-3 mb-2 p-2.5 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-sm ${roleAvatarStyle[user?.role] || 'bg-blue-500'}`}
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}
              >
                {user?.username?.[0]?.toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-white truncate leading-tight">{user?.username}</p>
                <p className="text-[11px] font-semibold text-blue-400 truncate leading-tight">{user?.role}</p>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            title={collapsed ? 'Logout' : undefined}
            className={`flex items-center gap-3 w-full rounded-xl text-sm font-semibold
              text-blue-200/70 hover:text-red-400 transition-all duration-200
              ${collapsed ? 'justify-center p-3.5' : 'px-3 py-2.5'}
            `}
            style={{
              border: '1px solid transparent',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.12)';
              e.currentTarget.style.borderColor = 'rgba(239,68,68,0.20)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            <LogOut size={18} className="shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3.5 top-[72px] z-50 w-7 h-7 rounded-full
          flex items-center justify-center text-blue-300 transition-all duration-200
          hover:scale-110 hover:shadow-lg"
        style={{
          background: '#1e3a8a',
          border: '1.5px solid rgba(59,130,246,0.40)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.30)',
        }}
      >
        {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
      </button>
    </aside>
  );
};

export default Sidebar;
