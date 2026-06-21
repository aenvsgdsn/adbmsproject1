import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAdminDashboard, getStudentDashboard } from '../api';
import { Users, GraduationCap, BookOpen, DollarSign, Library, Home, TrendingUp, AlertCircle, ArrowRight, Calendar, Bell } from 'lucide-react';
import { format } from 'date-fns';
import { StatCard, Card, Spinner } from '../components/UI';

/* ─── Admin Dashboard ─────────────────────────────────────── */
const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboard()
      .then(({ data }) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Students" value={stats?.total_students?.toLocaleString()} icon={GraduationCap} bgClass="bg-violet-100/50" colorClass="text-violet-700" />
        <StatCard label="Faculty Members" value={stats?.total_faculty?.toLocaleString()} icon={Users} bgClass="bg-indigo-100/50" colorClass="text-indigo-700" />
        <StatCard label="Active Courses" value={stats?.total_courses?.toLocaleString()} icon={BookOpen} bgClass="bg-cyan-100/50" colorClass="text-cyan-700" />
        <StatCard label="Total Revenue" value={stats?.total_revenue ? `PKR ${Number(stats.total_revenue).toLocaleString()}` : 'PKR 0'} icon={DollarSign} bgClass="bg-emerald-100/50" colorClass="text-emerald-700" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass">
          <h3 className="text-sm font-bold text-zinc-600 mb-5 flex items-center gap-2 tracking-wide uppercase">
            <Library size={16} className="text-violet-500" /> Library Overview
          </h3>
          <div
            className="flex items-center justify-between p-5 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.9)' }}
          >
            <div>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Books Available</p>
              <p className="text-3xl font-extrabold text-zinc-900 mt-1">{stats?.available_books?.toLocaleString() ?? 0}</p>
            </div>
            <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center shadow-sm border border-white">
              <BookOpen size={22} className="text-violet-600" />
            </div>
          </div>
        </Card>

        <Card className="glass">
          <h3 className="text-sm font-bold text-zinc-600 mb-5 flex items-center gap-2 tracking-wide uppercase">
            <Home size={16} className="text-indigo-500" /> Hostel Occupancy
          </h3>
          <div
            className="flex items-center justify-between p-5 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.9)' }}
          >
            <div>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Occupied / Total</p>
              <p className="text-3xl font-extrabold text-zinc-900 mt-1">
                {stats?.hostel_occupancy ?? 0}
                <span className="text-base text-zinc-400 font-semibold ml-1">/ {stats?.total_hostel_capacity ?? 0}</span>
              </p>
            </div>
            <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center shadow-sm border border-white">
              <Users size={22} className="text-indigo-600" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

/* ─── Student Dashboard ───────────────────────────────────── */
const StudentDashboard = ({ studentId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;
    getStudentDashboard(studentId)
      .then(({ data }) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [studentId]);

  if (loading) return <Spinner />;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Current CGPA" value={stats?.current_cgpa?.toFixed(2) || '0.00'} icon={TrendingUp} bgClass="bg-violet-100/50" colorClass="text-violet-700" />
        <StatCard label="Outstanding Fee" value={stats?.outstanding_fee ? `PKR ${Number(stats.outstanding_fee).toLocaleString()}` : 'PKR 0'} icon={DollarSign} bgClass="bg-rose-100/50" colorClass="text-rose-700" />
        <StatCard label="Registered Courses" value={stats?.registered_courses ?? 0} icon={BookOpen} bgClass="bg-indigo-100/50" colorClass="text-indigo-700" />
        <StatCard label="Books Issued" value={stats?.books_issued ?? 0} icon={Library} bgClass="bg-emerald-100/50" colorClass="text-emerald-700" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 glass">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-zinc-600 flex items-center gap-2 uppercase tracking-wide">
              <Calendar size={18} className="text-violet-500" /> Upcoming Classes
            </h3>
            <button className="text-[13px] text-violet-700 font-bold hover:text-violet-900 flex items-center gap-1.5 transition-colors bg-white/50 px-3 py-1.5 rounded-lg border border-white">
              View Schedule <ArrowRight size={14} />
            </button>
          </div>
          <div className="space-y-3">
            {[
              { time: '09:00 AM', course: 'Introduction to Programming', room: 'Room 301' },
              { time: '11:30 AM', course: 'Calculus I', room: 'Room 405' },
              { time: '02:00 PM', course: 'Data Structures', room: 'Lab 2' },
            ].map((cls, idx) => (
              <div
                key={idx}
                className="flex items-center gap-5 p-4 rounded-2xl transition-all duration-300 bg-white/40 border border-white/60 hover:bg-white/80 hover:shadow-sm"
              >
                <div className="text-xs font-extrabold text-zinc-500 w-20 shrink-0">{cls.time}</div>
                <div className="w-px h-10 bg-zinc-200 shrink-0" />
                <div>
                  <p className="text-[15px] font-extrabold text-zinc-900">{cls.course}</p>
                  <p className="text-xs font-semibold text-zinc-500 mt-1">{cls.room}</p>
                </div>
                <div className="ml-auto w-2.5 h-2.5 rounded-full bg-violet-400 shrink-0 shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
              </div>
            ))}
          </div>
        </Card>

        <Card className="glass">
          <h3 className="text-sm font-bold text-zinc-600 mb-6 flex items-center gap-2 uppercase tracking-wide">
            <Bell size={18} className="text-zinc-400" /> Notifications
          </h3>
          {stats?.unread_notifications > 0 ? (
            <div
              className="p-5 rounded-2xl flex gap-4 border border-violet-100 bg-violet-50/50"
            >
              <AlertCircle size={20} className="text-violet-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-[13px] font-bold text-violet-900">You have {stats.unread_notifications} unread messages.</p>
                <p className="text-[12px] font-semibold text-violet-600 mt-1.5">Check your notification center.</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 bg-white/40 rounded-2xl border border-white/60">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-zinc-100/50 border border-white shadow-sm">
                <Bell size={24} className="text-zinc-300" />
              </div>
              <p className="text-[15px] font-extrabold text-zinc-700">All caught up!</p>
              <p className="text-[13px] font-semibold text-zinc-500 mt-1.5">No new notifications.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

/* ─── Dashboard Page ──────────────────────────────────────── */
const Dashboard = () => {
  const { user } = useAuth();
  const currentDate = format(new Date(), 'EEEE, MMMM d, yyyy');

  const rolePortalInfo = {
    Faculty: { title: 'Faculty Portal', subtitle: 'Use the sidebar to manage your courses and students.', icon: GraduationCap },
    Finance: { title: 'Finance Portal', subtitle: 'Navigate to Finance in the sidebar to review fee payments.', icon: DollarSign },
  };
  const portal = rolePortalInfo[user?.role];

  return (
    <div className="pb-10">
      {/* Welcome Banner */}
      <div
        className="relative rounded-[28px] overflow-hidden mb-10 animate-fade-in-up border border-white/20 glass-panel-dark"
        style={{
          background: 'linear-gradient(135deg, var(--violet-900) 0%, var(--violet-700) 50%, var(--violet-600) 100%)',
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-10 -mr-20 -mt-20 pointer-events-none" style={{ background: 'radial-gradient(circle, white, transparent)' }} />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full opacity-10 -ml-10 -mb-10 pointer-events-none" style={{ background: 'radial-gradient(circle, white, transparent)' }} />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.04] pointer-events-none" />

        <div className="relative z-10 p-10 md:p-14 text-white">
          <p className="text-violet-200 text-xs font-bold tracking-[0.2em] uppercase mb-4 opacity-80">{currentDate}</p>
          <h1 className="text-4xl md:text-5xl font-jakarta font-extrabold mb-4 tracking-tight leading-[1.1] text-shadow-sm">
            Welcome back,<br className="md:hidden" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-200 to-white">{user?.username}</span>! 👋
          </h1>
          <p className="text-violet-100 max-w-2xl leading-relaxed text-[15px] md:text-lg font-medium opacity-90 mt-4">
            Step into your <span className="font-bold capitalize text-white">{user?.role?.toLowerCase()}</span> portal. Review your latest statistics and manage your activities in one unified workspace.
          </p>
        </div>
      </div>

      {user?.role === 'Admin' && <AdminDashboard />}
      {user?.role === 'Student' && <StudentDashboard studentId={user?.student_id} />}

      {portal && (
        <div className="card glass p-12 text-center animate-fade-in-up delay-100">
          <div className="w-16 h-16 mx-auto mb-5 rounded-[20px] flex items-center justify-center bg-white border border-violet-100 shadow-sm">
            <portal.icon size={28} className="text-violet-600" />
          </div>
          <h3 className="text-xl font-jakarta font-extrabold text-zinc-900 mb-3">{portal.title}</h3>
          <p className="text-zinc-500 max-w-sm mx-auto text-[15px] font-medium leading-relaxed">{portal.subtitle}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
