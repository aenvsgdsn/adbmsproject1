import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAdminDashboard, getStudentDashboard, getFacultyDashboard } from '../api';
import {
  Users, GraduationCap, BookOpen, Library, Home, TrendingUp,
  DollarSign, Layout, Monitor, BarChart2, Activity, Award,
  ArrowUpRight, ArrowDownRight, Minus
} from 'lucide-react';
import { Spinner } from '../components/UI';


/* ─── Liquid Glass Stat Card ─────────────────────────────── */
const GlassStatCard = ({ label, value, icon: Icon, sub, trend, color = '#7c3aed' }) => {
  const trendIcon = trend > 0 ? ArrowUpRight : trend < 0 ? ArrowDownRight : Minus;
  const trendColor = trend > 0 ? '#16a34a' : trend < 0 ? '#dc2626' : '#a3a3a3';

  return (
    <div
      className="animate-fade-in card-hover"
      style={{
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(20px) saturate(1.8)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
        border: '1px solid rgba(255,255,255,0.95)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.90)',
        borderRadius: '16px',
        padding: '20px 22px',
        transition: 'all 200ms ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div
          style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: `${color}10`, border: `1px solid ${color}18`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Icon size={18} style={{ color }} />
        </div>
        {trend !== undefined && (
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: '3px',
              fontSize: '11px', fontWeight: 700, color: trendColor,
              background: `${trendColor}10`, padding: '3px 8px', borderRadius: '99px',
            }}
          >
            {React.createElement(trendIcon, { size: 11 })}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#a3a3a3', marginBottom: '6px' }}>
        {label}
      </p>
      <p style={{ fontSize: '28px', fontWeight: 800, color: '#0a0a0a', letterSpacing: '-0.04em', fontFamily: 'Plus Jakarta Sans, sans-serif', lineHeight: 1 }}>
        {value ?? '—'}
      </p>
      {sub && <p style={{ fontSize: '12px', color: '#a3a3a3', marginTop: '6px', fontWeight: 450 }}>{sub}</p>}
    </div>
  );
};

/* ─── Progress Row ──────────────────────────────────────── */
const ProgressRow = ({ label, value, max, color = '#7c3aed' }) => {
  const pct = Math.min(100, Math.round((value / max) * 100)) || 0;
  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '13px', fontWeight: 500, color: '#525252' }}>{label}</span>
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#0a0a0a' }}>{value}</span>
      </div>
      <div style={{ height: '5px', background: '#f0f0f0', borderRadius: '99px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '99px', transition: 'width 600ms ease' }} />
      </div>
    </div>
  );
};

/* ─── Glass Panel ────────────────────────────────────────── */
const GlassPanel = ({ children, title, action }) => (
  <div style={{
    background: 'rgba(255,255,255,0.88)',
    backdropFilter: 'blur(20px) saturate(1.8)',
    WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
    border: '1px solid rgba(0,0,0,0.07)',
    boxShadow: '0 2px 16px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.90)',
    borderRadius: '16px',
    overflow: 'hidden',
  }}>
    {(title || action) && (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 18px', borderBottom: '1px solid rgba(0,0,0,0.06)',
      }}>
        <p style={{ fontSize: '13.5px', fontWeight: 700, color: '#0a0a0a', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.02em' }}>{title}</p>
        {action}
      </div>
    )}
    <div style={{ padding: '16px 18px' }}>{children}</div>
  </div>
);

/* ─── Mini Bar Chart ─────────────────────────────────────── */
const MiniBar = ({ data, color = '#7c3aed' }) => {
  const max = Math.max(...data);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '56px' }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, borderRadius: '3px 3px 0 0', background: i === data.length - 1 ? color : `${color}25`, height: `${(v / max) * 100}%`, minHeight: '4px', transition: `height 600ms ease ${i * 40}ms` }} />
      ))}
    </div>
  );
};


