import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, CalendarCheck,
  BarChart2, DollarSign, Library, Home, Settings, LogOut,
  ChevronLeft, ChevronRight, ClipboardList
} from 'lucide-react';

const navItems = {
  Admin: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/students', icon: GraduationCap, label: 'Students' },
    { to: '/faculty', icon: Users, label: 'Faculty' },
    { to: '/courses', icon: BookOpen, label: 'Courses' },
    { to: '/enrollments', icon: ClipboardList, label: 'Enrollments' },
    { to: '/attendance', icon: CalendarCheck, label: 'Attendance' },
    { to: '/results', icon: BarChart2, label: 'Results' },
    { to: '/finance', icon: DollarSign, label: 'Finance' },
    { to: '/library', icon: Library, label: 'Library' },
    { to: '/hostel', icon: Home, label: 'Hostel' },
    { to: '/audit-logs', icon: ClipboardList, label: 'Audit Logs' },
  ],
  Student: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/enrollments', icon: ClipboardList, label: 'My Courses' },
    { to: '/attendance', icon: CalendarCheck, label: 'Attendance' },
    { to: '/results', icon: BarChart2, label: 'Results' },
    { to: '/finance', icon: DollarSign, label: 'Fees' },
    { to: '/library', icon: Library, label: 'Library' },
    { to: '/hostel', icon: Home, label: 'Hostel' },
  ],
  Faculty: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/courses', icon: BookOpen, label: 'My Courses' },
    { to: '/attendance', icon: CalendarCheck, label: 'Attendance' },
    { to: '/results', icon: BarChart2, label: 'Grades' },
  ],
  Finance: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/finance', icon: DollarSign, label: 'Payments' },
    { to: '/students', icon: GraduationCap, label: 'Students' },
  ],
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
      className={`flex flex-col bg-slate-900 text-white transition-all duration-300 ease-in-out border-r border-slate-800 ${
        collapsed ? 'w-20' : 'w-72'
      } h-screen sticky top-0 z-40 hidden md:flex relative overflow-visible`}
    >
      {/* Background Image with low opacity */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img src="/images/hero.png" alt="" className="w-full h-full object-cover opacity-5" />
      </div>
      
      <div className="relative z-10 flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-5 py-6 border-b border-slate-800/80 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/20">
          <GraduationCap className="text-white" size={20} />
        </div>
        {!collapsed && (
          <span className="font-bold text-xl text-white tracking-tight font-outfit">HiSUP 2.0</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 overflow-y-auto custom-scrollbar">
        {!collapsed && (
          <div className="px-5 mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Main Menu</p>
          </div>
        )}
        <ul className="flex flex-col h-full justify-evenly">
          {items.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-4 text-sm font-semibold transition-all duration-200 group relative ${
                    collapsed ? 'justify-center px-0 py-4' : 'px-6 py-4'
                  } ${
                    isActive
                      ? 'text-white bg-indigo-600/15'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`
                }
                title={collapsed ? label : undefined}
              >
                {({ isActive }) => (
                  <>
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-r-md shadow-[0_0_10px_rgba(99,102,241,0.5)]" />}
                    <Icon size={26} className={`shrink-0 transition-transform duration-200 ${isActive ? 'text-indigo-400 scale-110' : 'group-hover:scale-110'}`} />
                    {!collapsed && <span className="tracking-wide">{label}</span>}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User info + Logout */}
      <div className="border-t border-slate-800/80 p-4 bg-slate-900/50">
        {!collapsed && (
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
              <span className="text-white font-bold">{user?.username?.[0]?.toUpperCase()}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white truncate">{user?.username}</p>
              <p className="text-xs font-medium text-indigo-400 truncate">{user?.role}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-semibold text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors duration-200 ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut size={22} className="shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3.5 top-8 bg-slate-800 border border-slate-700 hover:bg-indigo-600 hover:border-indigo-600 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-lg transition-all duration-200 z-50"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  );
};

export default Sidebar;
