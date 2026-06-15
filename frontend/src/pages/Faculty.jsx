import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getFaculty, createFaculty, getDepartments } from '../api';
import { Users, Plus, X, Loader2, GraduationCap, Search, Mail, Calendar, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const Modal = ({ title, onClose, children }) => (
  <div className="modal-backdrop animate-fade-in" onClick={onClose}>
    <div className="modal w-full max-w-lg animate-slide-up" onClick={e => e.stopPropagation()}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900 font-outfit">{title}</h2>
        <button onClick={onClose} className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"><X size={20} /></button>
      </div>
      {children}
    </div>
  </div>
);

const designationColor = (d) => {
  if (d?.includes('Professor') && !d?.includes('Associate') && !d?.includes('Assistant')) return 'bg-indigo-100 text-indigo-700';
  if (d?.includes('Associate')) return 'bg-purple-100 text-purple-700';
  if (d?.includes('Assistant')) return 'bg-blue-100 text-blue-700';
  return 'bg-emerald-100 text-emerald-700';
};

const FacultyCard = ({ member }) => (
  <div className="group bg-white border border-slate-200 rounded-xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4 animate-fade-in">
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl uppercase shadow-md shrink-0">
        {(member.user_accounts?.username || '?')[0]}
      </div>
      <div className="min-w-0">
        <h3 className="font-bold text-slate-800 text-base truncate">{member.user_accounts?.username}</h3>
        <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${designationColor(member.designation)}`}>
          {member.designation}
        </span>
      </div>
    </div>
    <div className="space-y-2.5 text-sm">
      <div className="flex items-center gap-2.5 text-slate-500">
        <Mail size={14} className="shrink-0 text-slate-400" />
        <span className="truncate">{member.user_accounts?.email}</span>
      </div>
      <div className="flex items-center gap-2.5 text-slate-500">
        <Building2 size={14} className="shrink-0 text-slate-400" />
        <span>{member.departments?.department_name || '—'}</span>
      </div>
      <div className="flex items-center gap-2.5 text-slate-500">
        <Calendar size={14} className="shrink-0 text-slate-400" />
        <span>Joined {member.hire_date ? format(new Date(member.hire_date), 'MMM yyyy') : '—'}</span>
      </div>
    </div>
    <div className="pt-2 border-t border-slate-100 mt-auto">
      <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">{member.departments?.department_code} Department</span>
    </div>
  </div>
);

const Faculty = () => {
  const { user } = useAuth();
  const [faculty, setFaculty] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    username: '', email: '', password: '',
    department_id: '', designation: '', hire_date: ''
  });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [f, d] = await Promise.all([getFaculty(), getDepartments()]);
      setFaculty(f.data || []);
      setDepartments(d.data || []);
    } catch { }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await createFaculty(form);
      toast.success('Faculty member added!');
      setShowModal(false);
      setForm({ username: '', email: '', password: '', department_id: '', designation: '', hire_date: '' });
      load();
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to add faculty.');
    }
    setSaving(false);
  };

  const filtered = faculty.filter(f =>
    (f.user_accounts?.username || '').toLowerCase().includes(search.toLowerCase()) ||
    (f.designation || '').toLowerCase().includes(search.toLowerCase()) ||
    (f.departments?.department_name || '').toLowerCase().includes(search.toLowerCase())
  );

  // Get unique department codes that exist in faculty
  const deptStats = departments.map(d => ({
    code: d.department_code,
    name: d.department_name,
    count: faculty.filter(f => f.departments?.department_code === d.department_code).length
  })).filter(d => d.count > 0);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-outfit">Faculty Members</h1>
          <p className="text-slate-500 mt-1 font-medium">Meet our world-class academic team across all departments.</p>
        </div>
        {user?.role === 'Admin' && (
          <button onClick={() => setShowModal(true)} className="btn btn-primary shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2">
            <Plus size={16} /> Add Faculty Member
          </button>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Total Faculty</p>
            <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
              <Users size={16} className="text-indigo-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{faculty.length}</p>
        </div>
        {deptStats.slice(0, 3).map(dept => (
          <div key={dept.code} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{dept.code}</p>
              <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                <Building2 size={16} className="text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">{dept.count}</p>
            <p className="text-xs text-slate-400 mt-1 truncate">{dept.name}</p>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative mb-8 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow shadow-sm"
          placeholder="Search by name, designation, or department..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Faculty Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-indigo-600" size={32} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-xl border border-slate-200 border-dashed">
          <GraduationCap size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 font-semibold">No faculty members found.</p>
          <p className="text-slate-400 text-sm mt-1">Try adjusting your search or add new faculty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map(f => <FacultyCard key={f.faculty_id} member={f} />)}
        </div>
      )}

      {/* Add Faculty Modal */}
      {showModal && (
        <Modal title="Add Faculty Member" onClose={() => setShowModal(false)}>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="text-sm font-semibold text-slate-700 mb-1 block">Full Name</label>
                <input className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required placeholder="Dr. John Smith"
                  value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="text-sm font-semibold text-slate-700 mb-1 block">Email Address</label>
                <input type="email" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required placeholder="john@university.edu"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label className="text-sm font-semibold text-slate-700 mb-1 block">Password</label>
              <input type="password" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required placeholder="Minimum 8 characters"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="text-sm font-semibold text-slate-700 mb-1 block">Department</label>
                <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required value={form.department_id}
                  onChange={e => setForm({ ...form, department_id: e.target.value })}>
                  <option value="">Select Department</option>
                  {departments.map(d => <option key={d.department_id} value={d.department_id}>{d.department_name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="text-sm font-semibold text-slate-700 mb-1 block">Designation</label>
                <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required value={form.designation}
                  onChange={e => setForm({ ...form, designation: e.target.value })}>
                  <option value="">Select Role</option>
                  {['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="text-sm font-semibold text-slate-700 mb-1 block">Hire Date</label>
              <input type="date" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required value={form.hire_date}
                onChange={e => setForm({ ...form, hire_date: e.target.value })} />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
              <button type="submit" disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Add Faculty
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Faculty;
