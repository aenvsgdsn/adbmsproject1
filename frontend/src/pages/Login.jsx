import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Loader2, GraduationCap, ArrowRight, BookOpen, Users, BarChart2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const DEMO_ACCOUNTS = [
  { role: 'Admin',   email: 'admin@hisup.edu',   password: 'admin123',    color: 'bg-rose-500' },
  { role: 'Faculty', email: 'faculty@hisup.edu',  password: 'password123', color: 'bg-indigo-500' },
  { role: 'Student', email: 'student@hisup.edu',  password: 'password123', color: 'bg-violet-500' },
  { role: 'Finance', email: 'finance@hisup.edu',  password: 'password123', color: 'bg-emerald-500' },
];

const PERKS = [
  { icon: GraduationCap, text: 'Track grades & academic progress' },
  { icon: BarChart2,     text: 'Real-time analytics & reports' },
  { icon: BookOpen,      text: 'Library & hostel management' },
  { icon: Users,         text: 'Multi-role access control' },
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
    <div className="min-h-screen flex font-inter bg-[#fafafa]">

      {/* ── Left — Form Panel ─────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
        {/* Top-left logo (mobile visible) */}
        <div className="absolute top-6 left-6 flex items-center gap-2 lg:hidden">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br from-violet-600 to-purple-700 shadow-md shadow-violet-400/25">
            <GraduationCap className="text-white" size={16} />
          </div>
          <span className="font-extrabold text-lg text-zinc-900">HiSUP <span className="text-violet-600">2.0</span></span>
        </div>

        <div className="w-full max-w-md animate-slide-up">
          {/* Header */}
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-violet-600 mb-3">Welcome Back</p>
            <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight mb-2">Sign in to your account</h1>
            <p className="text-zinc-500 text-sm">Enter your credentials to access the portal</p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-7 mb-5">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="form-group">
                <label htmlFor="login-email" className="form-label">Email Address</label>
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="you@university.edu"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <div className="flex justify-between items-center mb-1.5">
                  <label htmlFor="login-password" className="form-label mb-0">Password</label>
                  <a href="#" className="text-xs font-semibold text-violet-600 hover:text-violet-800 transition-colors">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="form-input pr-11"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <button
                id="login-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-br from-violet-600 to-purple-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-violet-500/45 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none mt-1 text-sm"
              >
                {loading ? (
                  <><Loader2 size={17} className="animate-spin" /> Signing in...</>
                ) : (
                  <><span>Sign In</span><ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </form>
          </div>

          {/* Demo Credentials */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-5 mb-5">
            <p className="text-[10px] font-bold text-violet-700 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
              Demo Credentials — Click to Fill
            </p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map(({ role, email, password, color }) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setForm({ email, password })}
                  className="text-left p-3 rounded-xl border border-zinc-100 hover:border-violet-200 hover:bg-violet-50 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`w-2 h-2 rounded-full ${color}`} />
                    <p className="font-bold text-zinc-800 text-sm">{role}</p>
                  </div>
                  <p className="text-zinc-400 text-[11px] truncate">{email}</p>
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-sm text-zinc-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-violet-600 font-bold hover:text-violet-800 transition-colors">
              Register here
            </Link>
          </p>
        </div>
      </div>

      {/* ── Right — Branding Panel ─────────────────────────── */}
      <div className="hidden lg:flex w-[46%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #5b21b6 0%, #7c3aed 40%, #6d28d9 70%, #4f46e5 100%)' }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, white, transparent)' }} />
        <div className="absolute bottom-0 -left-20 w-64 h-64 rounded-full opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(circle, white, transparent)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06] pointer-events-none"
          style={{ background: 'radial-gradient(circle, white, transparent)' }} />
        {/* Spinning ring decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full border border-white/10 animate-spin-slow pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-white/10 animate-spin-slow pointer-events-none" style={{ animationDirection: 'reverse', animationDuration: '20s' }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
            <GraduationCap className="text-white" size={22} />
          </div>
          <div>
            <span className="text-white font-extrabold text-xl tracking-tight">HiSUP</span>
            <span className="text-violet-200 text-xs ml-1.5 font-bold">2.0</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10">
          <h2 className="text-4xl font-extrabold text-white leading-[1.15] mb-5 tracking-tight">
            Next-Generation<br />
            <span className="text-violet-200">Campus Management</span>
          </h2>
          <p className="text-white/70 text-base leading-relaxed mb-10 max-w-sm">
            A unified platform to manage your academic journey, student services, and institutional administration — all in one place.
          </p>

          {/* Feature Perks List */}
          <div className="flex flex-col gap-3.5">
            {PERKS.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
                  <Icon size={15} className="text-white" />
                </div>
                <span className="text-white/85 text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="relative z-10">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { val: '10K+', label: 'Students' },
              { val: '500+', label: 'Faculty' },
              { val: '99.9%', label: 'Uptime' },
            ].map(({ val, label }) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-3.5 text-center">
                <p className="text-white font-extrabold text-lg leading-tight">{val}</p>
                <p className="text-white/60 text-xs font-semibold mt-0.5">{label}</p>
              </div>
            ))}
          </div>
          <p className="text-white/40 text-xs font-semibold">© {new Date().getFullYear()} HiSUP University Systems</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
