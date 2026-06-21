import { Link } from 'react-router-dom';
import {
  ArrowRight, BookOpen, Users, Calendar, DollarSign, Library,
  GraduationCap, Shield, Zap, Globe, Star, ChevronRight,
  CheckCircle, BarChart2, Bell, Award
} from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home',    href: '#home'    },
  { label: 'Modules', href: '#modules' },
  { label: 'About',   href: '#about'   },
];

const STATS = [
  { value: '6+',   label: 'Core Modules'    },
  { value: '500+', label: 'Active Students'  },
  { value: '50+',  label: 'Courses Offered'  },
  { value: '99%',  label: 'Platform Uptime'  },
];

const MODULES = [
  { icon: Users,         title: 'Student Management', color: 'from-emerald-500 to-teal-600',     desc: 'Profiles, enrollment history, and academic tracking in one place.' },
  { icon: BookOpen,      title: 'Course Registration', color: 'from-violet-500 to-indigo-600',    desc: 'Online registration, capacity monitoring, and prerequisites.' },
  { icon: GraduationCap, title: 'Faculty Portal',      color: 'from-amber-500 to-orange-500',    desc: 'Teaching roles, schedules, departments, and assignments.' },
  { icon: DollarSign,    title: 'Fee Management',      color: 'from-rose-500 to-pink-600',       desc: 'Fee structures, payment tracking, and financial reports.' },
  { icon: Library,       title: 'Smart Library',       color: 'from-sky-500 to-blue-600',        desc: 'Digital catalog, book issues, returns, and overdue alerts.' },
  { icon: Calendar,      title: 'Results & Grading',   color: 'from-fuchsia-500 to-purple-600',  desc: 'Grade uploads, GPA calculations, and student transcripts.' },
];

const HIGHLIGHTS = [
  { icon: CheckCircle, label: 'Role-based access control'             },
  { icon: CheckCircle, label: 'Real-time attendance tracking'          },
  { icon: CheckCircle, label: 'Automated fee & payment records'        },
  { icon: CheckCircle, label: 'GPA calculation & academic reporting'   },
];

