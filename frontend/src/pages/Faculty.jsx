import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getFaculty, createFaculty, getDepartments } from '../api';
import { Users, Plus, GraduationCap, Mail, Calendar, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { PageHeader, Modal, ModalFooter, FormField, SearchBar, EmptyState, Spinner, StatCard, SectionCard } from '../components/UI';

const DESIGNATION_BADGE = {
  'Professor':             'badge-purple',
  'Associate Professor':   'badge-blue',
  'Assistant Professor':   'badge-green',
  'Lecturer':              'badge-gray',
};

const EMPTY_FORM = { username: '', email: '', password: '', department_id: '', designation: '', hire_date: '' };

const FacultyCard = ({ member }) => (
  <div
    className="group p-6 rounded-2xl flex flex-col gap-4 transition-all duration-300 animate-fade-in"
    style={{
      background: 'rgba(255,255,255,0.88)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(219,234,254,0.70)',
      boxShadow: '0 1px 4px rgba(37,99,235,0.06)',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.boxShadow = '0 8px 24px rgba(37,99,235,0.12)';
      e.currentTarget.style.transform = 'translateY(-3px)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.boxShadow = '0 1px 4px rgba(37,99,235,0.06)';
      e.currentTarget.style.transform = 'translateY(0)';
    }}
  >
    <div className="flex items-center gap-4">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl uppercase shrink-0"
        style={{ background: 'linear-gradient(135deg, #2563eb, #4f46e5)', boxShadow: '0 4px 12px rgba(37,99,235,0.25)' }}
      >
        {(member.user_accounts?.username || '?')[0]}
      </div>
      <div className="min-w-0">
        <h3 className="font-bold text-slate-800 text-base truncate">{member.user_accounts?.username}</h3>
        <span className={`badge mt-1 ${DESIGNATION_BADGE[member.designation] || 'badge-gray'}`}>
          {member.designation}
        </span>
      </div>
    </div>

    <div className="space-y-2 text-sm">
      <div className="flex items-center gap-2.5 text-slate-500">
        <Mail size={13} className="shrink-0 text-blue-400" />
        <span className="truncate text-xs">{member.user_accounts?.email}</span>
      </div>
      <div className="flex items-center gap-2.5 text-slate-500">
        <Building2 size={13} className="shrink-0 text-blue-400" />
        <span className="text-xs">{member.departments?.department_name || '—'}</span>
      </div>
      <div className="flex items-center gap-2.5 text-slate-500">
        <Calendar size={13} className="shrink-0 text-blue-400" />
        <span className="text-xs">Joined {member.hire_date ? format(new Date(member.hire_date), 'MMM yyyy') : '—'}</span>
      </div>
    </div>

    <div className="pt-3 mt-auto" style={{ borderTop: '1px solid rgba(219,234,254,0.60)' }}>
      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
        {member.departments?.department_code} Dept.
      </span>
    </div>
  </div>
);

const Faculty = () => {
  const { user } = useAuth();
  const [faculty, setFaculty]         = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [showModal, setShowModal]     = useState(false);
  const [saving, setSaving]           = useState(false);
  const [form, setForm]               = useState(EMPTY_FORM);

  const load = async () => {
    setLoading(true);
    try {
      const [f, d] = await Promise.all([getFaculty(), getDepartments()]);
      setFaculty(f.data || []);
      setDepartments(d.data || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createFaculty(form);
      toast.success('Faculty member added!');
      setShowModal(false);
      setForm(EMPTY_FORM);
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

  const deptStats = departments
    .map(d => ({ code: d.department_code, name: d.department_name, count: faculty.filter(f => f.departments?.department_code === d.department_code).length }))
    .filter(d => d.count > 0);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Faculty Members"
        subtitle="Meet our academic team across all departments"
      />

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
        <StatCard label="Total Faculty" value={faculty.length} icon={Users} bgClass="bg-blue-50" colorClass="text-blue-600" />
        {deptStats.slice(0, 3).map(dept => (
          <StatCard key={dept.code} label={dept.code} value={dept.count} icon={Building2} sub={dept.name} bgClass="bg-indigo-50" colorClass="text-indigo-600" />
        ))}
      </div>

      <SectionCard
        title="Directory"
        actions={
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <SearchBar
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, designation..."
            />
            {user?.role === 'Admin' && (
              <button onClick={() => setShowModal(true)} className="btn btn-primary shrink-0">
                <Plus size={15} /> Add Faculty
              </button>
            )}
          </div>
        }
        className="bg-transparent border-0 shadow-none p-0"
      >
        {loading ? <Spinner /> : filtered.length === 0 ? (
          <EmptyState icon={GraduationCap} title="No faculty members found" subtitle="Try adjusting your search or add new faculty." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map(f => <FacultyCard key={f.faculty_id} member={f} />)}
          </div>
        )}
      </SectionCard>

      {/* Modal */}
      {showModal && (
        <Modal title="Add Faculty Member" onClose={() => setShowModal(false)}>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Full Name">
                <input className="form-input" required placeholder="Dr. John Smith" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
              </FormField>
              <FormField label="Email Address">
                <input type="email" className="form-input" required placeholder="john@university.edu" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </FormField>
            </div>
            <FormField label="Password">
              <input type="password" className="form-input" required placeholder="Minimum 8 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Department">
                <select className="form-input form-select" required value={form.department_id} onChange={e => setForm({ ...form, department_id: e.target.value })}>
                  <option value="">Select Department</option>
                  {departments.map(d => <option key={d.department_id} value={d.department_id}>{d.department_name}</option>)}
                </select>
              </FormField>
              <FormField label="Designation">
                <select className="form-input form-select" required value={form.designation} onChange={e => setForm({ ...form, designation: e.target.value })}>
                  <option value="">Select Role</option>
                  {['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </FormField>
            </div>
            <FormField label="Hire Date">
              <input type="date" className="form-input" required value={form.hire_date} onChange={e => setForm({ ...form, hire_date: e.target.value })} />
            </FormField>
            <ModalFooter onCancel={() => setShowModal(false)} submitLabel="Add Faculty" loading={saving} icon={Plus} />
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Faculty;
