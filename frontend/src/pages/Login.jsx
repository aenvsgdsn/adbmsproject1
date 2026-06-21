import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Loader2, GraduationCap, ArrowRight, BookOpen, Users, BarChart2 } from 'lucide-react';
import toast from 'react-hot-toast';

const DEMO_ACCOUNTS = [
  { role: 'Admin',   email: 'admin@hisup.edu',   password: 'admin123' },
  { role: 'Faculty', email: 'faculty@hisup.edu',  password: 'password123' },
  { role: 'Student', email: 'student@hisup.edu',  password: 'password123' },
  { role: 'Finance', email: 'finance@hisup.edu',  password: 'password123' },
];

const FEATURES = [
  { icon: GraduationCap, label: 'Student Portal',  desc: 'Track grades, attendance & fees' },
  { icon: BookOpen,      label: 'Academic Hub',    desc: 'Courses, sections & schedules' },
  { icon: Users,         label: 'Faculty Access',  desc: 'Manage classes & mark grades' },
  { icon: BarChart2,     label: 'Analytics',       desc: 'Real-time institutional data' },
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
    <div
      className="min-h-screen flex font-inter animate-fade-in"
      style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f8fafc 50%, #eef2ff 100%)' }}
    >
      {/* ── Left Branding Panel ────────────────────────── */}
      <div
        className="hidden lg:flex w-[44%] flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #1e3a8a 0%, #1d4ed8 60%, #2563eb 100%)',
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 -mr-32 -mt-32"
          style={{ background: 'radial-gradient(circle, white, transparent)' }} />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-10 -ml-20 -mb-20"
          style={{ background: 'radial-gradient(circle, white, transparent)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, white, transparent)' }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
            <GraduationCap className="text-white" size={22} />
          </div>
          <div>
            <span className="text-white font-bold text-xl tracking-tight font-outfit">HiSUP</span>
            <span className="text-blue-200 text-xs ml-1.5 font-semibold">2.0</span>
          </div>
        </div>

        {/* Main Text */}
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold text-white leading-[1.15] mb-5 font-outfit tracking-tight">
            Next-Generation<br />
            <span className="text-blue-200">Campus Management</span>
          </h1>
          <p className="text-blue-100 text-base leading-relaxed mb-10 max-w-sm">
            A unified platform to manage your academic journey, student services, and institutional administration.
          </p>

          {/* Feature Pills */}
          <div className="grid grid-cols-2 gap-3">
            {FEATURES.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="p-4 rounded-xl flex flex-col gap-2 transition-colors"
                style={{
                  background: 'rgba(255,255,255,0.10)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
              >
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Icon size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{label}</p>
                  <p className="text-blue-200 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-blue-300 text-sm">© {new Date().getFullYear()} HiSUP University Systems</p>
      </div>

      {/* ── Right Login Panel ──────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
        {/* Mobile Logo */}
        <div className="absolute top-6 left-6 flex items-center gap-2 lg:hidden">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}>
            <GraduationCap className="text-white" size={16} />
          </div>
          <span className="font-bold text-lg text-blue-900 font-outfit">HiSUP</span>
        </div>

        <div className="w-full max-w-md animate-slide-up">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900 font-outfit tracking-tight">Welcome back</h2>
            <p className="text-slate-500 mt-2 text-sm">Enter your credentials to access the portal</p>
          </div>

          {/* Form Card */}
          <div
            className="p-7 rounded-2xl mb-5"
            style={{
              background: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(219,234,254,0.70)',
              boxShadow: '0 8px 32px rgba(37,99,235,0.08)',
            }}
          >
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
                  <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors">
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
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <button
                id="login-submit-btn"
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg w-full mt-2 group"
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
          <div
            className="p-5 rounded-2xl"
            style={{
              background: 'rgba(255,255,255,0.80)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(219,234,254,0.60)',
            }}
          >
            <p className="text-[10px] font-bold text-blue-800 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Demo Credentials — Click to Fill
            </p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map(({ role, email, password }) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setForm({ email, password })}
                  className="text-left p-3 rounded-xl transition-all duration-200"
                  style={{ background: 'rgba(239,246,255,0.70)', border: '1px solid rgba(219,234,254,0.60)' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(219,234,254,0.70)';
                    e.currentTarget.style.borderColor = 'rgba(147,197,253,0.60)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(239,246,255,0.70)';
                    e.currentTarget.style.borderColor = 'rgba(219,234,254,0.60)';
                  }}
                >
                  <p className="font-bold text-slate-800 text-sm">{role}</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">{email}</p>
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-sm text-slate-500 mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-800 transition-colors">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
