import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Loader2, ArrowRight, GraduationCap, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const FEATURES = [
  'Unified academic & finance management',
  'Real-time grades, attendance & results',
  'Enterprise-grade security & audit logs',
  'Library, hostel & campus services',
];

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome, ${user.username}!`);
      navigate('/dashboard');
    } catch (err) {
      const msg = err?.response?.data?.error;
      toast.error(typeof msg === 'string' ? msg : 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex overflow-hidden"
      style={{ fontFamily: 'Inter, system-ui, sans-serif', background: '#f5f5f5' }}
    >

      {/* ── LEFT: Form Panel ─────────────────────────── */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-8 sm:px-14 py-12 relative"
        style={{ background: '#ffffff', maxWidth: '520px' }}
      >
        {/* Subtle top-left glow */}
        <div
          className="absolute top-0 left-0 w-64 h-64 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at top left, rgba(124,58,237,0.06) 0%, transparent 70%)',
          }}
        />

        <div className="w-full max-w-[360px] relative z-10">

          {/* Logo mark */}
          <div className="flex items-center gap-3 mb-10">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)',
                boxShadow: '0 4px 16px rgba(124,58,237,0.30)',
              }}
            >
              <GraduationCap size={20} color="white" />
            </div>
            <div>
              <p
                className="font-bold text-lg leading-none tracking-tight"
                style={{ color: '#0a0a0a', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              >HiSUP</p>
              <p
                className="text-[9px] font-bold uppercase tracking-[0.22em] mt-0.5"
                style={{ color: '#7c3aed' }}
              >PLATFORM</p>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5"
              style={{
                background: 'rgba(124,58,237,0.06)',
                border: '1px solid rgba(124,58,237,0.12)',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: '#7c3aed' }}
              />
              <span
                className="text-[11px] font-bold uppercase tracking-widest"
                style={{ color: '#7c3aed' }}
              >Access Portal</span>
            </div>
            <h1
              className="font-extrabold tracking-tight mb-2"
              style={{
                fontSize: '30px',
                color: '#0a0a0a',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                letterSpacing: '-0.03em',
                lineHeight: 1.2,
              }}
            >Welcome Back</h1>
            <p style={{ color: '#a3a3a3', fontSize: '14px' }}>
              Enter your credentials to securely sign in.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="form-label">Email Address</label>
              <input
                id="login-email"
                type="email"
                name="email"
                className="form-input"
                placeholder="admin@hisup.edu"
                value={form.email}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="form-label" style={{ margin: 0 }}>Password</label>
                <a
                  href="#"
                  style={{ fontSize: '12px', fontWeight: 600, color: '#7c3aed' }}
                >Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="form-input"
                  placeholder="••••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  style={{ paddingRight: '44px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: '#a3a3a3', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-liquid w-full"
              style={{
                padding: '12px 20px',
                fontSize: '14px',
                borderRadius: '10px',
                marginTop: '8px',
                opacity: loading ? 0.75 : 1,
                justifyContent: 'center',
              }}
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Signing in…</>
              ) : (
                <>Sign In securely <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p
            className="text-center mt-6"
            style={{ fontSize: '13px', color: '#a3a3a3' }}
          >
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#7c3aed', fontWeight: 600 }}>
              Request access
            </Link>
          </p>
        </div>
      </div>

      {/* ── RIGHT: Purple Branding Panel ─────────────────────── */}
      <div
        className="hidden lg:flex flex-1 relative overflow-hidden flex-col justify-between p-14"
        style={{
          background: 'linear-gradient(140deg, #3d1a7a 0%, #5521a8 30%, #6b2bd4 60%, #7c3aed 85%, #9d5eff 100%)',
        }}
      >
        {/* Decorative rings */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ width: '700px', height: '700px' }}
        >
          {[0.05, 0.10, 0.15].map((opacity, i) => (
            <div
              key={i}
              className="absolute rounded-full border"
              style={{
                inset: `${i * 80}px`,
                borderColor: `rgba(255,255,255,${opacity})`,
                animation: i % 2 === 0 ? `spinSlow ${20 + i * 8}s linear infinite` : `spinSlow ${28 - i * 4}s linear infinite reverse`,
              }}
            />
          ))}
        </div>

        {/* Blobs */}
        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 65%)' }}
        />
        <div
          className="absolute -bottom-40 -left-20 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(196,181,253,0.12) 0%, transparent 65%)' }}
        />

        {/* Dot grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-20">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{
                background: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.20)',
              }}
            >
              <GraduationCap size={22} color="white" />
            </div>
            <div>
              <p
                className="font-extrabold text-xl text-white leading-none"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.025em' }}
              >HiSUP</p>
              <p className="text-[9px] font-bold uppercase tracking-[0.25em] mt-0.5" style={{ color: 'rgba(196,181,253,0.80)' }}>
                ENTERPRISE
              </p>
            </div>
          </div>

          {/* Hero text */}
          <div className="max-w-sm">
            <h2
              className="font-extrabold text-white leading-tight mb-5"
              style={{
                fontSize: '42px',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                letterSpacing: '-0.035em',
                lineHeight: 1.1,
              }}
            >
              Next-Generation<br />
              <span style={{ color: 'rgba(196,181,253,0.90)' }}>Campus Intelligence.</span>
            </h2>
            <p
              style={{
                color: 'rgba(255,255,255,0.65)',
                fontSize: '15px',
                lineHeight: 1.65,
                marginBottom: '36px',
              }}
            >
              A unified platform to seamlessly manage your academic journey, student services, and institutional administration.
            </p>

            {/* Features list */}
            <div className="flex flex-col gap-3">
              {FEATURES.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 animate-slide-right"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: 'rgba(255,255,255,0.10)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255,255,255,0.15)',
                    }}
                  >
                    <Check size={14} color="rgba(196,181,253,1)" strokeWidth={2.5} />
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.82)', fontSize: '14px', fontWeight: 500 }}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between">
          <p style={{ color: 'rgba(255,255,255,0.30)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            © {new Date().getFullYear()} HiSUP University
          </p>
          <div className="flex gap-1.5">
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.20)' }} />
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.40)' }} />
            <div style={{ width: '22px', height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.80)' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
