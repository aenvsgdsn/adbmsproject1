import { Link } from 'react-router-dom';

/* ── HiSUP Nav Links ── */
const NAV_LINKS = [
  { label: 'Home', href: '#' },
  { label: 'Explore Features', href: '#' },
  { label: 'About HiSUP', href: '#' },
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
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,180,216,0.3)] border border-cyan-500/30">
              <span className="text-white font-extrabold text-lg tracking-tighter">
                H
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-white leading-tight tracking-tight">HiSUP</span>
              <span className="text-[10px] text-zinc-400 font-medium tracking-wide">HITEC University</span>
            </div>
          </div>

          {/* Center links */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map(({ label }, idx) => (
              <a key={label} href="#"
                className={`text-[13px] font-bold flex items-center gap-1 transition-colors duration-200 ${idx === 0 ? 'text-cyan-400' : 'text-zinc-300 hover:text-white'}`}>
                {label}
              </a>
            ))}
          </div>

          {/* Access Portal CTA */}
          <Link
            to="/login"
            className="flex items-center justify-center text-sm font-bold text-white px-7 py-3 rounded-full transition-all duration-300 hover:scale-105"
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
        className="relative min-h-screen flex items-center pt-20"
      >
        {/* Background Image (Kept from current design) */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/mtech-bg.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 1,
          }}
        />

        {/* Deep gradient overlay to ensure text readability on the left */}
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
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#00b4d8]">
                WELCOME TO HISUP
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-[1.1] tracking-tight mb-6 animate-fade-in-up">
              HITEC Smart <br />
              <span className="text-[#00b4d8]">University Portal</span>
            </h1>

            <p className="text-[16px] text-blue-100/80 max-w-lg mb-10 leading-[1.8] font-medium animate-fade-in-up"
              style={{ animationDelay: '0.1s' }}>
              A centralized digital platform designed to streamline academic, administrative, and student services at HITEC University. Access resources through a modern, secure, and intelligent web-based system.
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <Link
                to="/login"
                className="inline-flex items-center justify-center font-bold text-white px-8 py-3.5 rounded-xl text-[15px] transition-all duration-300 hover:-translate-y-1"
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

    </div>
  );
};

export default LandingPage;
