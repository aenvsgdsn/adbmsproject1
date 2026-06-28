import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, CalendarCheck,
  BarChart2, DollarSign, Library, Home, LogOut,
  ChevronLeft, ChevronRight, ClipboardList, ShieldAlert, Circle
} from 'lucide-react';

export const navItems = {
  Admin: [
    { to: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard'   },
    { to: '/students',    icon: GraduationCap,   label: 'Students'    },
    { to: '/faculty',     icon: Users,           label: 'Faculty'     },
    { to: '/courses',     icon: BookOpen,        label: 'Courses'     },
    { to: '/enrollments', icon: ClipboardList,   label: 'Enrollments' },
    { to: '/attendance',  icon: CalendarCheck,   label: 'Attendance'  },
    { to: '/results',     icon: BarChart2,       label: 'Results'     },
    { to: '/finance',     icon: DollarSign,      label: 'Finance'     },
    { to: '/library',     icon: Library,         label: 'Library'     },
    { to: '/hostel',      icon: Home,            label: 'Hostel'      },
    { to: '/audit-logs',  icon: ShieldAlert,     label: 'Audit Logs'  },
  ],
  Student: [
    { to: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard'   },
    { to: '/enrollments', icon: ClipboardList,   label: 'My Courses'  },
    { to: '/attendance',  icon: CalendarCheck,   label: 'Attendance'  },
    { to: '/results',     icon: BarChart2,       label: 'Results'     },
    { to: '/finance',     icon: DollarSign,      label: 'Fees'        },
    { to: '/library',     icon: Library,         label: 'Library'     },
    { to: '/hostel',      icon: Home,            label: 'Hostel'      },
  ],
  Faculty: [
    { to: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard'   },
    { to: '/courses',     icon: BookOpen,        label: 'My Courses'  },
    { to: '/attendance',  icon: CalendarCheck,   label: 'Attendance'  },
    { to: '/results',     icon: BarChart2,       label: 'Grades'      },
  ],
  Finance: [
    { to: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard'   },
    { to: '/finance',     icon: DollarSign,      label: 'Payments'    },
    { to: '/students',    icon: GraduationCap,   label: 'Students'    },
  ],
};

const roleBadge = {
  Admin:   { color: '#7c3aed', bg: 'rgba(124,58,237,0.08)', dot: '#7c3aed'  },
  Faculty: { color: '#2563eb', bg: 'rgba(37,99,235,0.08)',  dot: '#2563eb'  },
  Student: { color: '#059669', bg: 'rgba(5,150,105,0.08)',  dot: '#059669'  },
  Finance: { color: '#d97706', bg: 'rgba(217,119,6,0.08)',  dot: '#d97706'  },
};

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const items = navItems[user?.role] || [];
  const rb = roleBadge[user?.role] || roleBadge.Student;

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside
      className="hidden md:flex flex-col h-screen sticky top-0 z-40 overflow-visible transition-all duration-300"
      style={{
        width: collapsed ? '68px' : '220px',
        background: 'white',
        borderRight: '1px solid rgba(0,0,0,0.07)',
        boxShadow: '1px 0 12px rgba(0,0,0,0.03)',
        flexShrink: 0,
      }}
    >
      <div className="relative flex flex-col h-full overflow-hidden">

        {/* ── Logo ── */}
        <div
          className="flex items-center gap-3 py-[18px] px-4"
          style={{
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            justifyContent: collapsed ? 'center' : 'flex-start',
          }}
        >
          <div
            className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #4c1d95)',
              boxShadow: '0 2px 10px rgba(124,58,237,0.28)',
            }}
          >
            <GraduationCap size={16} color="white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p
                className="font-extrabold text-base leading-none tracking-tight"
                style={{ color: '#0a0a0a', fontFamily: 'Plus Jakarta Sans, sans-serif', whiteSpace: 'nowrap' }}
              >HiSUP</p>
              <p
                className="text-[9px] font-bold uppercase tracking-widest mt-0.5"
                style={{ color: '#7c3aed', whiteSpace: 'nowrap' }}
              >PLATFORM</p>
            </div>
          )}
        </div>

        {/* ── Nav Items ── */}
        <nav className="flex-1 py-3 overflow-y-auto hide-scrollbar px-2.5">
          {!collapsed && (
            <p
              className="text-[10px] font-bold uppercase tracking-widest px-2 mb-2 mt-1"
              style={{ color: '#d4d4d4' }}
            >Main Menu</p>
          )}

          <ul className="flex flex-col gap-0.5">
            {items.map(({ to, icon: Icon, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  title={collapsed ? label : undefined}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: collapsed ? '9px 0' : '8px 10px',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    borderRadius: '10px',
                    fontSize: '13.5px',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? '#7c3aed' : '#525252',
                    background: isActive ? 'rgba(124,58,237,0.07)' : 'transparent',
                    border: isActive ? '1px solid rgba(124,58,237,0.12)' : '1px solid transparent',
                    textDecoration: 'none',
                    transition: 'all 150ms ease',
                    cursor: 'pointer',
                    position: 'relative',
                  })}
                  className="group"
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={16}
                        style={{
                          color: isActive ? '#7c3aed' : '#a3a3a3',
                          flexShrink: 0,
                          transition: 'color 150ms ease',
                        }}
                      />
                      {!collapsed && (
                        <span style={{ whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>{label}</span>
                      )}
                      {isActive && !collapsed && (
                        <div
                          className="absolute right-2.5 w-1.5 h-1.5 rounded-full"
                          style={{ background: '#7c3aed' }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── User + Logout ── */}
        <div className="px-2.5 pb-3 pt-2" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          {!collapsed && user && (
            <div
              className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl mb-1.5"
              style={{ background: rb.bg }}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold"
                style={{ background: rb.color, color: 'white', fontSize: '12px' }}
              >
                {user.username?.[0]?.toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className="font-semibold truncate leading-tight"
                  style={{ fontSize: '12.5px', color: '#0a0a0a' }}
                >{user.username}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: rb.dot }} />
                  <p
                    className="uppercase font-bold tracking-wider"
                    style={{ fontSize: '9.5px', color: '#a3a3a3' }}
                  >{user.role}</p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            title={collapsed ? 'Logout' : undefined}
            className="flex items-center w-full rounded-xl transition-all duration-150"
            style={{
              gap: '10px',
              padding: collapsed ? '9px 0' : '8px 10px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              color: '#a3a3a3',
              background: 'transparent',
              border: '1px solid transparent',
              fontSize: '13.5px',
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(220,38,38,0.06)';
              e.currentTarget.style.color = '#dc2626';
              e.currentTarget.style.borderColor = 'rgba(220,38,38,0.12)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#a3a3a3';
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            <LogOut size={15} style={{ flexShrink: 0 }} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* ── Collapse Toggle ── */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[60px] z-50 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
        style={{
          background: 'white',
          border: '1px solid rgba(0,0,0,0.10)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          color: '#525252',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = '#7c3aed';
          e.currentTarget.style.color = 'white';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'white';
          e.currentTarget.style.color = '#525252';
        }}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
};

export default Sidebar;
