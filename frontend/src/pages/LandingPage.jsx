import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Calendar, DollarSign, Library, GraduationCap, Shield, Zap, Globe, LayoutDashboard } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Overview', href: '#home' },
  { label: 'Modules', href: '#modules' },
  { label: 'Why HiSUP', href: '#about' },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#030b1c] text-slate-200 selection:bg-cyan-500/30 font-inter">
      
      {/* ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
          NAVBAR
      ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */}
      <nav className="fixed top-0 inset-x-0 z-50 transition-all duration-300 bg-[#030b1c]/70 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)] group-hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] transition-all duration-300">
              <span className="text-white font-black text-xl">H</span>
            </div>
            <div>
              <h1 className="font-bold text-xl text-white tracking-tight leading-none">HiSUP</h1>
              <p className="text-[10px] text-cyan-400 font-semibold tracking-widest uppercase mt-0.5">Smart Portal</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(link => (
              <a key={link.label} href={link.href} className="text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors">
                {link.label}
              </a>
            ))}
          </div>

          <Link
            to="/login"
            className="group relative inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-cyan-400/50 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10">Access Portal</span>
            <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%]" />
          </Link>
        </div>
      </nav>

      {/* ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
          HERO SECTION
      ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */}
      <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/mtech-bg.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        />
        
        {/* Overlay Gradients */}
        <div className="absolute inset-0 z-0 bg-[#030b1c]/80 backdrop-blur-[2px]" />
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#030b1c] via-transparent to-[#030b1c]/50" />
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#030b1c] via-transparent to-[#030b1c]" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center mt-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-md mb-8 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Welcome to the Future of Education</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[1.05] mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            HITEC Smart <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
              University Portal
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            A unified digital ecosystem seamlessly connecting students, faculty, and administration through a modern, intelligent web platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-5 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_40px_rgba(6,182,212,0.5)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <LayoutDashboard size={20} />
              Login to Dashboard
            </Link>
            <a
              href="#modules"
              className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-2xl backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-3"
            >
              Explore Modules
            </a>
          </div>
        </div>

        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '4rem 4rem' }} />
      </section>

      {/* ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
          MODULES SECTION
      ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */}
      <section id="modules" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Ecosystem Modules</h2>
            <p className="text-slate-400 text-lg">Comprehensive tools designed to transform and streamline every aspect of university operations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Users, title: 'Student Management', color: 'from-blue-500 to-blue-600', desc: 'Centralized profiles, enrollment history, and academic tracking.' },
              { icon: BookOpen, title: 'Course Registration', color: 'from-indigo-500 to-indigo-600', desc: 'Seamless online registration, capacity monitoring, and prerequisites.' },
              { icon: GraduationCap, title: 'Faculty & Departments', color: 'from-purple-500 to-purple-600', desc: 'Manage teaching assignments, departmental structures, and faculty roles.' },
              { icon: DollarSign, title: 'Financial Center', color: 'from-emerald-500 to-emerald-600', desc: 'Fee structures, payment verification, and revenue analytics.' },
              { icon: Library, title: 'Smart Library', color: 'from-amber-500 to-amber-600', desc: 'Digital catalog, issue tracking, and automated due date monitoring.' },
              { icon: Calendar, title: 'Results & Grading', color: 'from-rose-500 to-rose-600', desc: 'Faculty grade uploads, GPA calculations, and student transcripts.' },
            ].map((mod, i) => (
              <div key={i} className="group relative p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-20 blur-[50px] group-hover:opacity-40 transition-opacity duration-500 rounded-full translate-x-1/2 -translate-y-1/2" />
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${mod.color} flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                  <mod.icon size={26} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{mod.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{mod.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
          WHY HISUP SECTION
      ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */}
      <section id="about" className="py-32 relative border-t border-white/5 bg-[#020713]">
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight">Built for <br/><span className="text-cyan-400">Excellence.</span></h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              HiSUP replaces fragmented legacy systems with a single, cohesive interface. It is architected for speed, reliability, and security, ensuring that students and faculty can focus on what truly matters: education.
            </p>
            <ul className="flex flex-col gap-8">
              {[
                { icon: Shield, title: 'Enterprise-Grade Security', text: 'Role-based access control and encrypted data storage.' },
                { icon: Zap, title: 'Lightning Fast', text: 'Optimized performance for thousands of concurrent users.' },
                { icon: Globe, title: 'Cloud Native', text: 'Accessible from anywhere, on any device, at any time.' }
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0 border border-cyan-500/20">
                    <item.icon size={18} className="text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">{item.title}</h4>
                    <p className="text-slate-400 text-sm">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 relative w-full max-w-lg mx-auto mt-12 lg:mt-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 rounded-full blur-[100px] animate-pulse" />
            <div className="relative w-full min-h-[450px] bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-sm p-10 shadow-2xl flex flex-col overflow-hidden">
               {/* Mockup UI Window */}
               <div className="flex gap-2 mb-8">
                 <div className="w-3 h-3 rounded-full bg-rose-500" />
                 <div className="w-3 h-3 rounded-full bg-amber-500" />
                 <div className="w-3 h-3 rounded-full bg-emerald-500" />
               </div>
               <div className="space-y-4 flex-1">
                 <div className="h-8 w-1/3 bg-white/10 rounded-lg animate-pulse" />
                 <div className="h-4 w-full bg-white/5 rounded-full" />
                 <div className="h-4 w-5/6 bg-white/5 rounded-full" />
                 <div className="h-4 w-4/6 bg-white/5 rounded-full mb-8" />
                 
                 <div className="grid grid-cols-2 gap-4">
                   <div className="h-24 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl border border-white/5" />
                   <div className="h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl border border-white/5" />
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
          FOOTER
      ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */}
      <footer className="border-t border-white/5 bg-[#030b1c] py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <span className="text-white font-black text-xs">H</span>
            </div>
            <span className="font-bold text-sm text-white tracking-tight">HiSUP</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">
            ┬⌐ {new Date().getFullYear()} HITEC University. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
