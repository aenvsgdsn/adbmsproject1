import { Link } from 'react-router-dom';
import {
  GraduationCap, ArrowRight, BarChart2, BookOpen, Users,
  DollarSign, Library, Home, ShieldCheck, Check,
  ChevronRight, Star, Zap, Globe, Lock
} from 'lucide-react';

/* ─── Nav ─────────────────────────────────────────── */
const NAV_LINKS = ['Features', 'Modules', 'Workflow', 'Pricing', 'Support'];

const STATS = [
  { value: '5,000+', label: 'Students Enrolled' },
  { value: '300+',   label: 'Faculty Members'   },
  { value: '150+',   label: 'Courses Offered'   },
  { value: '99.9%',  label: 'Uptime SLA'         },
];

const FEATURES = [
  { icon: GraduationCap, title: 'Student Management',  desc: 'Complete student lifecycle — admissions, profiles, academic records, and performance tracking in one place.',  color: '#7c3aed' },
  { icon: Users,         title: 'Faculty Management',  desc: 'Manage faculty assignments, departmental roles, and workload distribution effortlessly.',                     color: '#2563eb' },
  { icon: BarChart2,     title: 'Results & Analytics', desc: 'Real-time grade management, CGPA calculation, and semester-wise performance reports.',                       color: '#059669' },
  { icon: DollarSign,    title: 'Finance & Fees',      desc: 'Automated fee collection, payment tracking, and detailed financial reporting for every stakeholder.',         color: '#d97706' },
  { icon: Library,       title: 'Library System',      desc: 'Book catalog management, issue/return tracking, and digital resource access all unified.',                  color: '#dc2626' },
  { icon: Home,          title: 'Hostel Management',   desc: 'Room allocations, occupancy tracking, and resident services managed from a single interface.',               color: '#6b2bd4' },
];

const WHY = [
  { icon: Zap,       title: 'Blazing Fast',     desc: 'Optimized queries and real-time updates ensure a seamless experience for thousands of users simultaneously.' },
  { icon: Globe,     title: 'Intelligent',      desc: 'AI-assisted analytics surface insights automatically, letting you focus on decisions, not data.' },
  { icon: Lock,      title: 'Secure',           desc: 'Enterprise-grade security with role-based access, complete audit logging, and encrypted data at rest.' },
];

const WORKFLOW = [
  { step: '01', title: 'Student Registration',    desc: 'Students register and admins verify profiles — done in minutes.' },
  { step: '02', title: 'Course Enrollment',       desc: 'Enroll into approved courses once finance clearance is confirmed.' },
  { step: '03', title: 'Attendance Tracking',     desc: 'Faculty mark attendance digitally; students view records in real time.' },
  { step: '04', title: 'Grades & Results',        desc: 'Results published automatically after faculty submissions.' },
  { step: '05', title: 'Financial Settlement',    desc: 'Fees tracked, invoiced, and cleared with full audit trail.' },
  { step: '06', title: 'Statistics & Reports',    desc: 'Comprehensive dashboards for every role in the institution.' },
];

const TESTIMONIALS = [
  { name: 'Prof. Amina Khan',    role: 'Dean, CS Dept',       text: 'HiSUP transformed how we track student progress. The analytics panel is indispensable.' },
  { name: 'Ali Rehman',          role: 'Student',             text: 'Checking my results and library status in one place is incredibly convenient.' },
  { name: 'Fatima Riaz',         role: 'Finance Officer',     text: 'Payment reconciliation used to take days. Now it takes minutes with real-time tracking.' },
];

/* ─── Pill Badge ────────────────────────────────── */
const Pill = ({ text }) => (
  <div
    style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      padding: '5px 14px', borderRadius: '99px', marginBottom: '16px',
      background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.15)',
    }}
  >
    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#7c3aed' }} />
    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
      {text}
    </span>
  </div>
);

