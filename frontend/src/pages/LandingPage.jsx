import { Link } from 'react-router-dom';

/* ── HiSUP Nav Links ── */
const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Explore Features', href: '#explore' },
  { label: 'About HiSUP', href: '#about' },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen font-inter overflow-hidden bg-[#07193f]">

      {/* ══════════════════════════════════════════════════════
           NAVBAR (HiSUP)
      ══════════════════════════════════════════════════════ */}
      <nav className="absolute top-0 inset-x-0 z-50">
        <div className="flex items-center justify-between px-6 md:px-10 h-24">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,180,216,0.3)] border border-cyan-500/30">
              <span className="text-white font-extrabold text-xl tracking-tighter">
                H
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-white leading-tight tracking-tight">HiSUP</span>
              <span className="text-[12px] text-zinc-400 font-medium tracking-wide">HITEC University</span>
            </div>
          </div>

          {/* Center links - INCREASED SIZE */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map(({ label, href }, idx) => (
              <a key={label} href={href}
                className={`text-[15px] font-bold flex items-center gap-1 transition-colors duration-200 ${idx === 0 ? 'text-cyan-400' : 'text-zinc-300 hover:text-white'}`}>
                {label}
              </a>
            ))}
          </div>

          {/* Access Portal CTA - INCREASED SIZE */}
          <Link
            to="/login"
            className="flex items-center justify-center text-[16px] font-bold text-white px-8 py-3.5 rounded-full transition-all duration-300 hover:scale-105"
            style={{
              background: '#00b4d8',
              boxShadow: '0 4px 20px rgba(0,180,216,0.4)',
            }}
          >
            Access Portal
          </Link>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════
           HERO SECTION (HiSUP)
      ══════════════════════════════════════════════════════ */}
      <section
        id="home"
        className="relative min-h-screen flex items-center pt-20"
      >
        {/* Background Image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/mtech-bg.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 1,
          }}
        />

        {/* Deep gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(7,25,63,0.95) 0%, rgba(7,25,63,0.60) 50%, rgba(7,25,63,0.10) 100%)',
          }}
        />

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="max-w-2xl">
            
            {/* Top Badge */}
            <div className="inline-flex items-center px-4 py-1.5 rounded-full mb-8"
              style={{ background: 'rgba(0,180,216,0.15)', border: '1px solid rgba(0,180,216,0.3)' }}>
              <span className="text-[12px] font-extrabold uppercase tracking-widest text-[#00b4d8]">
                WELCOME TO HISUP
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-[1.1] tracking-tight mb-6 animate-fade-in-up">
              HITEC Smart <br />
              <span className="text-[#00b4d8]">University Portal</span>
            </h1>

            <p className="text-[18px] text-blue-100/80 max-w-lg mb-10 leading-[1.8] font-medium animate-fade-in-up"
              style={{ animationDelay: '0.1s' }}>
              A centralized digital platform designed to streamline academic, administrative, and student services at HITEC University. Access resources through a modern, secure, and intelligent web-based system.
            </p>

            {/* Actions - INCREASED SIZE */}
            <div className="flex flex-wrap items-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <Link
                to="/login"
                className="inline-flex items-center justify-center font-bold text-white px-10 py-4 rounded-xl text-[17px] transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: '#00b4d8',
                  boxShadow: '0 8px 25px rgba(0,180,216,0.3)',
                }}
              >
                Access Portal
              </Link>
            </div>

          </div>
        </div>

        {/* Bottom wave decorative element */}
        <div className="absolute bottom-0 inset-x-0 pointer-events-none" style={{ lineHeight: 0 }}>
          <svg viewBox="0 0 1440 80" className="w-full h-[60px] md:h-[80px]" preserveAspectRatio="none">
            <path d="M0,80 L0,40 C240,60 480,20 720,40 C960,60 1200,20 1440,30 L1440,80 Z" fill="#ffffff" />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
           EXPLORE FEATURES SECTION
      ══════════════════════════════════════════════════════ */}
      <section id="explore" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-extrabold text-[#07193f] mb-4">Core Modules</h2>
            <p className="text-lg text-zinc-600">
              Transforming University Operations Through Technology
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-zinc-50 rounded-2xl p-8 border border-zinc-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <h3 className="text-xl font-bold text-[#07193f] mb-3">Student Management</h3>
              <p className="text-zinc-600 leading-relaxed">Manage student profiles, academic records, enrollment information, attendance, and performance history.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-zinc-50 rounded-2xl p-8 border border-zinc-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
              </div>
              <h3 className="text-xl font-bold text-[#07193f] mb-3">Course Registration</h3>
              <p className="text-zinc-600 leading-relaxed">Enable students to browse available courses, register online, and monitor enrollment status.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-zinc-50 rounded-2xl p-8 border border-zinc-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3 className="text-xl font-bold text-[#07193f] mb-3">Faculty Management</h3>
              <p className="text-zinc-600 leading-relaxed">Maintain faculty profiles, department assignments, teaching schedules, and workload management.</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-zinc-50 rounded-2xl p-8 border border-zinc-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <h3 className="text-xl font-bold text-[#07193f] mb-3">Fee Management</h3>
              <p className="text-zinc-600 leading-relaxed">Track fee structures, payment histories, pending dues, and financial reports efficiently.</p>
            </div>

            {/* Feature 5 */}
            <div className="bg-zinc-50 rounded-2xl p-8 border border-zinc-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              </div>
              <h3 className="text-xl font-bold text-[#07193f] mb-3">Library Services</h3>
              <p className="text-zinc-600 leading-relaxed">Manage book inventories, issue and return records, overdue tracking, and library memberships.</p>
            </div>

            {/* Feature 6 */}
            <div className="bg-zinc-50 rounded-2xl p-8 border border-zinc-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <h3 className="text-xl font-bold text-[#07193f] mb-3">Result Management</h3>
              <p className="text-zinc-600 leading-relaxed">Facilitate grade submission, transcript generation, GPA calculation, and academic reporting.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
           ABOUT SECTION
      ══════════════════════════════════════════════════════ */}
      <section id="about" className="py-24 bg-[#07193f] relative overflow-hidden">
        {/* Background ambient light */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full mb-6"
              style={{ background: 'rgba(0,180,216,0.15)', border: '1px solid rgba(0,180,216,0.3)' }}>
              <span className="text-[12px] font-extrabold uppercase tracking-widest text-[#00b4d8]">
                ABOUT HISUP
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-8">
              Why Choose <span className="text-[#00b4d8]">HiSUP?</span>
            </h2>
            <p className="text-lg text-blue-100/80 leading-relaxed mb-8">
              The HITEC Smart University Portal (HiSUP) is a comprehensive university management solution developed to digitize and automate essential academic and administrative processes. The platform enhances efficiency, transparency, and accessibility by integrating multiple university services into a single secure system.
            </p>
            <p className="text-lg text-blue-100/80 leading-relaxed">
              Whether you are a student registering for courses, a faculty member managing grades, or an administrator overseeing university operations, HiSUP provides an intuitive and seamless experience.
            </p>
          </div>
          
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {/* Value Props */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h4 className="text-white font-bold text-lg mb-2">Secure</h4>
              <p className="text-sm text-blue-100/60 leading-relaxed">Advanced authentication and role-based authorization ensure data protection and privacy.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h4 className="text-white font-bold text-lg mb-2">Efficient</h4>
              <p className="text-sm text-blue-100/60 leading-relaxed">Automates repetitive administrative tasks and reduces paperwork.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h4 className="text-white font-bold text-lg mb-2">Accessible</h4>
              <p className="text-sm text-blue-100/60 leading-relaxed">Available anytime and anywhere through an internet-connected device.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h4 className="text-white font-bold text-lg mb-2">Integrated</h4>
              <p className="text-sm text-blue-100/60 leading-relaxed">Combines all university operations into a single centralized platform.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#05112a] border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <p className="text-sm text-zinc-500 font-medium">
            © {new Date().getFullYear()} HITEC University. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
