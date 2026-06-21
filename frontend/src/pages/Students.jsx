import { useEffect, useState } from 'react';
import { getStudents, createStudent, getPrograms, getDepartments, registerUser } from '../api';
import { Plus, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageHeader, SectionCard, TableWrapper, Modal, ModalFooter, FormField, SearchBar, EmptyState, Spinner } from '../components/UI';

const STATUS_COLORS = {
  Active:    'badge-green',
  Graduated: 'badge-blue',
  Suspended: 'badge-red',
  Dropped:   'badge-gray',
};

const EMPTY_FORM = {
  username: '', email: '', password: 'student123',
  roll_number: '', program_id: '', department_id: '', cnic: '', phone: '',
};

const Students = () => {
  const [students, setStudents]     = useState([]);
  const [programs, setPrograms]     = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [showModal, setShowModal]   = useState(false);
  const [saving, setSaving]         = useState(false);
  const [form, setForm]             = useState(EMPTY_FORM);

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
      const { data: userRes } = await registerUser({ username: form.username, email: form.email, password: form.password, role: 'Student' });
      await createStudent({ roll_number: form.roll_number, user_id: userRes.user.id, program_id: form.program_id, department_id: form.department_id, cnic: form.cnic, phone: form.phone });
      toast.success('Student created successfully!');
      setShowModal(false);
      setForm(EMPTY_FORM);
      load();
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to create student.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Student Directory"
        subtitle={`${students.length} students currently enrolled across all programs`}
      />

      <SectionCard
        title="Student Directory"
        actions={
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <SearchBar
              id="student-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or roll number..."
            />
            <button id="add-student-btn" onClick={() => setShowModal(true)} className="btn btn-primary shrink-0">
              <Plus size={15} /> Add Student
            </button>
          </div>
        }
      >
        {loading ? <Spinner /> : (
          <TableWrapper>
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll No.</th>
                <th>Program &amp; Department</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <EmptyState icon={GraduationCap} title="No students found" subtitle="Try a different search term" />
                  </td>
                </tr>
              ) : filtered.map(s => (
                <tr key={s.student_id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0 border border-blue-200">
                        {s.user_accounts?.username?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{s.user_accounts?.username}</p>
                        <p className="text-xs text-slate-400">{s.user_accounts?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="font-mono text-xs font-semibold text-slate-600 px-2 py-1 rounded-lg" style={{ background: 'rgba(239,246,255,0.80)', border: '1px solid rgba(219,234,254,0.80)' }}>
                      {s.roll_number}
                    </span>
                  </td>
                  <td>
                    <p className="font-semibold text-slate-800 text-sm">{s.programs?.program_name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{s.departments?.department_name}</p>
                  </td>
                  <td>
                    <span className={`badge ${STATUS_COLORS[s.status] || 'badge-gray'}`}>{s.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </TableWrapper>
        )}
      </SectionCard>

      {/* Add Student Modal */}
      {showModal && (
        <Modal title="Add New Student" onClose={() => setShowModal(false)} maxWidth="max-w-2xl">
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Full Name">
                <input className="form-input" required value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
              </FormField>
              <FormField label="Roll Number">
                <input className="form-input" required value={form.roll_number} onChange={e => setForm({ ...form, roll_number: e.target.value })} />
              </FormField>
              <FormField label="Email Address">
                <input type="email" className="form-input md:col-span-2" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </FormField>
              <FormField label="CNIC">
                <input className="form-input" required value={form.cnic} onChange={e => setForm({ ...form, cnic: e.target.value })} />
              </FormField>
              <FormField label="Phone">
                <input className="form-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </FormField>
              <FormField label="Program">
                <select className="form-input form-select" required value={form.program_id} onChange={e => setForm({ ...form, program_id: e.target.value })}>
                  <option value="">Select Program</option>
                  {programs.map(p => <option key={p.program_id} value={p.program_id}>{p.program_name}</option>)}
                </select>
              </FormField>
              <FormField label="Department">
                <select className="form-input form-select" required value={form.department_id} onChange={e => setForm({ ...form, department_id: e.target.value })}>
                  <option value="">Select Department</option>
                  {departments.map(d => <option key={d.department_id} value={d.department_id}>{d.department_name}</option>)}
                </select>
              </FormField>
            </div>
            <ModalFooter onCancel={() => setShowModal(false)} submitLabel="Create Student" loading={saving} icon={Plus} />
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Students;
