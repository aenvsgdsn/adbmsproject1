import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, Users, LayoutDashboard, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <div 
    className="group relative bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-white/40 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
    style={{ animation: `fade-in-up 0.8s ease-out ${delay}s both` }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative z-10">
      <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500">
        <Icon className="text-blue-600" size={28} />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-3 font-outfit tracking-tight">{title}</h3>
      <p className="text-slate-600 leading-relaxed text-sm">
        {description}
      </p>
    </div>
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
    <div className="min-h-screen bg-[#f8fafc] font-inter text-slate-800 overflow-x-hidden selection:bg-blue-200">
      {/* Floating Glass Navbar */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'py-3' : 'py-5'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center px-6 py-3 rounded-2xl transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-lg border border-white/50' : 'bg-transparent'}`}>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <GraduationCap className="text-white" size={20} />
              </div>
              <span className="font-extrabold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-900 font-outfit tracking-tight">
                HiSUP
              </span>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <a href="#" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">Home</a>
              <a href="#features" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#about" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">About</a>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="text-sm bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-0.5">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-300/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-300/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-purple-300/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-4000" />

        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/40 shadow-sm mb-8 animate-fade-in-up">
             <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
             <span className="text-xs font-bold uppercase tracking-widest text-slate-600">The Modern Standard</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-extrabold text-slate-900 font-outfit mb-6 tracking-tight leading-[1.1] animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Elevate Your <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">Digital Campus</span>
          </h1>
          
          <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-medium animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            A unified, lightning-fast management system that brings administration, faculty, and students into perfect harmony.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg min-w-[220px] hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1">
              Start Your Journey <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="inline-flex items-center justify-center gap-2 bg-white/90 backdrop-blur-md text-slate-700 border border-white/70 shadow-sm px-8 py-4 rounded-2xl font-bold text-lg min-w-[220px] hover:bg-white hover:border-blue-200 hover:text-blue-600 transition-all duration-300 transform hover:-translate-y-1">
              Access Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 font-outfit mb-4 tracking-tight">Everything You Need</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">Built with cutting-edge technology to provide a seamless experience for every role in your institution.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Users} 
              title="Student Portal" 
              description="Access course materials, check grades, track attendance, and stay updated with campus announcements in real-time."
              delay={0.1}
            />
            <FeatureCard 
              icon={BookOpen} 
              title="Faculty Hub" 
              description="Manage classes seamlessly, upload resources, grade assignments efficiently, and communicate with your students directly."
              delay={0.2}
            />
            <FeatureCard 
              icon={LayoutDashboard} 
              title="Admin Control" 
              description="Complete oversight of university operations, from finance and library management to user roles and comprehensive system audits."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-slate-900" />
         <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
            <h2 className="text-3xl font-bold font-outfit mb-12">Secure. Fast. Reliable.</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-slate-400">
               <div className="flex flex-col items-center gap-3">
                  <ShieldCheck size={32} className="text-emerald-400" />
                  <span className="font-bold text-white">Enterprise Security</span>
                  <span className="text-sm text-center">Your data is protected with bank-level encryption.</span>
               </div>
               <div className="flex flex-col items-center gap-3">
                  <Zap size={32} className="text-amber-400" />
                  <span className="font-bold text-white">Lightning Fast</span>
                  <span className="text-sm text-center">Optimized architecture for zero-lag performance.</span>
               </div>
               <div className="flex flex-col items-center gap-3">
                  <LayoutDashboard size={32} className="text-blue-400" />
                  <span className="font-bold text-white">Intuitive Design</span>
                  <span className="text-sm text-center">A beautiful interface that requires zero training.</span>
               </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 text-center border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-6 opacity-80">
            <GraduationCap className="text-slate-400" size={24} />
            <span className="font-extrabold text-xl text-slate-400 font-outfit tracking-widest uppercase">HiSUP</span>
          </div>
          <p className="mb-6 text-slate-500 text-sm font-medium">&copy; {new Date().getFullYear()} HiSUP Educational Systems. All rights reserved.</p>
          <div className="flex justify-center gap-8 text-sm font-bold text-slate-400">
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
