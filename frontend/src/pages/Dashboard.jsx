import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAdminDashboard, getStudentDashboard } from '../api';
import { Smartphone, Monitor, Layout, PieChart, ShoppingCart, Database, GraduationCap, DollarSign, BookOpen, Library, Home, TrendingUp, Calendar, Bell, Plus, MoreHorizontal, LayoutGrid, List } from 'lucide-react';
import { format } from 'date-fns';
import { BoardtoCard, Spinner } from '../components/UI';

/* ─── Shared Filter Row (Boardto Style) ───────────────────── */
const FilterRow = ({ activeFilter, setActiveFilter, total }) => {
  const filters = [
    { id: 'all', label: 'All', count: total || 0 },
    { id: 'started', label: 'Started', count: 20 },
    { id: 'approval', label: 'Approval', count: 15 },
    { id: 'completed', label: 'Completed', count: 34 },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 animate-fade-in gap-4">
      <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-colors whitespace-nowrap ${
              activeFilter === f.id
                ? 'bg-zinc-100 text-zinc-900'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            {f.label}
            {f.id === 'all' && (
              <span className={`px-2 py-0.5 rounded-full text-xs ${activeFilter === 'all' ? 'bg-[#00b4d8] text-white' : 'bg-zinc-200 text-zinc-600'}`}>
                {f.count}
              </span>
            )}
            {f.id !== 'all' && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-zinc-100 text-zinc-500">
                {f.count}
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 px-3 py-2 border border-zinc-200 rounded-lg text-sm font-bold text-zinc-600 hover:bg-zinc-50">
          <MoreHorizontal size={16} /> More
        </button>
        <button className="p-2 border border-zinc-200 rounded-lg text-zinc-600 hover:bg-zinc-50">
          <LayoutGrid size={16} />
        </button>
        <button className="p-2 border border-zinc-200 bg-[#00b4d8] text-white rounded-lg shadow-sm">
          <List size={16} />
        </button>
      </div>
    </div>
  );
};


/* ─── Admin Dashboard (Boardto Layout) ────────────────────── */
const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getAdminDashboard()
      .then(({ data }) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  // Mapping Admin Stats to Boardto Cards
  const cards = [
    {
      title: 'Student Admissions',
      subtitle: 'Admissions Team',
      icon: Smartphone,
      iconColorClass: 'icon-pink',
      daysLeft: '1 Weeks Left',
      progress: Math.min(100, Math.round(((stats?.total_students || 0) / 5000) * 100)) || 34,
      avatars: ['https://i.pravatar.cc/100?img=1', 'https://i.pravatar.cc/100?img=2', 'https://i.pravatar.cc/100?img=3'],
    },
    {
      title: 'Faculty Management',
      subtitle: 'HR Department',
      icon: Monitor,
      iconColorClass: 'icon-green',
      daysLeft: '3 Weeks Left',
      progress: Math.min(100, Math.round(((stats?.total_faculty || 0) / 200) * 100)) || 76,
      avatars: ['https://i.pravatar.cc/100?img=4'],
    },
    {
      title: 'Active Courses',
      subtitle: 'Academic Team',
      icon: Layout,
      iconColorClass: 'icon-blue',
      daysLeft: '2 Days Left',
      progress: Math.min(100, Math.round(((stats?.total_courses || 0) / 100) * 100)) || 4,
      avatars: ['https://i.pravatar.cc/100?img=5', 'https://i.pravatar.cc/100?img=6', 'https://i.pravatar.cc/100?img=7'],
    },
    {
      title: 'Revenue Overview',
      subtitle: 'Finance Team',
      icon: PieChart,
      iconColorClass: 'icon-orange',
      daysLeft: '1 Month Left',
      progress: stats?.total_revenue ? 90 : 10,
      avatars: ['https://i.pravatar.cc/100?img=8', 'https://i.pravatar.cc/100?img=9'],
    },
    {
      title: 'Library System',
      subtitle: 'Library Staff',
      icon: Database,
      iconColorClass: 'icon-purple',
      daysLeft: '2 Month Left',
      progress: Math.min(100, Math.round(((stats?.available_books || 0) / 10000) * 100)) || 96,
      avatars: ['https://i.pravatar.cc/100?img=10', 'https://i.pravatar.cc/100?img=11', 'https://i.pravatar.cc/100?img=12'],
    },
    {
      title: 'Hostel Occupancy',
      subtitle: 'Campus Operations',
      icon: Home,
      iconColorClass: 'icon-red',
      daysLeft: '11 Days Left',
      progress: Math.min(100, Math.round(((stats?.hostel_occupancy || 0) / (stats?.total_hostel_capacity || 1)) * 100)) || 24,
      avatars: ['https://i.pravatar.cc/100?img=13', 'https://i.pravatar.cc/100?img=14'],
    },
  ];

  return (
    <div>
      <FilterRow activeFilter={filter} setActiveFilter={setFilter} total={60} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <BoardtoCard key={i} {...card} />
        ))}
      </div>
    </div>
  );
};