/* ═══════════════════════════════════════════════════════════ */
const LandingPage = () => (
  <div className="min-h-screen bg-[#050e1f] text-slate-200 font-inter overflow-x-hidden">

    {/* ── NAVBAR ─────────────────────────────────────────── */}
    <nav className="fixed top-0 inset-x-0 z-50 bg-[#050e1f]/80 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-900/50 group-hover:shadow-emerald-700/60 transition-all duration-300">
            <span className="text-white font-black text-xl">H</span>
          </div>
          <div>
            <p className="font-black text-xl text-white leading-none tracking-tight">HiSUP</p>
            <p className="text-[10px] font-bold text-emerald-400 tracking-widest uppercase mt-0.5">Smart Portal</p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(l => (
            <a key={l.label} href={l.href} className="text-sm font-semibold text-slate-400 hover:text-emerald-400 transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-bold rounded-full shadow-lg shadow-emerald-900/50 hover:-translate-y-0.5 transition-all duration-300"
        >
          Sign In <ArrowRight size={15} />
        </Link>
      </div>
    </nav>

    {/* ── HERO ───────────────────────────────────────────── */}
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/mtech-bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Layered overlays */}
      <div className="absolute inset-0 z-0 bg-[#050e1f]/85" />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#050e1f] via-transparent to-[#050e1f]/40" />
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />
      {/* Grid lines */}
      <div className="absolute inset-0 z-0 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)', backgroundSize:'4rem 4rem' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col lg:flex-row items-center gap-16 py-24">

        {/* Left */}
        <div className="flex-1 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">HITEC Smart University Portal</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.07] tracking-tight mb-6">
            The Smartest Way<br/>to Manage Your<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">University Life</span>
          </h1>

          <p className="text-lg text-slate-400 leading-relaxed mb-10 max-w-xl">
            One unified platform connecting students, faculty, and administrators. Track results, manage fees, mark attendance, and more — all from a single secure login.
          </p>

          {/* Highlight checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12">
            {HIGHLIGHTS.map((h, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle size={17} className="text-emerald-400 shrink-0" />
                {h.label}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-2xl shadow-xl shadow-emerald-900/40 hover:shadow-emerald-700/50 hover:-translate-y-1 transition-all duration-300 text-base"
            >
              Access Portal <ArrowRight size={18} />
            </Link>
            <a
              href="#modules"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-500/30 text-white font-bold rounded-2xl backdrop-blur-md transition-all duration-300 text-base"
            >
              Explore Modules
            </a>
          </div>
        </div>

        {/* Right: Stats panel */}
        <div className="flex-1 w-full max-w-md mx-auto lg:max-w-none">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-500/20 to-teal-500/10 rounded-[3rem] blur-2xl" />
            <div className="relative bg-white/[0.04] border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-md shadow-2xl">

              {/* Window chrome */}
              <div className="flex gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white">
                  <BarChart2 size={20} className="mb-3 opacity-80" />
                  <p className="text-3xl font-black">500+</p>
                  <p className="text-xs text-emerald-100 mt-1 font-semibold">Active Students</p>
                </div>
                <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-5 text-white">
                  <BookOpen size={20} className="mb-3 opacity-80" />
                  <p className="text-3xl font-black">50+</p>
                  <p className="text-xs text-indigo-200 mt-1 font-semibold">Courses Offered</p>
                </div>
              </div>

              {/* Notification card */}
              <div className="bg-white/[0.05] border border-white/10 rounded-2xl p-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
                    <Bell size={16} className="text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Result Published</p>
                    <p className="text-xs text-slate-400">Fall 2025 semester results are now live</p>
                  </div>
                  <span className="ml-auto text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full shrink-0">New</span>
                </div>
              </div>

              {/* Progress bars */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Enrollment Progress</p>
                {[
                  { label: 'Computer Science', pct: 82, color: 'bg-emerald-500' },
                  { label: 'Electrical Eng.',  pct: 65, color: 'bg-violet-500'  },
                  { label: 'Business Admin.',  pct: 48, color: 'bg-amber-500'   },
                ].map((r, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">{r.label}</span>
                      <span className="text-white font-bold">{r.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full">
                      <div className={`h-1.5 ${r.color} rounded-full`} style={{ width: `${r.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row at bottom */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/[0.06] bg-white/[0.02] backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4">
          {STATS.map((s, i) => (
            <div key={i} className="py-5 px-6 flex flex-col items-center border-r border-white/[0.06] last:border-0">
              <p className="text-2xl font-black text-white">{s.value}</p>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── MODULES ────────────────────────────────────────── */}
    <section id="modules" className="py-32 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-16">
          <div>
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">What's Inside</p>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Core System<br/>Modules</h2>
          </div>
          <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-emerald-400 transition-colors group">
            Access All
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
              <ChevronRight size={15} />
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {MODULES.map((mod, i) => (
            <div key={i} className="group relative p-7 rounded-3xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-400 overflow-hidden cursor-pointer">
              <div className={`absolute -top-6 -right-6 w-28 h-28 bg-gradient-to-br ${mod.color} opacity-10 group-hover:opacity-20 rounded-full blur-2xl transition-opacity duration-500`} />
              <div className={`w-13 h-13 w-14 h-14 rounded-2xl bg-gradient-to-br ${mod.color} flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                <mod.icon size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{mod.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{mod.desc}</p>
              <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Open Module <ArrowRight size={13} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── WHY HISUP ──────────────────────────────────────── */}
    <section id="about" className="py-40 relative border-t border-white/[0.06] bg-[#03090f]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 flex flex-col lg:flex-row items-center gap-24">

        {/* Left text */}
        <div className="flex-1">
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-4">Why Choose HiSUP</p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-10 tracking-tight leading-tight">
            Built for <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Excellence.</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-12">
            HiSUP replaces fragmented legacy systems with a single, cohesive interface architected for speed, reliability, and security — so students and faculty can focus on what truly matters: education.
          </p>

          <ul className="flex flex-col gap-0">
            {[
              { icon: Shield, title: 'Enterprise-Grade Security', text: 'Role-based access control and encrypted data storage protect every record.' },
              { icon: Zap,    title: 'Lightning Fast',            text: 'Optimized for thousands of concurrent users without any lag.' },
              { icon: Globe,  title: 'Cloud Native',              text: 'Available on any device, anywhere, any time — no installation needed.' },
              { icon: Award,  title: 'Academic Excellence',       text: 'Designed in collaboration with faculty for real-world university workflows.' },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-5 py-6 border-b border-white/[0.06] last:border-0">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <item.icon size={20} className="text-emerald-400" />
                </div>
                <div className="pt-1">
                  <h4 className="text-white font-bold text-base mb-1.5">{item.title}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: dashboard mockup */}
        <div className="flex-1 w-full max-w-lg mx-auto mt-0">
          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-to-tr from-emerald-500/15 to-teal-500/10 rounded-[3rem] blur-2xl" />
            <div className="relative bg-white/[0.04] border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-md shadow-2xl">

              <div className="flex gap-2 mb-8">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>

              {/* Header skeleton */}
              <div className="flex items-center justify-between mb-8">
                <div className="h-6 w-36 bg-white/10 rounded-lg" />
                <div className="h-8 w-24 bg-emerald-500/30 rounded-lg" />
              </div>

              {/* Two tiles */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="h-28 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20 rounded-2xl p-4 flex flex-col justify-between">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/30" />
                  <div className="h-4 w-16 bg-white/20 rounded-full" />
                </div>
                <div className="h-28 bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/20 rounded-2xl p-4 flex flex-col justify-between">
                  <div className="w-7 h-7 rounded-lg bg-violet-500/30" />
                  <div className="h-4 w-14 bg-white/20 rounded-full" />
                </div>
              </div>

              {/* Bar chart */}
              <div className="bg-white/[0.04] rounded-2xl p-5 border border-white/[0.06]">
                <div className="h-4 w-28 bg-white/10 rounded mb-5" />
                <div className="flex items-end gap-2.5 h-20">
                  {[55, 80, 60, 90, 70, 95, 75].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t-lg transition-all"
                      style={{
                        height: `${h}%`,
                        background: i % 2 === 0
                          ? 'linear-gradient(to top,#10b981,#34d399)'
                          : 'linear-gradient(to top,#6366f1,#818cf8)',
                        opacity: 0.7,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    {/* ── CTA BANNER ─────────────────────────────────────── */}
    <section className="py-24 relative overflow-hidden border-t border-white/[0.06]">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/30 via-teal-900/20 to-[#050e1f]" />
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-emerald-500 to-transparent" />
      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 text-center">
        <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-5">Get Started Today</p>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Ready to Transform<br/>University Management?</h2>
        <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
          Log in with your university credentials and experience a seamless, all-in-one digital campus.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-2xl text-lg shadow-2xl shadow-emerald-900/50 hover:shadow-emerald-700/60 hover:-translate-y-1 transition-all duration-300"
        >
          Access HiSUP Portal <ArrowRight size={20} />
        </Link>
      </div>
    </section>

    {/* ── FOOTER ─────────────────────────────────────────── */}
    <footer className="border-t border-white/[0.06] bg-[#03090f] py-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center">
            <span className="text-white font-black text-sm">H</span>
          </div>
          <span className="font-bold text-white">HiSUP</span>
          <span className="text-slate-600">—</span>
          <span className="text-slate-500 text-sm">HITEC Smart University Portal</span>
        </div>
        <p className="text-slate-600 text-sm">
          © {new Date().getFullYear()} HITEC University. All rights reserved.
        </p>
      </div>
    </footer>

  </div>
);

export default LandingPage;
