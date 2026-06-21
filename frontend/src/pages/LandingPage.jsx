import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  ArrowRight, Users, BookOpen, Calendar, DollarSign, Library,
  GraduationCap, Shield, Zap, BarChart2, Bell, Award, Star,
  ChevronRight, CheckCircle, TrendingUp, FileText, Settings,
  Clock, Layout, Database, Lock, Globe, Menu, X, LayoutDashboard,
  BookMarked, CreditCard, UserCheck, ClipboardList, PieChart,
  Activity, Layers, BarChart, Target, Sparkles
} from 'lucide-react';

/* ── Scroll-aware hook ── */
const useScrolled = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);
  return scrolled;
};

const NAV_LINKS = [
  { label: 'Home',    href: '#home'      },
  { label: 'Modules', href: '#modules'   },
  { label: 'Faculty', href: '#workflow'  },
  { label: 'Students',href: '#showcase'  },
  { label: 'Library', href: '#modules'   },
  { label: 'About',   href: '#about'     },
];

const STATS = [
  { value: '5,000+', label: 'Active Students',  icon: Users,       color: '#7C3AED' },
  { value: '300+',   label: 'Faculty Members',  icon: GraduationCap, color: '#7C3AED' },
  { value: '150+',   label: 'Courses',          icon: BookOpen,    color: '#7C3AED' },
  { value: '99.9%',  label: 'System Uptime',    icon: Activity,    color: '#22C55E' },
];

const MODULES = [
  {
    icon: Users, title: 'Student Management',
    items: ['Registration', 'Attendance', 'GPA Tracking', 'Transcripts'],
    desc: 'Comprehensive student lifecycle management from enrollment to graduation.',
  },
  {
    icon: GraduationCap, title: 'Faculty Management',
    items: ['Courses', 'Scheduling', 'Grading', 'Academic Records'],
    desc: 'Empower faculty with smart tools for teaching and assessment.',
  },
  {
    icon: BarChart2, title: 'Results & Analytics',
    items: ['Results', 'Progress Tracking', 'Degree Audit', 'Reports'],
    desc: 'Real-time academic performance insights and automated reporting.',
  },
  {
    icon: DollarSign, title: 'Finance & Fees',
    items: ['Fee Collection', 'Scholarships', 'Payment History', 'Invoices'],
    desc: 'End-to-end financial operations with transparent payment tracking.',
  },
  {
    icon: Library, title: 'Smart Library',
    items: ['Book Issuing', 'Returns', 'Digital Resources', 'Catalog'],
    desc: 'Digitized library management with instant book discovery.',
  },
  {
    icon: Settings, title: 'Administration',
    items: ['Reports', 'Analytics', 'User Management', 'Audit Logs'],
    desc: 'Powerful admin tools to manage every aspect of the university.',
  },
];

const WHY = [
  {
    icon: Lock,
    title: 'Secure',
    subtitle: 'Enterprise-Grade Security',
    desc: 'Role-based access control, encrypted data storage, and full audit trails protect every record at every level.',
  },
  {
    icon: Zap,
    title: 'Intelligent',
    subtitle: 'Automated & Smart',
    desc: 'Automated workflows, smart analytics, and AI-assisted reporting reduce administrative burden by 70%.',
  },
  {
    icon: Layers,
    title: 'Scalable',
    subtitle: 'Built to Grow',
    desc: 'Supports thousands of concurrent users with cloud-native architecture designed for any university size.',
  },
];

const WORKFLOW = [
  { icon: UserCheck,    step: '01', title: 'Student Registration',  desc: 'Secure onboarding with document verification and role assignment.' },
  { icon: BookMarked,   step: '02', title: 'Course Enrollment',     desc: 'Smart course selection with conflict detection and prerequisite checks.' },
  { icon: Calendar,     step: '03', title: 'Attendance Tracking',   desc: 'Real-time digital attendance with automated alerts and reports.' },
  { icon: ClipboardList,step: '04', title: 'Assessments',           desc: 'Assignment submission, quiz management, and evaluation workflows.' },
  { icon: BarChart,     step: '05', title: 'Results',               desc: 'Instant grade publishing with GPA calculation and transcript generation.' },
  { icon: Award,        step: '06', title: 'Graduation',            desc: 'Automated degree audit and ceremony management for graduating cohorts.' },
];