/* ─── Student Dashboard (Boardto Layout) ──────────────────── */
const StudentDashboard = ({ studentId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!studentId) return;
    getStudentDashboard(studentId)
      .then(({ data }) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [studentId]);

  if (loading) return <Spinner />;

  const cards = [
    {
      title: 'Academic Progress',
      subtitle: `CGPA: ${stats?.current_cgpa?.toFixed(2) || '0.00'}`,
      icon: TrendingUp,
      iconColorClass: 'icon-blue',
      daysLeft: 'Current Semester',
      progress: Math.min(100, Math.round(((stats?.current_cgpa || 0) / 4.0) * 100)) || 0,
      avatars: ['https://i.pravatar.cc/100?img=1'],
    },
    {
      title: 'Outstanding Fees',
      subtitle: 'Finance Status',
      icon: DollarSign,
      iconColorClass: 'icon-red',
      daysLeft: 'Due Next Week',
      progress: stats?.outstanding_fee ? 20 : 100,
      avatars: ['https://i.pravatar.cc/100?img=8'],
    },
    {
      title: 'Course Enrollments',
      subtitle: `${stats?.registered_courses ?? 0} Active Courses`,
      icon: BookOpen,
      iconColorClass: 'icon-green',
      daysLeft: 'Ongoing',
      progress: 65,
      avatars: ['https://i.pravatar.cc/100?img=5', 'https://i.pravatar.cc/100?img=6'],
    },
    {
      title: 'Library Borrows',
      subtitle: `${stats?.books_issued ?? 0} Books Issued`,
      icon: Library,
      iconColorClass: 'icon-orange',
      daysLeft: 'Return in 5 Days',
      progress: 40,
      avatars: ['https://i.pravatar.cc/100?img=10'],
    },
  ];

  return (
    <div>
      <FilterRow activeFilter={filter} setActiveFilter={setFilter} total={12} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <BoardtoCard key={i} {...card} />
        ))}
      </div>
    </div>
  );
};


/* ─── Dashboard Header & Layout ───────────────────────────── */
const Dashboard = () => {
  const { user } = useAuth();
  
  return (
    <div className="pb-10 font-inter">
      {/* Boardto Header Style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 mb-1">Reporting</h1>
          <p className="text-sm font-semibold text-zinc-400">All project in current month</p>
        </div>
        <button className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl bg-[#00b4d8] text-white shadow-lg hover:bg-[#0096b4] transition-colors mt-4 sm:mt-0">
          <Plus size={20} />
        </button>
      </div>

      {user?.role === 'Admin' && <AdminDashboard />}
      {user?.role === 'Student' && <StudentDashboard studentId={user?.student_id} />}
      
      {/* Other Roles (Faculty/Finance) */}
      {(user?.role === 'Faculty' || user?.role === 'Finance') && (
        <div className="text-center py-20 animate-fade-in-up">
          <div className="icon-circle icon-cyan w-16 h-16 mx-auto mb-4">
            <GraduationCap size={28} />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 mb-2">{user?.role} Portal</h3>
          <p className="text-zinc-500 max-w-sm mx-auto text-sm">Use the sidebar to navigate to your specific modules.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