/* ─── Admin Dashboard ─────────────────────────────────────── */
const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboard().then(({ data }) => setStats(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="animate-fade-in">
      {/* Stat Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px', marginBottom: '22px' }}>
        <GlassStatCard label="Total Students"  value={stats?.total_students?.toLocaleString() ?? '—'} icon={GraduationCap} sub="Enrolled this year"      color="#7c3aed" trend={12} />
        <GlassStatCard label="Faculty Members" value={stats?.total_faculty ?? '—'}                    icon={Users}         sub="Across departments"     color="#2563eb" trend={4}  />
        <GlassStatCard label="Active Courses"  value={stats?.total_courses ?? '—'}                    icon={BookOpen}      sub="Current semester"       color="#059669" trend={8}  />
        <GlassStatCard label="Revenue (PKR)"   value={stats?.total_revenue ? `₨${(stats.total_revenue/1000).toFixed(0)}K` : '—'} icon={DollarSign} sub="Fees collected"  color="#d97706" trend={-2} />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px', marginBottom: '14px' }}>
        <GlassPanel title="Monthly Enrollments" action={
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#16a34a', background: 'rgba(22,163,74,0.08)', padding: '2px 8px', borderRadius: '99px' }}>+12% this month</span>
        }>
          <MiniBar data={[42, 58, 50, 72, 65, 80, 74, 88, 70, 92, 84, 96]} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            {['J','F','M','A','M','J','J','A','S','O','N','D'].map(m => (
              <span key={m} style={{ fontSize: '10px', color: '#a3a3a3', flex: 1, textAlign: 'center' }}>{m}</span>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel title="Departmental Overview">
          <ProgressRow label="Computer Science" value={stats?.total_students ? Math.round(stats.total_students * 0.35) : 0} max={stats?.total_students || 100} color="#7c3aed" />
          <ProgressRow label="Electrical Engineering" value={stats?.total_students ? Math.round(stats.total_students * 0.28) : 0} max={stats?.total_students || 100} color="#2563eb" />
          <ProgressRow label="Business Admin" value={stats?.total_students ? Math.round(stats.total_students * 0.20) : 0} max={stats?.total_students || 100} color="#059669" />
          <ProgressRow label="Mechanical Eng" value={stats?.total_students ? Math.round(stats.total_students * 0.17) : 0} max={stats?.total_students || 100} color="#d97706" />
        </GlassPanel>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
        <GlassPanel title="Campus Resources">
          <ProgressRow label="Library Books Available" value={stats?.available_books ?? 0} max={10000} color="#7c3aed" />
          <ProgressRow label="Hostel Occupancy" value={stats?.hostel_occupancy ?? 0} max={stats?.total_hostel_capacity || 1000} color="#dc2626" />
        </GlassPanel>
        <GlassPanel title="Fee Collection Status">
          {[
            { label: 'Paid',    val: stats?.paid_students    ?? 0, max: stats?.total_students || 1, color: '#16a34a' },
            { label: 'Pending', val: stats?.pending_students ?? 0, max: stats?.total_students || 1, color: '#d97706' },
            { label: 'Overdue', val: stats?.overdue_students ?? 0, max: stats?.total_students || 1, color: '#dc2626' },
          ].map(r => <ProgressRow key={r.label} label={r.label} value={r.val} max={r.max} color={r.color} />)}
        </GlassPanel>
      </div>
    </div>
  );
};


/* ─── Student Dashboard ───────────────────────────────────── */
const StudentDashboard = ({ studentId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!studentId) { setError('Student profile not linked. Contact admin.'); setLoading(false); return; }
    getStudentDashboard(studentId).then(({ data }) => setStats(data)).catch(() => setError('Failed to load data.')).finally(() => setLoading(false));
  }, [studentId]);

  if (loading) return <Spinner />;
  if (error || !stats) return (
    <div style={{ textAlign: 'center', padding: '64px 0' }}>
      <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(220,38,38,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
        <Activity size={20} style={{ color: '#dc2626' }} />
      </div>
      <p style={{ fontSize: '14px', fontWeight: 600, color: '#525252' }}>{error || 'No data available.'}</p>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '22px' }}>
        <GlassStatCard label="Current CGPA"      value={stats.current_cgpa?.toFixed(2) ?? '—'} icon={TrendingUp}  sub="Out of 4.00"             color="#7c3aed" />
        <GlassStatCard label="Enrolled Courses"  value={stats.registered_courses ?? '—'}        icon={BookOpen}    sub="This semester"           color="#2563eb" />
        <GlassStatCard label="Books Issued"       value={stats.books_issued ?? '—'}              icon={Library}     sub="Library books"           color="#059669" />
        <GlassStatCard label="Outstanding Fees"   value={stats.outstanding_fee ? `₨${stats.outstanding_fee}` : 'Clear'} icon={DollarSign} sub={stats.outstanding_fee ? 'Pending payment' : 'All paid'} color={stats.outstanding_fee ? '#dc2626' : '#16a34a'} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
        <GlassPanel title="Academic Standing">
          <ProgressRow label="CGPA Progress"      value={stats.current_cgpa?.toFixed(2) ?? 0} max={4.0}  color="#7c3aed" />
          <ProgressRow label="Courses Completed"  value={stats.registered_courses ?? 0}        max={20}   color="#2563eb" />
        </GlassPanel>
        <GlassPanel title="Campus Life">
          <ProgressRow label="Library Activity"   value={stats.books_issued ?? 0}  max={10} color="#059669" />
          <ProgressRow label="Fee Status"         value={stats.outstanding_fee ? 0 : 100} max={100} color={stats.outstanding_fee ? '#dc2626' : '#16a34a'} />
        </GlassPanel>
      </div>
    </div>
  );
};