const TESTIMONIALS = [
  {
    name: 'Ayesha Raza',
    role: 'Final Year Student, CS Department',
    text: 'HiSUP completely transformed how I manage my academic life. From tracking attendance to checking results, everything is in one place and the interface is incredibly smooth.',
    rating: 5,
  },
  {
    name: 'Dr. Hassan Tariq',
    role: 'Associate Professor, EE Department',
    text: 'As a faculty member, the grading and course management tools are exceptional. What used to take hours now takes minutes. This is the future of academic management.',
    rating: 5,
  },
  {
    name: 'Ms. Nida Malik',
    role: 'Academic Registrar, Administration',
    text: 'Managing hundreds of students and their records used to be chaotic. HiSUP has brought order, transparency, and real-time insights to our entire administrative workflow.',
    rating: 5,
  },
];

/* ═══════════════════════════════════════════════════════════════ */
const LandingPage = () => {
  const scrolled = useScrolled();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('student');

  return (
    <div className="min-h-screen font-inter text-[#0F172A] overflow-x-hidden" style={{ background: '#FFFFFF' }}>

      {/* ─────────────────────────────────────────────────────────
          INJECT KEYFRAMES
      ───────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes fadeUp   { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
        @keyframes float    { 0%,100% { transform:translateY(0px); } 50% { transform:translateY(-10px); } }
        @keyframes scaleIn  { from { opacity:0; transform:scale(.96); } to { opacity:1; transform:scale(1); } }
        @keyframes drawLine { from { height:0; } to { height:100%; } }
        @keyframes spin     { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        .anim-fade-up  { animation: fadeUp  .7s ease both; }
        .anim-fade-in  { animation: fadeIn  .6s ease both; }
        .anim-float    { animation: float   4s ease-in-out infinite; }
        .anim-scale-in { animation: scaleIn .6s ease both; }
        .delay-1 { animation-delay:.1s; } .delay-2 { animation-delay:.2s; }
        .delay-3 { animation-delay:.3s; } .delay-4 { animation-delay:.4s; }
        .delay-5 { animation-delay:.5s; } .delay-6 { animation-delay:.6s; }
        .btn-primary {
          display:inline-flex; align-items:center; gap:8px;
          padding:16px 32px; border-radius:14px;
          background:linear-gradient(135deg,#7C3AED,#5B21B6);
          color:#fff; font-size:16px; font-weight:600;
          box-shadow:0 8px 32px rgba(124,58,237,.30);
          transition:all .25s cubic-bezier(.2,.8,.2,1);
          cursor:pointer; text-decoration:none;
        }
        .btn-primary:hover { transform:translateY(-2px); box-shadow:0 16px 40px rgba(124,58,237,.40); }
        .btn-outline {
          display:inline-flex; align-items:center; gap:8px;
          padding:16px 32px; border-radius:14px;
          background:#fff; border:1.5px solid #E2E8F0;
          color:#0F172A; font-size:16px; font-weight:600;
          box-shadow:0 2px 8px rgba(0,0,0,.04);
          transition:all .25s cubic-bezier(.2,.8,.2,1);
          cursor:pointer; text-decoration:none;
        }
        .btn-outline:hover { border-color:#7C3AED; color:#7C3AED; transform:translateY(-2px); box-shadow:0 8px 24px rgba(124,58,237,.12); }
        .card-hover { transition:all .3s cubic-bezier(.2,.8,.2,1); }
        .card-hover:hover { transform:translateY(-6px); box-shadow:0 24px 64px rgba(0,0,0,.10); }
        .purple-text { color:transparent; background:linear-gradient(135deg,#7C3AED,#A855F7); -webkit-background-clip:text; background-clip:text; }
        .section-pad { padding:120px 8%; }
        .radial-blob {
          position:absolute; border-radius:50%;
          background:radial-gradient(circle, rgba(124,58,237,.08) 0%, transparent 70%);
          pointer-events:none;
        }
        .module-card:hover .module-icon { transform:scale(1.1) rotate(4deg); }
        .module-icon { transition:transform .3s; }
        .workflow-line { background:linear-gradient(to bottom,#7C3AED,#A855F7); }
        .tab-btn { padding:10px 20px; border-radius:10px; font-size:14px; font-weight:600; cursor:pointer; transition:all .2s; border:none; }
        .tab-active { background:#7C3AED; color:#fff; box-shadow:0 4px 16px rgba(124,58,237,.3); }
        .tab-inactive { background:#F8FAFC; color:#64748B; }
        .tab-inactive:hover { background:#EDE9FE; color:#7C3AED; }
        @media (max-width:768px) { .section-pad { padding:80px 5%; } }
      `}</style>

      {/* ─────────────────────────────────────────────────────────
          NAVBAR
      ───────────────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
        style={{
          height: '88px',
          background: scrolled ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: scrolled ? '1px solid #E2E8F0' : '1px solid rgba(226,232,240,0.5)',
          boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.06)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-full flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg,#7C3AED,#5B21B6)', boxShadow: '0 4px 16px rgba(124,58,237,0.35)' }}>
              <span className="text-white font-black text-xl">H</span>
            </div>
            <div>
              <p className="font-black text-xl text-[#0F172A] leading-none tracking-tight">HiSUP</p>
              <p className="text-[10px] font-bold tracking-widest uppercase mt-0.5" style={{ color:'#7C3AED' }}>Smart Portal</p>
            </div>
          </Link>

          {/* Center links */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map(l => (
              <a key={l.label} href={l.href}
                className="text-sm font-semibold text-[#64748B] hover:text-[#7C3AED] transition-colors"
              >{l.label}</a>
            ))}
          </div>

          {/* CTA + mobile */}
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-primary hidden sm:inline-flex" style={{ padding:'12px 24px' }}>
              Sign In <ArrowRight size={16} />
            </Link>
            <button className="lg:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden absolute top-[88px] inset-x-0 bg-white border-b border-[#E2E8F0] shadow-xl py-6 px-6 flex flex-col gap-4">
            {NAV_LINKS.map(l => (
              <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)}
                className="text-base font-semibold text-[#64748B] hover:text-[#7C3AED] transition-colors py-1"
              >{l.label}</a>
            ))}
            <Link to="/login" className="btn-primary mt-2 justify-center">Sign In <ArrowRight size={16} /></Link>
          </div>
        )}
      </nav>

      {/* ─────────────────────────────────────────────────────────
          HERO SECTION
      ───────────────────────────────────────────────────────── */}
      <section id="home" className="relative overflow-hidden" style={{ paddingTop:'160px', paddingBottom:'100px', background:'linear-gradient(180deg,#ffffff,#f8fafc)' }}>
        {/* Radial blobs */}
        <div className="radial-blob" style={{ width:800, height:800, top:'-200px', left:'-200px' }} />
        <div className="radial-blob" style={{ width:600, height:600, bottom:'-100px', right:'-100px' }} />
        <div className="absolute top-40 right-60 w-3 h-3 rounded-full" style={{ background:'#A855F7', opacity:.4 }} />
        <div className="absolute top-80 left-40 w-2 h-2 rounded-full" style={{ background:'#7C3AED', opacity:.3 }} />

        <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col lg:flex-row items-center gap-20 relative z-10">

          {/* ── Left ── */}
          <div className="flex-1 max-w-[620px]">
            <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full mb-8 anim-fade-up" style={{ background:'rgba(124,58,237,.08)', border:'1px solid rgba(124,58,237,.18)' }}>
              <Sparkles size={14} style={{ color:'#7C3AED' }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color:'#7C3AED' }}>HITEC Smart University Portal</span>
            </div>

            <h1 className="font-extrabold leading-[1.05] tracking-tight mb-6 anim-fade-up delay-1" style={{ fontSize:'clamp(44px,6vw,72px)', fontWeight:800 }}>
              The Future of<br/>
              <span className="purple-text">University Management</span><br/>
              Starts Here.
            </h1>

            <p className="mb-10 text-[#64748B] leading-relaxed anim-fade-up delay-2" style={{ fontSize:'18px', maxWidth:'580px' }}>
              A complete digital ecosystem for students, faculty, administration, finance, academics, and library operations — unified in one intelligent platform.
            </p>

            <div className="flex flex-wrap gap-4 mb-14 anim-fade-up delay-3">
              <Link to="/login" className="btn-primary">
                <LayoutDashboard size={18} /> Access Portal
              </Link>
              <a href="#modules" className="btn-outline">
                Explore Modules <ChevronRight size={18} />
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-6 anim-fade-up delay-4">
              {[
                { icon: Shield,   text: 'Enterprise Security' },
                { icon: CheckCircle, text: 'HITEC Certified'  },
                { icon: Globe,    text: 'Cloud Native'        },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-2 text-sm font-semibold text-[#64748B]">
                  <b.icon size={16} style={{ color:'#7C3AED' }} />
                  {b.text}
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Dashboard Mockup ── */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none anim-float anim-scale-in delay-2">
            <div className="relative">
              {/* Glow */}
              <div className="absolute -inset-8 rounded-[3rem]" style={{ background:'radial-gradient(circle,rgba(124,58,237,.12) 0%,transparent 70%)', filter:'blur(20px)' }} />

              {/* Main card */}
              <div className="relative rounded-[28px] overflow-hidden shadow-2xl"
                style={{ background:'#fff', border:'1px solid #E2E8F0', boxShadow:'0 40px 120px rgba(0,0,0,.12)' }}>

                {/* Window chrome */}
                <div className="flex items-center gap-2 px-5 py-4 border-b border-[#E2E8F0]" style={{ background:'#F8FAFC' }}>
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <div className="flex-1 mx-3 h-6 rounded-lg px-3 flex items-center" style={{ background:'#E2E8F0' }}>
                    <span className="text-xs text-[#94A3B8]">portal.hisup.edu.pk</span>
                  </div>
                </div>

                <div className="p-6">
                  {/* Top greeting */}
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <p className="font-bold text-[#0F172A]">Good Morning, Admin 👋</p>
                      <p className="text-xs text-[#94A3B8] mt-0.5">Monday, 21 June 2026</p>
                    </div>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:'rgba(124,58,237,.1)' }}>
                      <Bell size={16} style={{ color:'#7C3AED' }} />
                    </div>
                  </div>

                  {/* 4 mini stat cards */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    {[
                      { label:'Active Students', value:'5,000+', icon:Users,         color:'#7C3AED', bg:'rgba(124,58,237,.08)' },
                      { label:'Faculty Members', value:'300+',   icon:GraduationCap, color:'#A855F7', bg:'rgba(168,85,247,.08)' },
                      { label:'Courses',         value:'150+',   icon:BookOpen,      color:'#22C55E', bg:'rgba(34,197,94,.08)'  },
                      { label:'Accuracy',        value:'98%',    icon:Target,        color:'#F59E0B', bg:'rgba(245,158,11,.08)' },
                    ].map((s, i) => (
                      <div key={i} className="rounded-2xl p-4" style={{ background:s.bg, border:`1px solid ${s.bg}` }}>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-[11px] font-semibold text-[#64748B]">{s.label}</p>
                          <s.icon size={14} style={{ color:s.color }} />
                        </div>
                        <p className="text-2xl font-black" style={{ color:s.color }}>{s.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* GPA widget */}
                  <div className="rounded-2xl p-4 mb-4" style={{ background:'#F8FAFC', border:'1px solid #E2E8F0' }}>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-bold text-[#0F172A]">Enrollment by Program</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background:'rgba(34,197,94,.1)', color:'#22C55E' }}>+12%</span>
                    </div>
                    <div className="flex items-end gap-2 h-16">
                      {[65, 82, 55, 90, 72, 88, 60].map((h, i) => (
                        <div key={i} className="flex-1 rounded-t-lg"
                          style={{ height:`${h}%`, background: i % 2 === 0 ? 'linear-gradient(to top,#7C3AED,#A855F7)' : 'rgba(124,58,237,.15)' }} />
                      ))}
                    </div>
                  </div>

                  {/* Fee payment status */}
                  <div className="rounded-2xl p-4" style={{ border:'1px solid #E2E8F0' }}>
                    <p className="text-xs font-bold text-[#0F172A] mb-3">Fee Collection Status</p>
                    <div className="space-y-2">
                      {[
                        { label:'Paid',    pct:74, color:'#22C55E' },
                        { label:'Pending', pct:18, color:'#F59E0B' },
                        { label:'Overdue', pct:8,  color:'#EF4444' },
                      ].map((r, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="text-[11px] text-[#64748B] w-14">{r.label}</span>
                          <div className="flex-1 h-1.5 rounded-full" style={{ background:'#E2E8F0' }}>
                            <div className="h-1.5 rounded-full transition-all" style={{ width:`${r.pct}%`, background:r.color }} />
                          </div>
                          <span className="text-[11px] font-bold text-[#0F172A] w-7 text-right">{r.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge - top right */}
              <div className="absolute -top-5 -right-5 bg-white rounded-2xl shadow-xl px-5 py-3 flex items-center gap-3 border border-[#E2E8F0] anim-float" style={{ animationDelay:'.5s' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:'rgba(34,197,94,.1)' }}>
                  <TrendingUp size={16} style={{ color:'#22C55E' }} />
                </div>
                <div>
                  <p className="text-xs font-black text-[#0F172A]">98% Accuracy</p>
                  <p className="text-[10px] text-[#94A3B8]">Result Processing</p>
                </div>
              </div>

              {/* Floating badge - bottom left */}
              <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl px-5 py-3 flex items-center gap-3 border border-[#E2E8F0] anim-float" style={{ animationDelay:'1s' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:'rgba(124,58,237,.1)' }}>
                  <Users size={16} style={{ color:'#7C3AED' }} />
                </div>
                <div>
                  <p className="text-xs font-black text-[#0F172A]">5,000+ Students</p>
                  <p className="text-[10px] text-[#94A3B8]">Currently Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          STATS SECTION
      ───────────────────────────────────────────────────────── */}
      <section style={{ background:'#fff', borderTop:'1px solid #E2E8F0', borderBottom:'1px solid #E2E8F0', padding:'0 8%' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4">
          {STATS.map((s, i) => (
            <div key={i} className="card-hover py-10 px-6 flex flex-col items-center text-center border-r last:border-0 border-[#E2E8F0] cursor-default">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                style={{ background:'rgba(124,58,237,.07)', border:'1px solid rgba(124,58,237,.12)' }}>
                <s.icon size={24} style={{ color: s.color }} />
              </div>
              <p className="text-3xl font-black text-[#0F172A] mb-1">{s.value}</p>
              <p className="text-sm font-semibold text-[#64748B]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          MODULES SECTION
      ───────────────────────────────────────────────────────── */}
      <section id="modules" className="section-pad" style={{ background:'#F8FAFC' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color:'#7C3AED' }}>Platform Modules</p>
            <h2 className="font-bold text-[#0F172A] mb-4" style={{ fontSize:'clamp(32px,5vw,48px)', fontWeight:700 }}>
              Everything Your University Needs
            </h2>
            <p className="text-[#64748B] max-w-2xl mx-auto" style={{ fontSize:'18px' }}>
              Six powerful modules covering every aspect of university operations — connected, intelligent, and effortless.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MODULES.map((mod, i) => (
              <div key={i} className="module-card card-hover rounded-[20px] p-8 cursor-pointer"
                style={{ background:'#fff', border:'1px solid #E2E8F0', boxShadow:'0 2px 8px rgba(0,0,0,.04)' }}>
                <div className="module-icon w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                  style={{ background:'rgba(124,58,237,.08)', border:'1px solid rgba(124,58,237,.14)' }}>
                  <mod.icon size={26} style={{ color:'#7C3AED' }} />
                </div>
                <h3 className="text-xl font-bold text-[#0F172A] mb-2">{mod.title}</h3>
                <p className="text-[#64748B] text-sm leading-relaxed mb-5">{mod.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {mod.items.map((item, j) => (
                    <span key={j} className="text-xs font-semibold px-3 py-1.5 rounded-full"
                      style={{ background:'rgba(124,58,237,.07)', color:'#7C3AED', border:'1px solid rgba(124,58,237,.12)' }}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          WHY CHOOSE HISUP
      ───────────────────────────────────────────────────────── */}
      <section id="about" className="section-pad" style={{ background:'#fff' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color:'#7C3AED' }}>Why HiSUP</p>
            <h2 className="font-bold text-[#0F172A] mb-4" style={{ fontSize:'clamp(32px,5vw,48px)', fontWeight:700 }}>
              Built for the Modern University
            </h2>
            <p className="text-[#64748B] max-w-xl mx-auto" style={{ fontSize:'18px' }}>
              Designed with enterprise-grade standards to handle every challenge academic institutions face.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {WHY.map((w, i) => (
              <div key={i} className="card-hover rounded-[20px] p-10 text-center"
                style={{ background:'#F8FAFC', border:'1px solid #E2E8F0' }}>
                <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-6"
                  style={{ background:'linear-gradient(135deg,#7C3AED,#A855F7)', boxShadow:'0 8px 24px rgba(124,58,237,.25)' }}>
                  <w.icon size={28} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#0F172A] mb-1">{w.title}</h3>
                <p className="text-sm font-bold mb-4" style={{ color:'#7C3AED' }}>{w.subtitle}</p>
                <p className="text-[#64748B] leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          WORKFLOW TIMELINE
      ───────────────────────────────────────────────────────── */}
      <section id="workflow" className="section-pad" style={{ background:'#F8FAFC' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color:'#7C3AED' }}>Student Journey</p>
            <h2 className="font-bold text-[#0F172A] mb-4" style={{ fontSize:'clamp(32px,5vw,48px)', fontWeight:700 }}>
              The Complete University Workflow
            </h2>
            <p className="text-[#64748B] max-w-xl mx-auto" style={{ fontSize:'18px' }}>
              Every step of the student lifecycle, managed intelligently from day one to graduation.
            </p>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 hidden md:block" style={{ background:'linear-gradient(to bottom,#7C3AED,#A855F7)' }} />

            <div className="flex flex-col gap-8">
              {WORKFLOW.map((w, i) => (
                <div key={i} className={`flex flex-col md:flex-row items-center gap-8 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                  <div className={`flex-1 ${i % 2 === 1 ? 'md:text-right' : ''}`}>
                    <div className={`card-hover rounded-[20px] p-8 inline-block w-full max-w-md ${i % 2 === 1 ? 'md:ml-auto' : ''}`}
                      style={{ background:'#fff', border:'1px solid #E2E8F0', boxShadow:'0 4px 16px rgba(0,0,0,.04)' }}>
                      <div className={`flex items-center gap-4 mb-3 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                          style={{ background:'rgba(124,58,237,.08)', border:'1px solid rgba(124,58,237,.14)' }}>
                          <w.icon size={22} style={{ color:'#7C3AED' }} />
                        </div>
                        <div>
                          <span className="text-xs font-black" style={{ color:'#A855F7' }}>Step {w.step}</span>
                          <h4 className="font-bold text-[#0F172A] text-lg leading-tight">{w.title}</h4>
                        </div>
                      </div>
                      <p className="text-[#64748B] text-sm leading-relaxed">{w.desc}</p>
                    </div>
                  </div>

                  {/* Circle on line */}
                  <div className="hidden md:flex w-12 h-12 shrink-0 rounded-full items-center justify-center z-10 shadow-lg"
                    style={{ background:'linear-gradient(135deg,#7C3AED,#A855F7)', boxShadow:'0 0 0 4px rgba(124,58,237,.15)' }}>
                    <span className="text-white font-black text-xs">{w.step}</span>
                  </div>

                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          DASHBOARD SHOWCASE
      ───────────────────────────────────────────────────────── */}
      <section id="showcase" className="section-pad" style={{ background:'#fff' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color:'#7C3AED' }}>Portal Preview</p>
            <h2 className="font-bold text-[#0F172A] mb-4" style={{ fontSize:'clamp(32px,5vw,48px)', fontWeight:700 }}>
              A Dashboard for Everyone
            </h2>
            <p className="text-[#64748B] max-w-xl mx-auto" style={{ fontSize:'18px' }}>
              Tailored views for students, faculty, and administrators — each designed for their unique workflow.
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex justify-center gap-3 mb-10">
            {[
              { key:'student', label:'Student Portal' },
              { key:'faculty', label:'Faculty Portal' },
              { key:'admin',   label:'Admin Portal'   },
            ].map(t => (
              <button key={t.key}
                className={`tab-btn ${activeTab === t.key ? 'tab-active' : 'tab-inactive'}`}
                onClick={() => setActiveTab(t.key)}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Showcase card */}
          <div className="rounded-[24px] overflow-hidden shadow-2xl" style={{ border:'1px solid #E2E8F0', boxShadow:'0 40px 100px rgba(0,0,0,.10)' }}>
            {/* Chrome bar */}
            <div className="flex items-center gap-2 px-6 py-4 border-b border-[#E2E8F0]" style={{ background:'#F8FAFC' }}>
              <div className="w-3 h-3 rounded-full bg-rose-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <div className="flex-1 mx-4 h-7 rounded-lg px-4 flex items-center" style={{ background:'#E2E8F0', maxWidth:300 }}>
                <span className="text-xs text-[#94A3B8]">portal.hisup.edu.pk/{activeTab}</span>
              </div>
            </div>

            <div className="p-8" style={{ background:'#fff' }}>
              {activeTab === 'student' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="md:col-span-2 rounded-2xl p-6" style={{ background:'#F8FAFC', border:'1px solid #E2E8F0' }}>
                    <p className="font-bold text-[#0F172A] mb-1">My Courses <span className="text-sm font-normal text-[#64748B]">— Spring 2026</span></p>
                    <div className="space-y-3 mt-4">
                      {[
                        { code:'CS-401', name:'Data Structures',  grade:'A', pct:91 },
                        { code:'CS-403', name:'Database Systems',  grade:'A-',pct:86 },
                        { code:'EE-201', name:'Digital Logic',     grade:'B+',pct:78 },
                      ].map((c, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 rounded-xl" style={{ background:'#fff', border:'1px solid #E2E8F0' }}>
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background:'rgba(124,58,237,.08)' }}>
                            <BookOpen size={16} style={{ color:'#7C3AED' }} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-[#0F172A]">{c.name}</p>
                            <p className="text-xs text-[#94A3B8]">{c.code}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-black" style={{ color:'#7C3AED' }}>{c.grade}</span>
                            <p className="text-xs text-[#94A3B8]">{c.pct}%</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="rounded-2xl p-5" style={{ background:'linear-gradient(135deg,#7C3AED,#5B21B6)', color:'#fff' }}>
                      <p className="text-xs font-semibold opacity-70 mb-1">Current CGPA</p>
                      <p className="text-4xl font-black">3.72</p>
                      <p className="text-xs opacity-60 mt-2">Out of 4.00 GPA Scale</p>
                    </div>
                    <div className="rounded-2xl p-5" style={{ background:'rgba(34,197,94,.08)', border:'1px solid rgba(34,197,94,.15)' }}>
                      <p className="text-xs font-semibold text-[#64748B] mb-1">Attendance</p>
                      <p className="text-3xl font-black" style={{ color:'#22C55E' }}>92%</p>
                      <p className="text-xs text-[#94A3B8] mt-1">This Semester</p>
                    </div>
                    <div className="rounded-2xl p-5" style={{ background:'#F8FAFC', border:'1px solid #E2E8F0' }}>
                      <p className="text-xs font-semibold text-[#64748B] mb-1">Fee Status</p>
                      <p className="text-sm font-bold" style={{ color:'#22C55E' }}>✓ Paid</p>
                      <p className="text-xs text-[#94A3B8] mt-1">Fall 2026 Semester</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'faculty' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="md:col-span-2 rounded-2xl p-6" style={{ background:'#F8FAFC', border:'1px solid #E2E8F0' }}>
                    <p className="font-bold text-[#0F172A] mb-4">My Classes</p>
                    <div className="space-y-3">
                      {[
                        { name:'Data Structures', students:45, section:'A', pending:3  },
                        { name:'Algorithms',      students:38, section:'B', pending:0  },
                        { name:'OS Concepts',     students:52, section:'A', pending:7  },
                      ].map((c, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white border border-[#E2E8F0]">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:'rgba(124,58,237,.08)' }}>
                            <BookOpen size={16} style={{ color:'#7C3AED' }} />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm text-[#0F172A]">{c.name} — Section {c.section}</p>
                            <p className="text-xs text-[#94A3B8]">{c.students} students enrolled</p>
                          </div>
                          {c.pending > 0 && (
                            <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background:'rgba(245,158,11,.1)', color:'#F59E0B' }}>
                              {c.pending} pending
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="rounded-2xl p-5" style={{ background:'linear-gradient(135deg,#7C3AED,#A855F7)' }}>
                      <p className="text-xs font-semibold text-white/70 mb-1">Total Students</p>
                      <p className="text-4xl font-black text-white">135</p>
                    </div>
                    <div className="rounded-2xl p-5" style={{ background:'#F8FAFC', border:'1px solid #E2E8F0' }}>
                      <p className="text-xs font-semibold text-[#64748B] mb-2">Grading Progress</p>
                      <div className="h-2 rounded-full bg-[#E2E8F0]">
                        <div className="h-2 rounded-full" style={{ width:'68%', background:'#7C3AED' }} />
                      </div>
                      <p className="text-xs text-[#94A3B8] mt-1">68% completed</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'admin' && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                  {[
                    { label:'Total Students', value:'5,247', icon:Users,       color:'#7C3AED', bg:'rgba(124,58,237,.08)' },
                    { label:'Fee Collected',  value:'₨ 12M', icon:DollarSign,  color:'#22C55E', bg:'rgba(34,197,94,.08)'  },
                    { label:'Active Faculty', value:'312',   icon:GraduationCap,color:'#A855F7', bg:'rgba(168,85,247,.08)' },
                    { label:'Open Tickets',  value:'4',     icon:ClipboardList,color:'#F59E0B', bg:'rgba(245,158,11,.08)' },
                  ].map((s, i) => (
                    <div key={i} className="rounded-2xl p-5" style={{ background:s.bg, border:`1px solid ${s.bg}` }}>
                      <div className="flex justify-between items-start mb-3">
                        <p className="text-xs font-semibold text-[#64748B]">{s.label}</p>
                        <s.icon size={16} style={{ color:s.color }} />
                      </div>
                      <p className="text-2xl font-black" style={{ color:s.color }}>{s.value}</p>
                    </div>
                  ))}
                  <div className="md:col-span-4 rounded-2xl p-6" style={{ background:'#F8FAFC', border:'1px solid #E2E8F0' }}>
                    <p className="font-bold text-[#0F172A] mb-4">Monthly Enrollment Analytics</p>
                    <div className="flex items-end gap-3 h-24">
                      {[55,70,60,85,75,92,68,88,78,95,82,90].map((h,i) => (
                        <div key={i} className="flex-1 rounded-t-lg"
                          style={{ height:`${h}%`, background:i===11?'linear-gradient(to top,#7C3AED,#A855F7)':'rgba(124,58,237,.15)' }} />
                      ))}
                    </div>
                    <div className="flex justify-between mt-2">
                      {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => (
                        <span key={m} className="text-[10px] text-[#94A3B8] flex-1 text-center">{m}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          TESTIMONIALS
      ───────────────────────────────────────────────────────── */}
      <section className="section-pad" style={{ background:'#F8FAFC' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color:'#7C3AED' }}>Testimonials</p>
            <h2 className="font-bold text-[#0F172A] mb-4" style={{ fontSize:'clamp(32px,5vw,48px)', fontWeight:700 }}>
              Trusted by the Entire University
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card-hover rounded-[20px] p-8" style={{ background:'#fff', border:'1px solid #E2E8F0', boxShadow:'0 4px 16px rgba(0,0,0,.04)' }}>
                <div className="flex mb-4">
                  {[...Array(t.rating)].map((_,j) => (
                    <Star key={j} size={16} style={{ color:'#F59E0B', fill:'#F59E0B' }} />
                  ))}
                </div>
                <p className="text-[#0F172A] leading-relaxed mb-6 text-[15px]">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-[#E2E8F0]">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                    style={{ background:'linear-gradient(135deg,#7C3AED,#A855F7)' }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#0F172A]">{t.name}</p>
                    <p className="text-xs text-[#94A3B8]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          CTA SECTION
      ───────────────────────────────────────────────────────── */}
      <section className="section-pad" style={{ background:'#fff' }}>
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="radial-blob" style={{ width:600, height:600, top:'-100px', left:'50%', transform:'translateX(-50%)' }} />
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color:'#7C3AED' }}>Get Started</p>
            <h2 className="font-black text-[#0F172A] mb-6 leading-tight" style={{ fontSize:'clamp(36px,5vw,56px)', fontWeight:800 }}>
              Ready to Transform<br/>University Management?
            </h2>
            <p className="text-[#64748B] mb-10 mx-auto" style={{ fontSize:'18px', maxWidth:'520px' }}>
              Join thousands of students and faculty already using HiSUP to streamline every aspect of university life.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/login" className="btn-primary" style={{ fontSize:'18px', padding:'20px 48px' }}>
                Access HiSUP Portal <ArrowRight size={20} />
              </Link>
              <a href="#modules" className="btn-outline" style={{ fontSize:'18px', padding:'20px 48px' }}>
                View All Modules
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          FOOTER
      ───────────────────────────────────────────────────────── */}
      <footer style={{ background:'#0F172A', color:'#fff' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-20">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-16">
            {/* Brand */}
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:'linear-gradient(135deg,#7C3AED,#5B21B6)' }}>
                  <span className="text-white font-black text-xl">H</span>
                </div>
                <div>
                  <p className="font-black text-xl text-white leading-none">HiSUP</p>
                  <p className="text-[10px] font-bold tracking-widest uppercase mt-0.5" style={{ color:'#A855F7' }}>Smart Portal</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color:'#64748B' }}>
                The complete digital ecosystem for HITEC University — connecting students, faculty, and administration in one intelligent platform.
              </p>
            </div>

            {/* Links */}
            {[
              { heading:'Platform',   links:['Dashboard','Modules','Analytics','Reports'] },
              { heading:'Resources',  links:['Documentation','Help Center','API','Status'] },
              { heading:'University', links:['About HITEC','Admissions','Research','Faculty'] },
              { heading:'Support',    links:['Contact','FAQ','Training','Community'] },
            ].map((col, i) => (
              <div key={i}>
                <p className="font-bold text-sm text-white mb-4">{col.heading}</p>
                <ul className="space-y-3">
                  {col.links.map(l => (
                    <li key={l}>
                      <a href="#" className="text-sm transition-colors" style={{ color:'#64748B' }}
                        onMouseEnter={e => e.target.style.color='#A855F7'}
                        onMouseLeave={e => e.target.style.color='#64748B'}>
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8" style={{ borderTop:'1px solid rgba(255,255,255,.08)' }}>
            <p className="text-sm" style={{ color:'#475569' }}>
              © 2026 HITEC Smart University Portal. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {['Privacy Policy','Terms of Service','Cookie Policy'].map(l => (
                <a key={l} href="#" className="text-xs" style={{ color:'#475569' }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
