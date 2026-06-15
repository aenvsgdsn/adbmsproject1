import { useEffect, useState } from 'react';
import { getStudents, createStudent, getPrograms, getDepartments, registerUser } from '../api';
import { Plus, Loader2, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';

const statusColors = {
  Active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Graduated: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  Suspended: 'bg-rose-100 text-rose-700 border-rose-200',
  Dropped: 'bg-slate-100 text-slate-700 border-slate-200',
};

const Students = () => {
  const [students, setStudents] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    username: '', email: '', password: 'student123',
    roll_number: '', program_id: '', department_id: '', cnic: '', phone: '',
  });

  const load = async () => {
    setLoading(true);
    try {
      const [s, p, d] = await Promise.all([getStudents(), getPrograms(), getDepartments()]);
      setStudents(s.data || []);
      setPrograms(p.data || []);
      setDepartments(d.data || []);
    } catch {
      toast.error('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = students.filter(s =>
    s.roll_number.toLowerCase().includes(search.toLowerCase()) ||
    s.user_accounts?.username?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // 1. Create user account
      const { data: userRes } = await registerUser({
        username: form.username,
        email: form.email,
        password: form.password,
        role: 'Student',
      });
      // 2. Create student profile
      await createStudent({
        roll_number: form.roll_number,
        user_id: userRes.user.id,
        program_id: form.program_id,
        department_id: form.department_id,
        cnic: form.cnic,
        phone: form.phone,
      });
      toast.success('Student created successfully!');
      setShowModal(false);
      setForm({ username: '', email: '', password: 'student123', roll_number: '', program_id: '', department_id: '', cnic: '', phone: '' });
      load();
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to create student.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-outfit">Student Directory</h1>
          <p className="text-slate-500 mt-1 font-medium">{students.length} students currently enrolled across all programs</p>
        </div>
        <button id="add-student-btn" onClick={() => setShowModal(true)} className="btn btn-primary shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 hover:-translate-y-0.5 transition-all">
          <Plus size={16} /> Add New Student
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden animate-slide-up delay-75">
        {/* Toolbar */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="student-search"
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
              placeholder="Search by name or roll number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-indigo-600" size={32} />
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold bg-slate-50">
                  <th className="p-4">Student</th>
                  <th className="p-4">Roll No.</th>
                  <th className="p-4">Program & Department</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr><td colSpan={4} className="text-center text-slate-400 py-16 font-medium">No students found matching your search.</td></tr>
                ) : filtered.map(s => (
                  <tr key={s.student_id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0 border border-indigo-200 shadow-sm group-hover:scale-105 transition-transform">
                          {s.user_accounts?.username?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{s.user_accounts?.username}</p>
                          <p className="text-xs text-slate-500">{s.user_accounts?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-sm font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">{s.roll_number}</span>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-slate-800 text-sm">{s.programs?.program_name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{s.departments?.department_name}</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusColors[s.status] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-backdrop animate-fade-in" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal animate-slide-up w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 font-outfit">Add New Student</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="form-group">
                  <label className="text-sm font-bold text-slate-700 mb-1">Full Name</label>
                  <input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required value={form.username} onChange={e => setForm({...form, username: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="text-sm font-bold text-slate-700 mb-1">Roll Number</label>
                  <input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required value={form.roll_number} onChange={e => setForm({...form, roll_number: e.target.value})} />
                </div>
                <div className="form-group md:col-span-2">
                  <label className="text-sm font-bold text-slate-700 mb-1">Email Address</label>
                  <input type="email" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="text-sm font-bold text-slate-700 mb-1">CNIC</label>
                  <input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required value={form.cnic} onChange={e => setForm({...form, cnic: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="text-sm font-bold text-slate-700 mb-1">Phone</label>
                  <input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="text-sm font-bold text-slate-700 mb-1">Program</label>
                  <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required value={form.program_id} onChange={e => setForm({...form, program_id: e.target.value})}>
                    <option value="">Select Program</option>
                    {programs.map(p => <option key={p.program_id} value={p.program_id}>{p.program_name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="text-sm font-bold text-slate-700 mb-1">Department</label>
                  <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required value={form.department_id} onChange={e => setForm({...form, department_id: e.target.value})}>
                    <option value="">Select Department</option>
                    {departments.map(d => <option key={d.department_id} value={d.department_id}>{d.department_name}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                  {saving ? 'Saving...' : 'Create Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