/* ─── Landing Page ─────────────────────────────── */
const LandingPage = () => (
  <div style={{ fontFamily: 'Inter, system-ui, sans-serif', background: '#ffffff', color: '#0a0a0a', overflowX: 'hidden' }}>

    {/* ══ NAVBAR ══════════════════════════════════════════ */}
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(255,255,255,0.88)',
      backdropFilter: 'blur(20px) saturate(1.8)',
      WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
      borderBottom: '1px solid rgba(0,0,0,0.07)',
      boxShadow: '0 1px 12px rgba(0,0,0,0.04)',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #7c3aed, #4c1d95)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 3px 12px rgba(124,58,237,0.30)',
          }}>
            <GraduationCap size={18} color="white" />
          </div>
          <div>
            <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: '16px', color: '#0a0a0a', letterSpacing: '-0.025em' }}>HiSUP</span>
            <span style={{ fontSize: '9px', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.15em', marginLeft: '5px', opacity: 0.8 }}>PLATFORM</span>
          </div>
        </div>

        {/* Nav links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }} className="hidden md:flex">
          {NAV_LINKS.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`}
              style={{ fontSize: '13.5px', fontWeight: 500, color: '#525252', textDecoration: 'none', transition: 'color 150ms ease' }}
              onMouseEnter={e => e.currentTarget.style.color = '#0a0a0a'}
              onMouseLeave={e => e.currentTarget.style.color = '#525252'}
            >{l}</a>
          ))}
        </nav>

        <Link to="/login" style={{ textDecoration: 'none' }}>
          <button
            className="btn btn-primary btn-liquid"
            style={{ padding: '8px 18px', fontSize: '13.5px', borderRadius: '10px' }}
          >
            Sign In <ArrowRight size={14} />
          </button>
        </Link>
      </div>
    </header>

    {/* ══ HERO ═══════════════════════════════════════════ */}
    <section style={{
      position: 'relative',
      padding: '120px 24px 100px',
      textAlign: 'center',
      overflow: 'hidden',
    }}>
      {/* ── Background Image ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: 'url("https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
        backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
      }} />

      {/* ── Glass/Gradient Overlay to keep the clean UI look ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'linear-gradient(160deg, rgba(250,249,255,0.92) 0%, rgba(243,239,255,0.85) 40%, rgba(255,255,255,0.95) 100%)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }} />

      {/* Background grid over the glass */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(124,58,237,0.08) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />

      <div style={{ maxWidth: '820px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <Pill text="Next-Generation University ERP" />

        <h1 style={{
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontSize: 'clamp(42px, 6vw, 76px)',
          fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.05,
          color: '#0a0a0a', marginBottom: '22px',
        }}>
          The Future of<br />
          <span style={{
            background: 'linear-gradient(130deg, #7c3aed 0%, #4c1d95 50%, #9d5eff 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>University Management</span><br />
          Starts Here.
        </h1>

        <p style={{ fontSize: '17.5px', color: '#525252', lineHeight: 1.7, marginBottom: '40px', maxWidth: '560px', margin: '0 auto 40px', fontWeight: 500 }}>
          A unified, intelligent platform to seamlessly manage academics, finance, library, hostel, and more — built for modern institutions.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <button className="btn btn-primary btn-liquid btn-lg" style={{ borderRadius: '12px', padding: '14px 28px', boxShadow: '0 8px 24px rgba(124,58,237,0.25)' }}>
              Access Platform <ArrowRight size={16} />
            </button>
          </Link>
          <button className="btn btn-secondary btn-lg" style={{ borderRadius: '12px', padding: '14px 28px', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)' }}>
            Watch Demo <ChevronRight size={16} />
          </button>
        </div>

        {/* Trust badges */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '28px', marginTop: '56px', flexWrap: 'wrap' }}>
          {['ISO 27001 Certified', '99.9% Uptime', 'GDPR Compliant'].map(b => (
            <div key={b} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Check size={14} style={{ color: '#7c3aed' }} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#525252' }}>{b}</span>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ══ STATS BAR ══════════════════════════════════════ */}
    <section style={{ background: '#f9f9f9', borderTop: '1px solid rgba(0,0,0,0.06)', borderBottom: '1px solid rgba(0,0,0,0.06)', padding: '36px 24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '24px', textAlign: 'center' }}>
        {STATS.map(({ value, label }) => (
          <div key={label}>
            <p style={{ fontSize: '32px', fontWeight: 800, color: '#0a0a0a', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.04em', lineHeight: 1 }}>{value}</p>
            <p style={{ fontSize: '13px', color: '#a3a3a3', marginTop: '4px', fontWeight: 500 }}>{label}</p>
          </div>
        ))}
      </div>
    </section>

    {/* ══ FEATURES ════════════════════════════════════════ */}
    <section id="features" style={{ padding: '100px 24px', background: '#ffffff' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <Pill text="Everything You Need" />
          <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.1, color: '#0a0a0a', marginBottom: '14px' }}>
            Everything Your University Needs
          </h2>
          <p style={{ fontSize: '16px', color: '#737373', maxWidth: '500px', margin: '0 auto', lineHeight: 1.65 }}>
            Six powerful modules unified into a single, beautiful platform.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {FEATURES.map(({ icon: Icon, title, desc, color }) => (
            <div
              key={title}
              className="card-hover"
              style={{
                padding: '28px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.07)',
                background: 'white', boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                transition: 'all 200ms ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}25`; e.currentTarget.style.boxShadow = `0 8px 30px ${color}12`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.07)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'; }}
            >
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Icon size={20} style={{ color }} />
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0a0a0a', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.02em', marginBottom: '8px' }}>{title}</h3>
              <p style={{ fontSize: '13.5px', color: '#737373', lineHeight: 1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ══ WHY HISUP ════════════════════════════════════════ */}
    <section id="modules" style={{ padding: '80px 24px', background: 'linear-gradient(160deg, #faf9ff 0%, #f3efff 50%, #faf9ff 100%)' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        <Pill text="Built for the Modern University" />
        <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, letterSpacing: '-0.035em', color: '#0a0a0a', marginBottom: '14px' }}>
          Built for the Modern University
        </h2>
        <p style={{ fontSize: '15px', color: '#737373', maxWidth: '450px', margin: '0 auto 56px', lineHeight: 1.65 }}>
          Engineered for performance, intelligence, and security at institutional scale.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', textAlign: 'left' }}>
          {WHY.map(({ icon: Icon, title, desc }) => (
            <div key={title} style={{
              padding: '28px', borderRadius: '16px',
              background: 'rgba(255,255,255,0.90)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.85)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.90)',
            }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(124,58,237,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <Icon size={18} style={{ color: '#7c3aed' }} />
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0a0a0a', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '8px', letterSpacing: '-0.02em' }}>{title}</h3>
              <p style={{ fontSize: '13.5px', color: '#737373', lineHeight: 1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ══ WORKFLOW ═══════════════════════════════════════ */}
    <section id="workflow" style={{ padding: '100px 24px', background: '#ffffff' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <Pill text="The Complete Workflow" />
          <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, letterSpacing: '-0.035em', color: '#0a0a0a' }}>
            The Complete University Workflow
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {WORKFLOW.map(({ step, title, desc }) => (
            <div key={step} style={{
              padding: '24px', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.07)',
              background: 'white', position: 'relative',
            }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#7c3aed', letterSpacing: '0.08em', display: 'block', marginBottom: '10px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                {step}
              </span>
              <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.02em', marginBottom: '8px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{title}</h3>
              <p style={{ fontSize: '13px', color: '#737373', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ══ TESTIMONIALS ════════════════════════════════════ */}
    <section style={{ padding: '80px 24px', background: '#fafafa', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        <Pill text="Trusted by the Entire University" />
        <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.035em', color: '#0a0a0a', marginBottom: '48px' }}>
          Trusted by the Entire University
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {TESTIMONIALS.map(({ name, role, text }) => (
            <div key={name} style={{
              padding: '24px', borderRadius: '16px', textAlign: 'left',
              background: 'white', border: '1px solid rgba(0,0,0,0.07)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            }}>
              <div style={{ display: 'flex', gap: '3px', marginBottom: '14px' }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="#7c3aed" style={{ color: '#7c3aed' }} />)}
              </div>
              <p style={{ fontSize: '13.5px', color: '#525252', lineHeight: 1.65, marginBottom: '16px' }}>"{text}"</p>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 700, color: '#0a0a0a' }}>{name}</p>
                <p style={{ fontSize: '11.5px', color: '#a3a3a3', fontWeight: 500 }}>{role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ══ CTA ════════════════════════════════════════════ */}
    <section style={{
      padding: '100px 24px',
      background: 'linear-gradient(140deg, #1a0533 0%, #3d1a7a 30%, #5521a8 60%, #7c3aed 100%)',
      textAlign: 'center', position: 'relative', overflow: 'hidden',
    }}>
      {/* Rings */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '450px', height: '450px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '640px', margin: '0 auto', position: 'relative' }}>
        <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 'clamp(30px, 5vw, 52px)', fontWeight: 900, letterSpacing: '-0.04em', color: 'white', lineHeight: 1.1, marginBottom: '18px' }}>
          Ready to Transform University Management?
        </h2>
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.65, marginBottom: '40px' }}>
          Join thousands of students, faculty, and administrators who already rely on HiSUP every day.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <button style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '13px 28px', borderRadius: '12px', fontSize: '15px', fontWeight: 700,
              background: 'white', color: '#7c3aed', border: 'none', cursor: 'pointer',
              boxShadow: '0 8px 30px rgba(0,0,0,0.20)', fontFamily: 'Inter, sans-serif',
              transition: 'all 200ms ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 40px rgba(0,0,0,0.28)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.20)'; }}
            >
              Access ERP Portal <ArrowRight size={16} />
            </button>
          </Link>
          <button style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '13px 28px', borderRadius: '12px', fontSize: '15px', fontWeight: 700,
            background: 'rgba(255,255,255,0.10)', color: 'white',
            border: '1px solid rgba(255,255,255,0.20)', cursor: 'pointer',
            backdropFilter: 'blur(12px)', fontFamily: 'Inter, sans-serif',
            transition: 'all 200ms ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; }}
          >
            View All Modules <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>

    {/* ══ FOOTER ════════════════════════════════════════ */}
    <footer style={{ background: '#0a0a0a', padding: '48px 24px 32px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px', marginBottom: '40px' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GraduationCap size={15} color="white" />
              </div>
              <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: '15px', color: 'white', letterSpacing: '-0.025em' }}>HiSUP</span>
            </div>
            <p style={{ fontSize: '13px', color: '#737373', lineHeight: 1.65, maxWidth: '220px' }}>
              Next-generation university management for modern institutions.
            </p>
          </div>

          {/* Links */}
          {[
            { title: 'Platform', links: ['Features', 'Modules', 'Workflow', 'Pricing'] },
            { title: 'Resources', links: ['Documentation', 'API Guide', 'Changelog', 'Status'] },
            { title: 'Support', links: ['Help Center', 'Contact Us', 'Privacy', 'Terms'] },
          ].map(({ title, links }) => (
            <div key={title}>
              <p style={{ fontSize: '11.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#404040', marginBottom: '14px' }}>{title}</p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {links.map(l => (
                  <li key={l}>
                    <a href="#" style={{ fontSize: '13.5px', color: '#737373', textDecoration: 'none', transition: 'color 150ms ease' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'white'}
                      onMouseLeave={e => e.currentTarget.style.color = '#737373'}
                    >{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <p style={{ fontSize: '12px', color: '#404040' }}>© {new Date().getFullYear()} HiSUP University Platform. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="#" style={{ fontSize: '12px', color: '#404040', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" style={{ fontSize: '12px', color: '#404040', textDecoration: 'none' }}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
);

export default LandingPage;
