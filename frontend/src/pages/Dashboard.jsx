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
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Students" value={stats?.total_students?.toLocaleString()} icon={GraduationCap} bgClass="bg-blue-50" colorClass="text-blue-600" />
        <StatCard label="Faculty Members" value={stats?.total_faculty?.toLocaleString()} icon={Users} bgClass="bg-indigo-50" colorClass="text-indigo-600" />
        <StatCard label="Active Courses" value={stats?.total_courses?.toLocaleString()} icon={BookOpen} bgClass="bg-violet-50" colorClass="text-violet-600" />
        <StatCard label="Total Revenue" value={stats?.total_revenue ? `PKR ${Number(stats.total_revenue).toLocaleString()}` : 'PKR 0'} icon={DollarSign} bgClass="bg-emerald-50" colorClass="text-emerald-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card>
          <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <Library size={15} className="text-amber-500" /> Library Overview
          </h3>
          <div
            className="flex items-center justify-between p-4 rounded-xl"
            style={{ background: 'linear-gradient(135deg, rgba(254,243,199,0.60), rgba(253,230,138,0.30))', border: '1px solid rgba(253,230,138,0.60)' }}
          >
            <div>
              <p className="text-xs text-amber-700 font-semibold">Books Available</p>
              <p className="text-2xl font-bold text-amber-900 mt-1">{stats?.available_books?.toLocaleString() ?? 0}</p>
            </div>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
              <BookOpen size={18} className="text-amber-500" />
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <Home size={15} className="text-rose-500" /> Hostel Occupancy
          </h3>
          <div
            className="flex items-center justify-between p-4 rounded-xl"
            style={{ background: 'linear-gradient(135deg, rgba(254,228,226,0.60), rgba(253,202,198,0.30))', border: '1px solid rgba(253,202,198,0.60)' }}
          >
            <div>
              <p className="text-xs text-rose-700 font-semibold">Occupied / Total</p>
              <p className="text-2xl font-bold text-rose-900 mt-1">
                {stats?.hostel_occupancy ?? 0}
                <span className="text-sm text-rose-400 font-normal"> / {stats?.total_hostel_capacity ?? 0}</span>
              </p>
            </div>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
              <Users size={18} className="text-rose-500" />
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
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Current CGPA" value={stats?.current_cgpa?.toFixed(2) || '0.00'} icon={TrendingUp} bgClass="bg-blue-50" colorClass="text-blue-600" />
        <StatCard label="Outstanding Fee" value={stats?.outstanding_fee ? `PKR ${Number(stats.outstanding_fee).toLocaleString()}` : 'PKR 0'} icon={DollarSign} bgClass="bg-rose-50" colorClass="text-rose-600" />
        <StatCard label="Registered Courses" value={stats?.registered_courses ?? 0} icon={BookOpen} bgClass="bg-indigo-50" colorClass="text-indigo-600" />
        <StatCard label="Books Issued" value={stats?.books_issued ?? 0} icon={Library} bgClass="bg-amber-50" colorClass="text-amber-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Calendar size={15} className="text-blue-400" /> Upcoming Classes
            </h3>
            <button className="text-xs text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1 transition-colors">
              View Schedule <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-2.5">
            {[
              { time: '09:00 AM', course: 'Introduction to Programming', room: 'Room 301' },
              { time: '11:30 AM', course: 'Calculus I', room: 'Room 405' },
              { time: '02:00 PM', course: 'Data Structures', room: 'Lab 2' },
            ].map((cls, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-3 rounded-xl transition-colors"
                style={{ border: '1px solid rgba(226,232,240,0.70)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,246,255,0.50)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div className="text-xs font-semibold text-slate-400 w-16 shrink-0">{cls.time}</div>
                <div className="w-px h-8 bg-blue-100 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-slate-800">{cls.course}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{cls.room}</p>
                </div>
                <div className="ml-auto w-2 h-2 rounded-full bg-blue-400 shrink-0" />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-slate-700 mb-5 flex items-center gap-2">
            <Bell size={15} className="text-slate-400" /> Notifications
          </h3>
          {stats?.unread_notifications > 0 ? (
            <div
              className="p-3.5 rounded-xl flex gap-3"
              style={{ background: 'rgba(239,246,255,0.70)', border: '1px solid rgba(147,197,253,0.40)' }}
            >
              <AlertCircle size={16} className="text-blue-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-blue-900">You have {stats.unread_notifications} unread messages.</p>
                <p className="text-[11px] text-blue-600 mt-1">Check your notification center.</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center" style={{ background: 'rgba(239,246,255,0.70)', border: '1px solid rgba(219,234,254,0.60)' }}>
                <Bell size={20} className="text-blue-200" />
              </div>
              <p className="text-sm font-semibold text-slate-600">All caught up!</p>
              <p className="text-xs text-slate-400 mt-1">No new notifications.</p>
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
    <div className="pb-8">
      {/* Welcome Banner */}
      <div
        className="relative rounded-2xl overflow-hidden mb-8 animate-fade-in"
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%)',
          boxShadow: '0 8px 32px rgba(37,99,235,0.30)',
        }}
      >
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10 -mr-20 -mt-20" style={{ background: 'radial-gradient(circle, white, transparent)' }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10 -ml-10 -mb-10" style={{ background: 'radial-gradient(circle, white, transparent)' }} />

        <div className="relative z-10 p-8 md:p-10 text-white">
          <p className="text-blue-200 text-xs font-bold tracking-widest uppercase mb-3">{currentDate}</p>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight font-outfit">
            Welcome back, <span className="text-blue-200">{user?.username}</span>! 👋
          </h1>
          <p className="text-blue-100 max-w-xl leading-relaxed text-sm md:text-base">
            Step into your <span className="font-semibold capitalize">{user?.role?.toLowerCase()}</span> portal. Review your latest statistics and manage your activities.
          </p>
        </div>
      </div>

      {user?.role === 'Admin' && <AdminDashboard />}
      {user?.role === 'Student' && <StudentDashboard studentId={user?.student_id} />}

      {portal && (
        <div className="card p-10 text-center animate-fade-in">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(239,246,255,0.80)', border: '1px solid rgba(219,234,254,0.60)' }}>
            <portal.icon size={24} className="text-blue-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2 font-outfit">{portal.title}</h3>
          <p className="text-slate-500 max-w-sm mx-auto text-sm">{portal.subtitle}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
