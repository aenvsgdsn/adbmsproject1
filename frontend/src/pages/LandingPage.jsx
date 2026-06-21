import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Calendar, DollarSign, Library, GraduationCap, Shield, Zap, Globe, Star, ChevronRight } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Modules', href: '#modules' },
  { label: 'About', href: '#about' },
];

const STATS = [
  { value: '6+',    label: 'Core Modules' },
  { value: '500+',  label: 'Active Students' },
  { value: '50+',   label: 'Courses' },
  { value: '99%',   label: 'Uptime' },
];

const MODULES = [
  { icon: Users,         title: 'Student Management',  color: 'bg-gradient-to-br from-blue-500 to-blue-700',     light: 'bg-blue-50',   accent: 'text-blue-600', desc: 'Profiles, enrollment, and academic history.' },
  { icon: BookOpen,      title: 'Course Registration',  color: 'bg-gradient-to-br from-violet-500 to-purple-700', light: 'bg-purple-50', accent: 'text-purple-600', desc: 'Online registration and capacity monitoring.' },
  { icon: GraduationCap, title: 'Faculty Portal',       color: 'bg-gradient-to-br from-cyan-500 to-teal-600',    light: 'bg-cyan-50',   accent: 'text-cyan-600', desc: 'Teaching roles, schedules, and departments.' },
  { icon: DollarSign,    title: 'Fee Management',       color: 'bg-gradient-to-br from-emerald-500 to-green-700',light: 'bg-emerald-50',accent: 'text-emerald-600', desc: 'Fee tracking, payments, and finance reports.' },
  { icon: Library,       title: 'Smart Library',        color: 'bg-gradient-to-br from-amber-500 to-orange-600', light: 'bg-amber-50',  accent: 'text-amber-600', desc: 'Book catalog, issue tracking, and due dates.' },
  { icon: Calendar,      title: 'Results & Grading',    color: 'bg-gradient-to-br from-rose-500 to-pink-700',    light: 'bg-rose-50',   accent: 'text-rose-600', desc: 'Grade uploads, GPA calculations, transcripts.' },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-inter overflow-x-hidden">

      {/* ──────────────────────────────────────────────────────────
          NAVBAR
      ────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-blue-100/60">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-200 group-hover:shadow-blue-300 transition-all duration-300">
              <span className="text-white font-black text-xl">H</span>
            </div>
            <div>
              <p className="font-black text-xl text-slate-900 leading-none tracking-tight">HiSUP</p>
              <p className="text-[10px] font-bold text-blue-500 tracking-widest uppercase mt-0.5">HITEC University</p>
            </div>
          </Link>

          {/* Center links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(link => (
              <a key={link.label} href={link.href} className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors">
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm font-bold rounded-full shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5 transition-all duration-300"
          >
            Sign In <ArrowRight size={15} />
          </Link>
        </div>
      </nav>

      {/* ──────────────────────────────────────────────────────────
          HERO SECTION
      ────────────────────────────────────────────────────────── */}
      <section id="home" className="pt-32 pb-24 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute -top-40 -right-40 w-[700px] h-[700px] bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full opacity-50 blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-100 to-blue-200 rounded-full opacity-40 blur-[80px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col lg:flex-row items-center gap-16 relative z-10">
          
          {/* ── Left: Text Content ── */}
          <div className="flex-1 max-w-xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full mb-8">
              <Star size={13} className="text-blue-500 fill-blue-500" />
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">HITEC Smart University Portal</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.08] tracking-tight mb-6">
              Invest in{' '}
              <span className="relative">
                Knowledge
                <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full" />
              </span>{' '}
              and<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
                Your Future
              </span>
            </h1>

            <p className="text-lg text-slate-500 leading-relaxed mb-10 max-w-md">
              A centralized digital platform streamlining academic, administrative, and student services at HITEC University. Secure, modern, and intelligent.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-14">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold rounded-2xl text-base shadow-xl shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-1 transition-all duration-300"
              >
                Access Portal <ArrowRight size={18} />
              </Link>
              <a
                href="#modules"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-slate-200 text-slate-700 font-bold rounded-2xl text-base hover:border-blue-300 hover:text-blue-600 transition-all duration-300"
              >
                Explore Modules
              </a>
            </div>

            {/* ── Stats Row ── */}
            <div className="flex flex-wrap items-center gap-10 pt-6 border-t border-slate-100">
              {STATS.map((s, i) => (
                <div key={i} className="text-left">
                  <p className="text-2xl font-black text-slate-900">{s.value}</p>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Visual Card ── */}
          <div className="flex-1 flex items-center justify-center w-full max-w-lg lg:max-w-none relative">
            {/* Decorative circle behind */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[420px] h-[420px] rounded-full bg-gradient-to-br from-blue-100/80 to-indigo-200/60 border-4 border-blue-100" />
            </div>

            {/* Main card */}
            <div className="relative z-10 w-full max-w-md mx-auto">
              <div className="bg-white rounded-[2rem] shadow-2xl shadow-blue-100/60 p-8 border border-blue-50">
                {/* Window dots */}
                <div className="flex gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>

                {/* Fake header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="h-6 w-32 bg-slate-100 rounded-lg" />
                  <div className="h-8 w-24 bg-blue-500 rounded-lg" />
                </div>

                {/* Fake stat cards */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white">
                    <p className="text-2xl font-black">500+</p>
                    <p className="text-xs font-semibold text-blue-200 mt-1">Active Students</p>
                    <div className="mt-3 h-1.5 bg-blue-400/40 rounded-full">
                      <div className="h-1.5 bg-white/70 rounded-full w-3/4" />
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 text-white">
                    <p className="text-2xl font-black">50+</p>
                    <p className="text-xs font-semibold text-purple-200 mt-1">Courses Offered</p>
                    <div className="mt-3 h-1.5 bg-purple-400/40 rounded-full">
                      <div className="h-1.5 bg-white/70 rounded-full w-2/3" />
                    </div>
                  </div>
                </div>

                {/* Fake bar chart */}
                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">Enrollment Overview</p>
                  <div className="flex items-end gap-3 h-20">
                    {[55, 80, 60, 90, 70, 95, 75].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-lg"
                        style={{
                          height: `${h}%`,
                          background: i % 2 === 0
                            ? 'linear-gradient(to top, #3b82f6, #6366f1)'
                            : 'linear-gradient(to top, #93c5fd, #c4b5fd)',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl shadow-blue-100 px-5 py-3 flex items-center gap-2 border border-blue-50">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Shield size={16} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900">100% Secure</p>
                  <p className="text-[10px] text-slate-400">All data encrypted</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          MODULES SECTION
      ────────────────────────────────────────────────────────── */}
      <section id="modules" className="py-28 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Browse Core<br/>System Modules</h2>
            </div>
            <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 group shrink-0">
              Access All Modules
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <ChevronRight size={16} />
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MODULES.map((mod, i) => (
              <div
                key={i}
                className="group bg-white rounded-3xl p-8 border border-slate-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-50 hover:-translate-y-2 transition-all duration-400 cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-2xl ${mod.color} flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                  <mod.icon size={26} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{mod.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{mod.desc}</p>
                <div className={`mt-6 inline-flex items-center gap-1 text-sm font-bold ${mod.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                  Open Module <ArrowRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          WHY HISUP SECTION
      ────────────────────────────────────────────────────────── */}
      <section id="about" className="py-28 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-blue-50 to-transparent rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Left: Stats grid */}
            <div className="grid grid-cols-2 gap-5">
              {[
                { label: 'Secure Access',    desc: 'Role-based login & protected data',    icon: Shield,  color: 'from-blue-500 to-blue-700'    },
                { label: 'Always Fast',      desc: 'Optimized for thousands of users',     icon: Zap,     color: 'from-amber-500 to-orange-600'  },
                { label: 'Cloud Native',     desc: 'Access from any device, anywhere',     icon: Globe,   color: 'from-emerald-500 to-teal-600'  },
                { label: 'Fully Integrated', desc: 'All modules in one platform',          icon: Star,    color: 'from-violet-500 to-purple-700' },
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-3xl border border-slate-100 bg-slate-50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-md mb-5 group-hover:scale-110 transition-transform`}>
                    <item.icon size={22} className="text-white" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1">{item.label}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Right: Text */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full mb-6">
                <Star size={13} className="text-blue-500 fill-blue-500" />
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Why Choose HiSUP</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6 leading-tight">
                Built for<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Excellence.</span>
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed mb-6">
                HiSUP replaces fragmented legacy systems with a single, cohesive interface. Architected for speed, reliability, and security, ensuring students and faculty focus on what truly matters — education.
              </p>
              <p className="text-slate-500 leading-relaxed mb-10">
                Whether you are a student registering for courses, a faculty member managing grades, or an administrator overseeing operations, HiSUP provides an intuitive and seamless experience for all.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-1 transition-all duration-300"
              >
                Get Started Today <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          FOOTER
      ────────────────────────────────────────────────────────── */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <span className="text-white font-black text-sm">H</span>
            </div>
            <span className="font-bold text-white tracking-tight">HiSUP</span>
            <span className="text-slate-500 text-sm">— HITEC Smart University Portal</span>
          </div>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} HITEC University. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
