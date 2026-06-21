import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, Users, LayoutDashboard, ArrowRight, ShieldCheck, Zap, BarChart2, CalendarCheck, DollarSign, Star, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const NAV_LINKS = ['Features', 'About', 'Contact'];

const FEATURES = [
  {
    icon: Users,
    title: 'Student Portal',
    desc: 'Access grades, attendance records, fee statements, and campus announcements in real-time from one unified dashboard.',
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    iconColor: 'text-violet-600',
  },
  {
    icon: BookOpen,
    title: 'Faculty Hub',
    desc: 'Manage classes effortlessly, record attendance, upload grades, and communicate directly with enrolled students.',
    color: 'from-indigo-500 to-blue-600',
    bg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
  },
  {
    icon: LayoutDashboard,
    title: 'Admin Control',
    desc: 'Complete institutional oversight — from finance & library to hostel management, user roles, and system audit logs.',
    color: 'from-fuchsia-500 to-violet-600',
    bg: 'bg-fuchsia-50',
    iconColor: 'text-fuchsia-600',
  },
  {
    icon: DollarSign,
    title: 'Finance Management',
    desc: 'Track tuition fees, approve payments, generate fee structures, and maintain transparent financial records.',
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    icon: CalendarCheck,
    title: 'Attendance Tracking',
    desc: 'Mark and monitor attendance by section and date. Students and faculty get instant visibility on attendance status.',
    color: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    icon: BarChart2,
    title: 'Results & Analytics',
    desc: 'Publish grades, calculate GPA, and generate insightful reports that help advisors and students track academic progress.',
    color: 'from-sky-500 to-cyan-600',
    bg: 'bg-sky-50',
    iconColor: 'text-sky-600',
  },
];

const STATS = [
  { value: '10K+', label: 'Students Enrolled' },
  { value: '500+', label: 'Faculty Members' },
  { value: '99.9%', label: 'System Uptime' },
  { value: '50+', label: 'Departments' },
];

const TESTIMONIALS = [
  {
    name: 'Dr. Anwar Shah',
    role: 'Dean of Academics',
    text: 'HiSUP transformed how we manage our campus. The admin dashboard gives us real-time visibility into everything.',
    rating: 5,
  },
  {
    name: 'Aisha Malik',
    role: 'Student, CS Dept.',
    text: 'I can check my grades, attendance, and fees all in one place. It is incredibly convenient and beautifully designed.',
    rating: 5,
  },
  {
    name: 'Prof. Khalid Rehman',
    role: 'Faculty, Engineering',
    text: 'Marking attendance and uploading grades used to take hours. With HiSUP, it takes minutes.',
    rating: 5,
  },
];

