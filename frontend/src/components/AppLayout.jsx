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
  const bottomItems = items.slice(0, 5);

  const handleLogout = () => { logout(); navigate('/login'); setMobileMenuOpen(false); };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: 'Inter, system-ui, sans-serif', background: '#f7f7f7' }}>

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-50 md:hidden animate-fade-in"
            style={{ background: 'rgba(0,0,0,0.40)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
            onClick={() => setMobileMenuOpen(false)}
          />
          <div
            className="fixed inset-y-0 left-0 z-50 w-72 flex flex-col md:hidden animate-slide-up"
            style={{
              background: 'rgba(255,255,255,0.96)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderRight: '1px solid rgba(0,0,0,0.07)',
              boxShadow: '8px 0 40px rgba(0,0,0,0.12)',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '18px 20px', borderBottom: '1px solid rgba(0,0,0,0.06)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: 'linear-gradient(135deg, #7c3aed, #4c1d95)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 3px 12px rgba(124,58,237,0.28)',
                  }}
                >
                  <GraduationCap size={18} color="white" />
                </div>
                <div>
                  <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: '16px', color: '#0a0a0a', lineHeight: 1, letterSpacing: '-0.025em' }}>HiSUP</p>
                  <p style={{ fontSize: '9px', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.2em', marginTop: '2px' }}>PLATFORM</p>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  background: '#f5f5f5', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px',
                  cursor: 'pointer', padding: '6px', display: 'flex', color: '#525252',
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 12px' }}>
              <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#d4d4d4', padding: '0 8px', marginBottom: '8px' }}>
                Main Menu
              </p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '2px', listStyle: 'none' }}>
                {items.map(({ to, icon: Icon, label }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      onClick={() => setMobileMenuOpen(false)}
                      style={({ isActive }) => ({
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '10px 12px', borderRadius: '10px',
                        fontSize: '14px', fontWeight: isActive ? 600 : 500,
                        color: isActive ? '#7c3aed' : '#525252',
                        background: isActive ? 'rgba(124,58,237,0.07)' : 'transparent',
                        border: isActive ? '1px solid rgba(124,58,237,0.12)' : '1px solid transparent',
                        textDecoration: 'none', transition: 'all 150ms ease',
                      })}
                    >
                      {({ isActive }) => (
                        <>
                          <Icon size={17} style={{ color: isActive ? '#7c3aed' : '#a3a3a3', flexShrink: 0 }} />
                          <span>{label}</span>
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* User + Logout */}
            <div style={{ padding: '12px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
                  borderRadius: '10px', background: '#fafafa', border: '1px solid rgba(0,0,0,0.06)', marginBottom: '6px',
                }}
              >
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px', background: '#7c3aed',
                  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: 700, flexShrink: 0,
                }}>
                  {user?.username?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#0a0a0a' }}>{user?.username}</p>
                  <p style={{ fontSize: '10px', fontWeight: 700, color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{user?.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                  padding: '9px 12px', borderRadius: '10px', fontSize: '13.5px', fontWeight: 500,
                  color: '#dc2626', background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.10)',
                  cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                }}
              >
                <LogOut size={15} /> Logout
              </button>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', overflow: 'hidden' }}>
        <Topbar onMenuClick={() => setMobileMenuOpen(true)} />
        <main
          style={{
            flex: 1, overflowY: 'auto', paddingBottom: '80px',
            paddingTop: '24px', paddingInline: 'clamp(1.25rem, 2.5vw, 2.5rem)',
          }}
        >
          <div style={{ maxWidth: '1400px', margin: '0 auto' }} className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-50"
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(20px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
          borderTop: '1px solid rgba(0,0,0,0.07)',
          display: 'flex', justifyContent: 'space-around',
          padding: '8px 8px calc(12px + env(safe-area-inset-bottom, 8px))',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
        }}
      >
        {bottomItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '6px 12px', textDecoration: 'none', flex: 1 }}
          >
            {({ isActive }) => (
              <>
                <div style={{
                  padding: '6px', borderRadius: '10px',
                  background: isActive ? 'rgba(124,58,237,0.10)' : 'transparent',
                  transition: 'all 200ms ease',
                }}>
                  <Icon size={20} style={{ color: isActive ? '#7c3aed' : '#a3a3a3' }} />
                </div>
                <span style={{
                  fontSize: '10px', fontWeight: 600, lineHeight: 1,
                  color: isActive ? '#7c3aed' : '#a3a3a3',
                  letterSpacing: '-0.01em',
                }}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AppLayout;