/* ─── Faculty Dashboard ───────────────────────────────────── */
const FacultyDashboard = ({ facultyId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!facultyId) { setError('Faculty profile not linked. Contact admin.'); setLoading(false); return; }
    getFacultyDashboard(facultyId).then(({ data }) => setStats(data)).catch(() => setError('Failed to load data.')).finally(() => setLoading(false));
  }, [facultyId]);

  if (loading) return <Spinner />;
  if (error || !stats) return (
    <div style={{ textAlign: 'center', padding: '64px 0' }}>
      <p style={{ fontSize: '14px', fontWeight: 600, color: '#525252' }}>{error || 'No data.'}</p>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px', marginBottom: '22px' }}>
        <GlassStatCard label="Assigned Courses"  value={stats.assigned_courses ?? '—'} icon={BookOpen} sub="Current semester" color="#7c3aed" />
        <GlassStatCard label="Total Students"     value={stats.total_students ?? '—'}  icon={Users}    sub="In your sections" color="#2563eb" />
        <GlassStatCard label="Department"         value={stats.department_name ?? '—'} icon={Layout}   sub={stats.designation ?? 'Faculty'} color="#059669" />
      </div>
      <GlassPanel title="Teaching Load">
        <ProgressRow label="Assigned Sections" value={stats.assigned_courses ?? 0} max={5} color="#7c3aed" />
        <ProgressRow label="Student Load"      value={stats.total_students ?? 0}  max={200} color="#2563eb" />
      </GlassPanel>
    </div>
  );
};


/* ─── Dashboard Container ──────────────────────────────────── */
const Dashboard = () => {
  const { user } = useAuth();
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div style={{ paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }} className="animate-fade-in">
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0a0a0a', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: '4px' }}>
          {greeting}, {user?.username} 👋
        </h1>
        <p style={{ fontSize: '13.5px', color: '#a3a3a3', fontWeight: 400 }}>
          {now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {user?.role === 'Admin'   && <AdminDashboard />}
      {user?.role === 'Student' && <StudentDashboard studentId={user?.student_id} />}
      {user?.role === 'Faculty' && <FacultyDashboard facultyId={user?.faculty_id} />}
      {user?.role === 'Finance' && (
        <div style={{ textAlign: 'center', padding: '64px 0' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(217,119,6,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <DollarSign size={20} style={{ color: '#d97706' }} />
          </div>
          <p style={{ fontSize: '14px', fontWeight: 600, color: '#525252' }}>Finance Portal — use the sidebar to navigate.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