const FeatureCard = ({ icon: Icon, title, desc, bg, iconColor, delay }) => (
  <div
    className="group bg-white rounded-2xl p-7 border border-zinc-200 hover:border-violet-200 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(124,58,237,0.10)] hover:-translate-y-1"
    style={{ animation: `fade-in-up 0.7s ease-out ${delay}s both` }}
  >
    <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
      <Icon className={iconColor} size={24} />
    </div>
    <h3 className="text-lg font-bold text-zinc-900 mb-2">{title}</h3>
    <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa] font-inter text-zinc-800 overflow-x-hidden">

      {/* ── Floating Navbar ─────────────────────────────────── */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className={`flex justify-between items-center px-5 py-3 rounded-2xl transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-sm border border-zinc-200/80' : 'bg-transparent'}`}>
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                <GraduationCap className="text-white" size={19} />
              </div>
              <span className="font-extrabold text-xl text-zinc-900 tracking-tight">
                HiSUP <span className="text-violet-600 font-black">2.0</span>
              </span>
            </div>

            {/* Links */}
            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map(l => (
                <a key={l} href={`#${l.toLowerCase()}`} className="text-sm font-semibold text-zinc-500 hover:text-violet-600 transition-colors duration-200">
                  {l}
                </a>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-bold text-zinc-600 hover:text-violet-600 transition-colors px-3 py-1.5 rounded-xl hover:bg-violet-50">
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-sm bg-gradient-to-br from-violet-600 to-purple-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-violet-500/20 hover:shadow-violet-500/40 hover:-translate-y-0.5 transition-all duration-200"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-violet-200/30 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 left-10 w-[400px] h-[400px] bg-purple-200/25 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-100/20 rounded-full blur-[150px]" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Text */}
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-50 border border-violet-100 mb-8 animate-fade-in-up">
              <span className="flex h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-violet-600">University ERP Platform</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold text-zinc-900 mb-6 leading-[1.08] tracking-tight animate-fade-in-up" style={{ animationDelay: '0.08s' }}>
              Manage Your Campus<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600">Smarter & Faster</span>
            </h1>

            <p className="text-lg text-zinc-500 max-w-lg mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.16s' }}>
              HiSUP 2.0 unifies every aspect of university operations — academics, finance, library, hostel, and more — into one beautifully designed platform.
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: '0.24s' }}>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-gradient-to-br from-violet-600 to-purple-700 text-white px-7 py-3.5 rounded-2xl font-bold text-base shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-0.5 transition-all duration-200"
              >
                Start for Free <ArrowRight size={18} />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-white text-zinc-700 border border-zinc-200 px-7 py-3.5 rounded-2xl font-bold text-base hover:border-violet-300 hover:text-violet-700 hover:bg-violet-50 transition-all duration-200"
              >
                Access Portal
              </Link>
            </div>

            {/* Social Proof Row */}
            <div className="flex items-center gap-4 mt-10 animate-fade-in-up" style={{ animationDelay: '0.32s' }}>
              <div className="flex -space-x-2">
                {['A','B','C','D'].map((l, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold ${['bg-violet-500','bg-purple-500','bg-indigo-500','bg-fuchsia-500'][i]}`}>{l}</div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} className="fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-xs text-zinc-500 font-medium">Trusted by <span className="font-bold text-zinc-800">10,000+</span> students & faculty</p>
              </div>
            </div>
          </div>

          {/* Right — Floating cards mockup */}
          <div className="hidden lg:flex flex-col gap-4 relative animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {/* Main card */}
            <div className="bg-white rounded-3xl border border-zinc-200 shadow-xl shadow-zinc-200/60 p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Today's Overview</p>
                  <h3 className="text-xl font-extrabold text-zinc-900">Dashboard</h3>
                </div>
                <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                  <LayoutDashboard size={20} className="text-violet-600" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Students', val: '3,240', color: 'bg-violet-50 text-violet-600' },
                  { label: 'Faculty', val: '128', color: 'bg-indigo-50 text-indigo-600' },
                  { label: 'Courses', val: '64', color: 'bg-fuchsia-50 text-fuchsia-600' },
                ].map(s => (
                  <div key={s.label} className={`${s.color} rounded-xl p-3 text-center`}>
                    <p className="text-lg font-extrabold leading-tight">{s.val}</p>
                    <p className="text-[10px] font-semibold opacity-70 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
              {/* Mini bar chart */}
              <div className="mt-5">
                <p className="text-xs font-semibold text-zinc-400 mb-2">Attendance Rate (This Week)</p>
                <div className="flex items-end gap-1.5 h-12">
                  {[65, 80, 70, 90, 85, 75, 88].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t-md bg-violet-100" style={{ height: `${h}%` }}>
                      <div className="w-full h-full rounded-t-md bg-gradient-to-t from-violet-600 to-violet-400 opacity-80" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Two small cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-violet-600 to-purple-700 text-white rounded-2xl p-5">
                <CheckCircle2 size={22} className="mb-3 opacity-80" />
                <p className="text-2xl font-extrabold">94%</p>
                <p className="text-xs font-semibold opacity-75 mt-1">Avg. Attendance</p>
              </div>
              <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
                <DollarSign size={22} className="mb-3 text-emerald-500" />
                <p className="text-2xl font-extrabold text-zinc-900">₨ 2.1M</p>
                <p className="text-xs font-semibold text-zinc-400 mt-1">Fees Collected</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ───────────────────────────────────────── */}
      <section className="py-14 border-y border-zinc-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-4xl font-extrabold text-zinc-900 tracking-tight">{value}</p>
              <p className="text-sm text-zinc-500 font-medium mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────── */}
      <section id="features" className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-50 border border-violet-100 mb-5">
              <span className="text-xs font-bold uppercase tracking-widest text-violet-600">Platform Capabilities</span>
            </div>
            <h2 className="text-4xl font-extrabold text-zinc-900 mb-4 tracking-tight">Everything Your Campus Needs</h2>
            <p className="text-zinc-500 max-w-xl mx-auto text-base font-medium">
              Built with modern technology to deliver a seamless experience for every role — student, faculty, finance, or admin.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ delay, ...f }, i) => (
              <FeatureCard key={f.title} {...f} delay={i * 0.08} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────── */}
      <section id="about" className="py-24 bg-white border-y border-zinc-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-50 border border-violet-100 mb-5">
              <span className="text-xs font-bold uppercase tracking-widest text-violet-600">Testimonials</span>
            </div>
            <h2 className="text-4xl font-extrabold text-zinc-900 mb-4 tracking-tight">Loved by Our Community</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, role, text, rating }) => (
              <div key={name} className="bg-white rounded-2xl p-7 border border-zinc-200 hover:border-violet-200 hover:shadow-[0_8px_32px_rgba(124,58,237,0.08)] transition-all duration-300">
                <div className="flex items-center gap-1 mb-5">
                  {[...Array(rating)].map((_, i) => <Star key={i} size={14} className="fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-zinc-600 text-sm leading-relaxed mb-6 italic">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                    {name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-900">{name}</p>
                    <p className="text-xs text-zinc-400 font-medium">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Section ───────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-300/20 rounded-full blur-3xl" />
        </div>
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-white mb-3 tracking-tight">Secure. Fast. Reliable.</h2>
            <p className="text-white/70 text-base font-medium">Enterprise-grade infrastructure powering your institution.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, color: 'text-emerald-300', title: 'Enterprise Security', desc: 'Bank-level encryption with JWT authentication and role-based access control.' },
              { icon: Zap, color: 'text-amber-300', title: 'Lightning Fast', desc: 'Optimized Supabase backend delivering sub-100ms API responses.' },
              { icon: LayoutDashboard, color: 'text-violet-200', title: 'Intuitive Design', desc: 'A modern UI that requires zero training — beautiful and functional.' },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-7 text-center hover:bg-white/15 transition-all duration-200">
                <Icon size={32} className={`${color} mx-auto mb-4`} />
                <p className="font-bold text-white text-lg mb-2">{title}</p>
                <p className="text-white/65 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ─────────────────────────────────────── */}
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-50 border border-violet-100 mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-violet-600">Get Started Today</span>
          </div>
          <h2 className="text-4xl font-extrabold text-zinc-900 mb-5 tracking-tight">Ready to Elevate Your Campus?</h2>
          <p className="text-zinc-500 text-base mb-10 leading-relaxed max-w-xl mx-auto">
            Join thousands of students and faculty already using HiSUP 2.0 to streamline their academic journey.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-gradient-to-br from-violet-600 to-purple-700 text-white px-8 py-4 rounded-2xl font-bold text-base shadow-xl shadow-violet-500/25 hover:shadow-violet-500/45 hover:-translate-y-0.5 transition-all duration-200"
            >
              Create Free Account <ArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-white text-zinc-700 border border-zinc-200 px-8 py-4 rounded-2xl font-bold text-base hover:border-violet-300 hover:text-violet-700 hover:bg-violet-50 transition-all duration-200"
            >
              Sign In to Portal
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="border-t border-zinc-200 bg-zinc-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-700 rounded-xl flex items-center justify-center shadow-md shadow-violet-400/20">
                <GraduationCap className="text-white" size={16} />
              </div>
              <span className="font-extrabold text-lg text-zinc-800">HiSUP <span className="text-violet-600">2.0</span></span>
            </div>
            <p className="text-zinc-400 text-sm font-medium">© {new Date().getFullYear()} HiSUP Educational Systems. All rights reserved.</p>
            <div className="flex gap-7 text-sm font-bold text-zinc-400">
              <a href="#" className="hover:text-violet-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-violet-600 transition-colors">Terms</a>
              <a href="#" className="hover:text-violet-600 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
