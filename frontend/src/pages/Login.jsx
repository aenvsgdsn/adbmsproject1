import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Loader2, GraduationCap, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

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
      toast.error(err?.response?.data?.error || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex animate-fade-in font-inter">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex w-[45%] flex-col justify-between p-12 relative overflow-hidden bg-slate-50">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img src="/images/hero.png" alt="Campus" className="w-full h-full object-cover opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/90 via-slate-900/80 to-slate-950/95" />
        </div>
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-500 rounded-full blur-[100px] opacity-20 animate-float" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-indigo-500 rounded-full blur-[100px] opacity-20 animate-float delay-150" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <GraduationCap className="text-white" size={22} />
          </div>
          <span className="text-white font-bold text-2xl tracking-tight font-outfit">HiSUP 2.0</span>
        </div>

        <div className="relative z-10 my-auto">
          <h1 className="text-5xl font-extrabold text-white leading-[1.1] mb-6 font-outfit tracking-tight">
            Next-Generation <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Campus Management
            </span>
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed max-w-md mb-12">
            A unified, intelligent platform to manage your academic journey, student services, and institutional administration.
          </p>
          
          <div className="grid grid-cols-2 gap-4 max-w-lg">
            {[
              { label: 'Active Students', value: '10,000+' },
              { label: 'Departments', value: '24' },
              { label: 'Courses Offered', value: '360+' },
              { label: 'System Uptime', value: '99.9%' },
            ].map(({ label, value }, i) => (
              <div key={label} className="glass rounded-xl p-5 border-slate-700/50 bg-slate-800/40 hover:bg-slate-800/60 transition-colors animate-slide-up" style={{animationDelay: `${i * 100}ms`}}>
                <div className="text-3xl font-bold text-white font-outfit tracking-tight">{value}</div>
                <div className="text-indigo-200 text-sm mt-1 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-slate-500 text-sm font-medium">© {new Date().getFullYear()} HiSUP University Systems</p>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white lg:bg-slate-50 relative overflow-hidden">
        {/* Mobile Logo */}
        <div className="absolute top-8 left-8 flex items-center gap-2 lg:hidden z-10">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md">
            <GraduationCap className="text-white" size={18} />
          </div>
          <span className="font-bold text-xl text-slate-900 font-outfit">HiSUP 2.0</span>
        </div>

        <div className="w-full max-w-md bg-white lg:bg-transparent lg:shadow-none shadow-xl rounded-2xl p-8 lg:p-0 relative z-10 animate-slide-in-right">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900 font-outfit tracking-tight">Welcome back</h2>
            <p className="text-slate-500 mt-2">Enter your credentials to access the portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="form-group">
              <label htmlFor="login-email" className="text-sm font-bold text-slate-700 block mb-1">Email Address</label>
              <input
                id="login-email"
                type="email"
                name="email"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="you@university.edu"
                value={form.email}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="login-password" className="text-sm font-bold text-slate-700">Password</label>
                <a href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="w-full px-4 py-3 pr-12 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 transition-all flex justify-center items-center gap-2 mt-4 group"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Demo Accounts Panel */}
          <div className="mt-10 p-5 bg-indigo-50/50 rounded-xl border border-indigo-100/60">
            <p className="text-xs font-bold text-indigo-800 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              Demo Credentials
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div onClick={() => setForm({ email: 'admin@hisup.edu', password: 'admin123' })} className="bg-white px-3 py-2 rounded-lg border border-indigo-50 shadow-sm cursor-pointer hover:bg-indigo-50 transition-colors">
                <p className="font-bold text-slate-800">Admin</p>
                <p className="text-slate-500 text-xs">admin@hisup.edu<br/>admin123</p>
              </div>
              <div onClick={() => setForm({ email: 'faculty@hisup.edu', password: 'faculty123' })} className="bg-white px-3 py-2 rounded-lg border border-indigo-50 shadow-sm cursor-pointer hover:bg-indigo-50 transition-colors">
                <p className="font-bold text-slate-800">Faculty</p>
                <p className="text-slate-500 text-xs">faculty@hisup.edu<br/>faculty123</p>
              </div>
              <div onClick={() => setForm({ email: 'student@hisup.edu', password: 'student123' })} className="bg-white px-3 py-2 rounded-lg border border-indigo-50 shadow-sm cursor-pointer hover:bg-indigo-50 transition-colors">
                <p className="font-bold text-slate-800">Student</p>
                <p className="text-slate-500 text-xs">student@hisup.edu<br/>student123</p>
              </div>
              <div onClick={() => setForm({ email: 'finance@hisup.edu', password: 'finance123' })} className="bg-white px-3 py-2 rounded-lg border border-indigo-50 shadow-sm cursor-pointer hover:bg-indigo-50 transition-colors">
                <p className="font-bold text-slate-800">Finance</p>
                <p className="text-slate-500 text-xs">finance@hisup.edu<br/>finance123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
