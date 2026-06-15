import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getSections, enrollStudent, getStudentEnrollments, withdrawEnrollment, getStudents, getCourses
} from '../api';
import { ClipboardList, Plus, X, Loader2, AlertCircle, CheckCircle, BookOpen } from 'lucide-react';
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

const statusBadge = (status) => {
  if (status === 'Enrolled') return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold border bg-emerald-100 text-emerald-700 border-emerald-200">Enrolled</span>;
  if (status === 'Withdrawn') return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold border bg-rose-100 text-rose-700 border-rose-200">Withdrawn</span>;
  return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold border bg-slate-100 text-slate-700 border-slate-200">{status}</span>;
};

const Enrollments = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  const isStudent = user?.role === 'Student';

  const [enrollments, setEnrollments] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [form, setForm] = useState({ student_id: '', section_id: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [sec, crs] = await Promise.all([getSections(), getCourses()]);
      setSections(sec.data || []);
      setCourses(crs.data || []);

      if (isAdmin) {
        const std = await getStudents();
        setStudents(std.data || []);
        // Admin sees all enrollments via sections
        const allEnrollments = [];
        setEnrollments(allEnrollments);
      } else if (isStudent && user?.student_id) {
        const res = await getStudentEnrollments(user.student_id);
        setEnrollments(res.data || []);
      }
    } catch { }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleEnroll = async e => {
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
    try {
      await withdrawEnrollment(id);
      toast.success('Withdrawn successfully.');
      load();
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Withdrawal failed.');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-outfit">{isStudent ? 'My Courses' : 'Enrollment Management'}</h1>
          <p className="text-slate-500 mt-1 font-medium">
            {isStudent ? 'Your enrolled courses for the current academic session.' : 'Manage student course enrollments and records.'}
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 hover:-translate-y-0.5 transition-all">
          <Plus size={16} /> {isStudent ? 'Enroll in Course' : 'Enroll Student'}
        </button>
      </div>

      {/* Info banner for students */}
      {isStudent && (
        <div className="flex items-start gap-4 p-5 bg-indigo-50 border border-indigo-100 rounded-xl mb-8 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
            <AlertCircle size={18} className="text-indigo-600" />
          </div>
          <div className="text-sm text-indigo-800 pt-0.5">
            <span className="font-bold">Enrollment Requirements:</span> Your fee must be cleared, you must be an active student, no duplicate enrollments, and section seats must be available.
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48"><Loader2 className="animate-spin text-indigo-600" size={32} /></div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden animate-slide-up">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead><tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold bg-slate-50">
                <th className="p-4">Course Details</th>
                <th className="p-4">Section / Semester</th>
                <th className="p-4">Faculty</th>
                <th className="p-4">Status</th>
                <th className="p-4">Enrolled At</th>
                {isStudent && <th className="p-4"></th>}
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {enrollments.length === 0 ? (
                  <tr><td colSpan={6}>
                    <div className="py-20 text-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-inner">
                        <BookOpen size={28} className="text-slate-300" />
                      </div>
                      <p className="text-base font-bold text-slate-800">No active enrollments</p>
                      <p className="text-sm text-slate-500 mt-1">Click "Enroll in Course" to get started.</p>
                    </div>
                  </td></tr>
                ) : enrollments.map(en => (
                  <tr key={en.enrollment_id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-slate-800">{en.sections?.courses?.course_name || '—'}</p>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">{en.sections?.courses?.course_code}</p>
                    </td>
                    <td className="p-4">
                      <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-1 rounded text-xs font-semibold">{en.sections?.semester || '—'}</span>
                    </td>
                    <td className="p-4 text-sm font-semibold text-slate-700">{en.sections?.faculty?.user_accounts?.username || '—'}</td>
                    <td className="p-4">{statusBadge(en.status)}</td>
                    <td className="p-4 text-slate-500 text-xs font-medium">{en.enrolled_at ? format(new Date(en.enrolled_at), 'dd MMM yyyy') : '—'}</td>
                    {isStudent && (
                      <td className="p-4 text-right">
                        {en.status === 'Enrolled' && (
                          <button onClick={() => handleWithdraw(en.enrollment_id)} className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 rounded-lg text-xs font-bold transition-colors border border-rose-200">
                            Withdraw
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <Modal title={isStudent ? 'Enroll in a Course' : 'Enroll a Student'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleEnroll} className="space-y-5">
            {isAdmin && (
              <div className="form-group">
                <label className="text-sm font-bold text-slate-700 mb-1">Student</label>
                <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required value={form.student_id}
                  onChange={e => setForm({ ...form, student_id: e.target.value })}>
                  <option value="">Select Student</option>
                  {students.map(s => <option key={s.student_id} value={s.student_id}>{s.user_accounts?.username} — {s.roll_number}</option>)}
                </select>
              </div>
            )}
            {isStudent && (
              <input type="hidden" value={user?.student_id || ''} />
            )}
            <div className="form-group">
              <label className="text-sm font-bold text-slate-700 mb-1">Course</label>
              <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required value={selectedCourse}
                onChange={e => {
                  setSelectedCourse(e.target.value);
                  setForm({ ...form, section_id: '' });
                }}>
                <option value="">Select Course</option>
                {courses.map(c => (
                  <option key={c.course_id} value={c.course_id}>
                    {c.course_name} ({c.course_code})
                  </option>
                ))}
              </select>
            </div>
            {selectedCourse && (
              <div className="form-group animate-slide-up">
                <label className="text-sm font-bold text-slate-700 mb-1">Course Section</label>
                <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required value={form.section_id}
                  onChange={e => setForm({ ...form, section_id: e.target.value, student_id: isStudent ? user.student_id : form.student_id })}>
                  <option value="">Select Section</option>
                  {sections.filter(s => s.course_id === selectedCourse).length === 0 ? (
                    <option value="" disabled>No sections available for this course</option>
                  ) : (
                    sections.filter(s => s.course_id === selectedCourse).map(s => (
                      <option key={s.section_id} value={s.section_id} disabled={s.available_seats === 0}>
                        {s.semester} — {s.available_seats} seats available — Instructor: {s.faculty?.user_accounts?.username || 'TBA'}
                      </option>
                    ))
                  )}
                </select>
              </div>
            )}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
              <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">Cancel</button>
              <button type="submit" disabled={saving} className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />} 
                {saving ? 'Processing...' : 'Confirm Enrollment'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Enrollments;
