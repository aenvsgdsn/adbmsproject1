import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Loader2, GraduationCap, ArrowRight, BookOpen, Users, BarChart2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const PERKS = [
  { icon: GraduationCap, text: 'Track grades & academic progress' },
  { icon: BarChart2,     text: 'Real-time analytics & insights' },
  { icon: BookOpen,      text: 'Library & campus management' },
  { icon: ShieldCheck,   text: 'Enterprise-grade security' },
];

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.username}!`);
      navigate('/dashboard');
    } catch (err) {
      const errorData = err?.response?.data?.error;
      const errorMessage = typeof errorData === 'string'
        ? errorData
        : (errorData?.message || 'Login failed. Check your credentials.');
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-inter bg-zinc-50 relative overflow-hidden"
      style={{
        backgroundImage: `
          radial-gradient(circle at 15% 50%, rgba(99, 102, 241, 0.08), transparent 25%),
          radial-gradient(circle at 85% 30%, rgba(79, 70, 229, 0.08), transparent 25%)
        `
      }}
    >
      {/* ── Left — Form Panel ─────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative z-10">
        
        {/* Mobile Logo */}
        <div className="absolute top-8 left-8 flex items-center gap-3 lg:hidden animate-fade-in-up">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-violet"
            style={{ background: 'linear-gradient(135deg, var(--violet-500), var(--violet-700))' }}>
            <GraduationCap className="text-white" size={20} />
          </div>
          <span className="font-jakarta font-extrabold text-xl text-zinc-900 tracking-tight">HiSUP</span>
        </div>

        <div className="w-full max-w-md animate-slide-up">
          {/* Header */}
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-violet-200 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-violet-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-violet-700">Access Portal</span>
            </div>
            <h1 className="text-4xl font-extrabold text-zinc-900 tracking-tight mb-3">Welcome Back</h1>
            <p className="text-zinc-500 text-[15px] font-medium">Enter your credentials to securely sign in.</p>
          </div>

          {/* Form */}
          <div className="glass rounded-[28px] p-8 sm:p-10 mb-8 border border-white shadow-card">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-group">
                <label htmlFor="login-email" className="form-label mb-1">Email Address</label>
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  className="form-input text-lg py-4 px-5"
                  placeholder="name@university.edu"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="login-password" className="form-label mb-0">Password</label>
                  <a href="#" className="text-[13px] font-bold text-violet-600 hover:text-violet-800 transition-colors">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="form-input text-lg py-4 px-5 pr-12"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-violet-600 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
              </div>

              <button
                id="login-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-br from-violet-600 to-violet-800 text-white font-bold py-4 px-6 rounded-2xl shadow-violet hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-4 text-lg border border-violet-500"
              >
                {loading ? (
                  <><Loader2 size={22} className="animate-spin" /> Authenticating...</>
                ) : (
                  <><span>Sign In securely</span><ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" /></>
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-[15px] font-medium text-zinc-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-violet-600 font-bold hover:text-violet-800 transition-colors">
              Request access
            </Link>
          </p>
        </div>
      </div>

      {/* ── Right — Branding Panel ─────────────────────────── */}
      <div className="hidden lg:flex w-[50%] flex-col justify-between p-16 relative overflow-hidden glass-panel-dark border-l border-white/10"
        style={{ 
          background: 'linear-gradient(145deg, #312e81 0%, #4338ca 40%, #3730a3 100%)',
        }}
      >
        {/* Frosty overlays / blobs */}
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />
        
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-violet-400/20 rounded-full blur-[100px] pointer-events-none animate-float" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-400/20 rounded-full blur-[80px] pointer-events-none animate-float" style={{ animationDelay: '2s' }} />
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border-[1px] border-white/5 animate-spin-slow pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border-[2px] border-white/5 animate-spin-slow pointer-events-none" style={{ animationDirection: 'reverse', animationDuration: '25s' }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-4 animate-fade-in-up">
          <div className="w-12 h-12 glass border border-white/30 rounded-2xl flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
            <GraduationCap className="text-white" size={26} />
          </div>
          <div>
            <span className="text-white font-jakarta font-extrabold text-3xl tracking-tight leading-none block">HiSUP</span>
            <span className="text-violet-300 text-xs font-bold tracking-[0.2em] uppercase">Enterprise</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-5xl font-jakarta font-extrabold text-white leading-[1.15] mb-6 tracking-tight text-shadow-sm">
            Next-Generation<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-200 to-indigo-200">Campus Intelligence.</span>
          </h2>
          <p className="text-violet-100/80 text-lg leading-relaxed mb-12 max-w-md font-medium">
            A unified, frosted-glass platform to seamlessly manage your academic journey, student services, and institutional administration.
          </p>

          {/* Feature Perks List */}
          <div className="flex flex-col gap-5">
            {PERKS.map(({ icon: Icon, text }, i) => (
              <div key={text} className="flex items-center gap-4 animate-slide-in-right" style={{ animationDelay: `${0.2 + (i * 0.1)}s` }}>
                <div className="w-10 h-10 rounded-xl glass border border-white/20 flex items-center justify-center shrink-0 shadow-sm">
                  <Icon size={20} className="text-violet-100" />
                </div>
                <span className="text-white text-[15px] font-bold tracking-wide">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex justify-between items-end animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <p className="text-violet-200/50 text-sm font-bold tracking-widest uppercase">© {new Date().getFullYear()} HiSUP University</p>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-white/20" />
            <div className="w-2 h-2 rounded-full bg-white/50" />
            <div className="w-8 h-2 rounded-full bg-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
