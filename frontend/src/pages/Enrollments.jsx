import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSections, enrollStudent, getStudentEnrollments, withdrawEnrollment, getStudents, getCourses } from '../api';
import { ClipboardList, Plus, AlertCircle, CheckCircle, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { PageHeader, SectionCard, TableWrapper, Modal, ModalFooter, FormField, EmptyState, Spinner } from '../components/UI';

const STATUS_BADGE = {
  Enrolled:  'badge-green',
  Withdrawn: 'badge-red',
};

const Enrollments = () => {
  const { user } = useAuth();
  const isAdmin   = user?.role === 'Admin';
  const isStudent = user?.role === 'Student';

  const [enrollments, setEnrollments]     = useState([]);
  const [sections, setSections]           = useState([]);
  const [students, setStudents]           = useState([]);
  const [courses, setCourses]             = useState([]);
  const [loading, setLoading]             = useState(true);
  const [showModal, setShowModal]         = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [form, setForm]                   = useState({ student_id: '', section_id: '' });
  const [saving, setSaving]               = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [sec, crs] = await Promise.all([getSections(), getCourses()]);
      setSections(sec.data || []);
      setCourses(crs.data || []);
      if (isAdmin) {
        const std = await getStudents();
        setStudents(std.data || []);
        setEnrollments([]);
      } else if (isStudent && user?.student_id) {
        const res = await getStudentEnrollments(user.student_id);
        setEnrollments(res.data || []);
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleEnroll = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await enrollStudent(form);
      toast.success('Enrollment successful!');
      setShowModal(false);
      setForm({ student_id: '', section_id: '' });
      load();
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Enrollment failed. Check prerequisites, seats, and fee status.');
    }
    setSaving(false);
  };

  const handleWithdraw = async (id) => {
    if (!window.confirm('Withdraw from this course?')) return;
    try { await withdrawEnrollment(id); toast.success('Withdrawn successfully.'); load(); }
    catch (err) { toast.error(err?.response?.data?.error || 'Withdrawal failed.'); }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={isStudent ? 'My Courses' : 'Enrollment Management'}
        subtitle={isStudent ? 'Your enrolled courses for the current academic session.' : 'Manage student course enrollments and records.'}
      />

      {/* Info banner for students */}
      {isStudent && (
        <div
          className="flex items-start gap-4 p-4 rounded-xl mb-6"
          style={{ background: 'rgba(239,246,255,0.70)', border: '1px solid rgba(147,197,253,0.40)' }}
        >
          <AlertCircle size={18} className="text-blue-600 mt-0.5 shrink-0" />
          <p className="text-sm text-blue-800">
            <span className="font-bold">Enrollment Requirements: </span>
            Your fee must be cleared, you must be an active student, no duplicate enrollments, and section seats must be available.
          </p>
        </div>
      )}

      {loading ? <Spinner /> : (
        <SectionCard 
          title={`${enrollments.length} Enrollment${enrollments.length !== 1 ? 's' : ''}`}
          actions={
            <button onClick={() => setShowModal(true)} className="btn btn-primary shrink-0">
              <Plus size={15} /> {isStudent ? 'Enroll in Course' : 'Enroll Student'}
            </button>
          }
        >
          <TableWrapper>
            <thead>
              <tr>
                <th>Course</th>
                <th>Section / Semester</th>
                <th>Faculty</th>
                <th>Status</th>
                <th>Enrolled At</th>
                {isStudent && <th />}
              </tr>
            </thead>
            <tbody>
              {enrollments.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState icon={BookOpen} title="No active enrollments" subtitle='Click "Enroll in Course" to get started.' />
                  </td>
                </tr>
              ) : enrollments.map(en => (
                <tr key={en.enrollment_id}>
                  <td>
                    <p className="font-semibold text-slate-800 text-sm">{en.sections?.courses?.course_name || '—'}</p>
                    <p className="text-xs text-blue-500 font-mono mt-0.5">{en.sections?.courses?.course_code}</p>
                  </td>
                  <td><span className="badge badge-gray">{en.sections?.semester || '—'}</span></td>
                  <td className="text-sm font-medium text-slate-600">{en.sections?.faculty?.user_accounts?.username || '—'}</td>
                  <td><span className={`badge ${STATUS_BADGE[en.status] || 'badge-gray'}`}>{en.status}</span></td>
                  <td className="text-slate-400 text-xs">{en.enrolled_at ? format(new Date(en.enrolled_at), 'dd MMM yyyy') : '—'}</td>
                  {isStudent && (
                    <td className="text-right">
                      {en.status === 'Enrolled' && (
                        <button onClick={() => handleWithdraw(en.enrollment_id)} className="btn btn-danger btn-sm">
                          Withdraw
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </TableWrapper>
        </SectionCard>
      )}

      {showModal && (
        <Modal title={isStudent ? 'Enroll in a Course' : 'Enroll a Student'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleEnroll} className="space-y-4">
            {isAdmin && (
              <FormField label="Student">
                <select className="form-input form-select" required value={form.student_id} onChange={e => setForm({ ...form, student_id: e.target.value })}>
                  <option value="">Select Student</option>
                  {students.map(s => <option key={s.student_id} value={s.student_id}>{s.user_accounts?.username} — {s.roll_number}</option>)}
                </select>
              </FormField>
            )}

            <FormField label="Course">
              <select className="form-input form-select" required value={selectedCourse} onChange={e => { setSelectedCourse(e.target.value); setForm({ ...form, section_id: '' }); }}>
                <option value="">Select Course</option>
                {courses.map(c => <option key={c.course_id} value={c.course_id}>{c.course_name} ({c.course_code})</option>)}
              </select>
            </FormField>

            {selectedCourse && (
              <FormField label="Course Section">
                <select className="form-input form-select" required value={form.section_id}
                  onChange={e => setForm({ ...form, section_id: e.target.value, student_id: isStudent ? user.student_id : form.student_id })}>
                  <option value="">Select Section</option>
                  {sections.filter(s => s.course_id === selectedCourse).length === 0 ? (
                    <option value="" disabled>No sections available</option>
                  ) : sections.filter(s => s.course_id === selectedCourse).map(s => (
                    <option key={s.section_id} value={s.section_id} disabled={s.available_seats === 0}>
                      {s.semester} — {s.available_seats} seats — {s.faculty?.user_accounts?.username || 'TBA'}
                    </option>
                  ))}
                </select>
              </FormField>
            )}

            <ModalFooter onCancel={() => setShowModal(false)} submitLabel="Confirm Enrollment" loading={saving} icon={CheckCircle} />
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Enrollments;
