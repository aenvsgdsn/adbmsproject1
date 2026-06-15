import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getAdminDashboard, getStudentDashboard,
} from '../api';
import {
  Users, GraduationCap, BookOpen, DollarSign, Library, Home,
  TrendingUp, AlertCircle, Loader2, ArrowRight, Calendar, Bell, FileText
} from 'lucide-react';
import { format } from 'date-fns';

const StatCard = ({ label, value, icon: Icon, color = 'blue', sub }) => (
  <div className="stat-card group relative overflow-hidden">
    <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-50 rounded-full blur-2xl -mr-8 -mt-8 opacity-50 group-hover:opacity-100 transition-opacity`} />
    <div className="relative flex items-start justify-between z-10">
      <div>
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-3xl font-bold text-slate-800">{value ?? '—'}</p>
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      </div>
      <div className={`w-10 h-10 rounded-[6px] flex items-center justify-center bg-${color}-100 text-${color}-600 shadow-sm border border-${color}-200`}>
        <Icon size={20} />
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboard()
      .then(({ data }) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-blue-600" size={28} />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Total Students" value={stats?.total_students?.toLocaleString()} icon={GraduationCap} color="blue" />
        <StatCard label="Faculty Members" value={stats?.total_faculty?.toLocaleString()} icon={Users} color="indigo" />
        <StatCard label="Active Courses" value={stats?.total_courses?.toLocaleString()} icon={BookOpen} color="violet" />
        <StatCard label="Total Revenue" value={stats?.total_revenue ? `PKR ${Number(stats.total_revenue).toLocaleString()}` : 'PKR 0'} icon={DollarSign} color="emerald" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Library size={16} className="text-amber-500" /> Library Overview
          </h3>
          <div className="flex items-center justify-between p-4 bg-amber-50/50 rounded-[6px] border border-amber-100">
            <div>
              <p className="text-xs text-amber-600 font-medium">Books Available</p>
              <p className="text-2xl font-bold text-amber-900 mt-1">{stats?.available_books?.toLocaleString() ?? 0}</p>
            </div>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
              <BookOpen size={18} className="text-amber-500" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Home size={16} className="text-rose-500" /> Hostel Occupancy
          </h3>
          <div className="flex items-center justify-between p-4 bg-rose-50/50 rounded-[6px] border border-rose-100">
            <div>
              <p className="text-xs text-rose-600 font-medium">Occupied / Total</p>
              <p className="text-2xl font-bold text-rose-900 mt-1">
                {stats?.hostel_occupancy ?? 0} <span className="text-sm text-rose-400 font-normal">/ {stats?.total_hostel_capacity ?? 0}</span>
              </p>
            </div>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
              <Users size={18} className="text-rose-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-blue-600" size={28} />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Current CGPA" value={stats?.current_cgpa?.toFixed(2) || '0.00'} icon={TrendingUp} color="blue" />
        <StatCard label="Outstanding Fee" value={stats?.outstanding_fee ? `PKR ${Number(stats.outstanding_fee).toLocaleString()}` : 'PKR 0'} icon={DollarSign} color="red" />
        <StatCard label="Registered Courses" value={stats?.registered_courses ?? 0} icon={BookOpen} color="indigo" />
        <StatCard label="Books Issued" value={stats?.books_issued ?? 0} icon={Library} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <Calendar size={16} className="text-slate-400" /> Upcoming Classes
            </h3>
            <button className="text-xs text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
              View Schedule <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {[
              { time: '09:00 AM', course: 'Introduction to Programming', room: 'Room 301' },
              { time: '11:30 AM', course: 'Calculus I', room: 'Room 405' },
              { time: '02:00 PM', course: 'Data Structures', room: 'Lab 2' }
            ].map((cls, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-[6px] border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="text-xs font-medium text-slate-500 w-16">{cls.time}</div>
                  <div className="w-px h-8 bg-slate-200"></div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{cls.course}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{cls.room}</p>
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-sm font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <Bell size={16} className="text-slate-400" /> Recent Notifications
          </h3>
          {stats?.unread_notifications > 0 ? (
            <div className="space-y-4">
               <div className="p-3 bg-blue-50 rounded-[6px] border border-blue-100 flex gap-3">
                 <AlertCircle size={16} className="text-blue-600 mt-0.5 shrink-0" />
                 <div>
                   <p className="text-xs font-medium text-blue-900">You have {stats.unread_notifications} unread messages.</p>
                   <p className="text-[11px] text-blue-700 mt-1">Please check your notification center.</p>
                 </div>
               </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Bell size={20} className="text-slate-300" />
              </div>
              <p className="text-sm font-medium text-slate-600">All caught up!</p>
              <p className="text-xs text-slate-400 mt-1">No new notifications.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const currentDate = format(new Date(), 'EEEE, MMMM d, yyyy');

  return (
    <div className="pb-8">
      {/* Welcome Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-10 shadow-2xl group animate-fade-in">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img src="/images/hero.png" alt="University Campus" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000" />
          {/* Gradient Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent"></div>
        </div>
        
        <div className="relative z-10 p-10 md:p-14 text-white">
          <p className="text-blue-300 text-sm font-semibold tracking-widest uppercase mb-3 drop-shadow-md">Dashboard</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight drop-shadow-lg font-outfit">
            Welcome back, <span className="text-blue-400">{user?.username}</span>! 👋
          </h1>
          <p className="text-slate-200 text-lg max-w-2xl leading-relaxed drop-shadow-md font-medium">
            Step into your {user?.role?.toLowerCase()} portal. Review your latest academic statistics, upcoming classes, and pending actions directly from your personalized dashboard.
          </p>
        </div>
      </div>

      {user?.role === 'Admin' && <AdminDashboard />}
      {user?.role === 'Student' && <StudentDashboard studentId={user?.student_id} />}
      
      {user?.role === 'Faculty' && (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
             <GraduationCap size={28} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Faculty Portal</h3>
          <p className="text-slate-500 max-w-sm mx-auto">
            Your customized dashboard is being prepared. In the meantime, use the sidebar to manage your courses and students.
          </p>
        </div>
      )}
      
      {user?.role === 'Finance' && (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
             <DollarSign size={28} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Finance Portal</h3>
          <p className="text-slate-500 max-w-sm mx-auto">
            Your dashboard metrics will appear here. Navigate to the Finance section in the sidebar to review fee payments.
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

