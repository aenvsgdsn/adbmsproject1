import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getSections, getSectionGrades, getStudentGrades, getStudentResults, uploadGrades, getStudentEnrollments
} from '../api';
import { BarChart2, Loader2, Upload, TrendingUp, Award, X, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const gradeColor = (grade) => {
  if (!grade) return 'badge-gray';
  if (grade.startsWith('A')) return 'badge-green';
  if (grade.startsWith('B')) return 'badge-blue';
  if (grade.startsWith('C')) return 'badge-yellow';
  return 'badge-red';
};

const Modal = ({ title, onClose, children }) => (
  <div className="modal-backdrop animate-fade-in" onClick={onClose}>
    <div className="modal w-full max-w-2xl animate-slide-up" onClick={e => e.stopPropagation()}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900 font-outfit">{title}</h2>
        <button onClick={onClose} className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"><X size={20} /></button>
      </div>
      {children}
    </div>
  </div>
);

const Results = () => {
  const { user } = useAuth();
  const isFaculty = user?.role === 'Faculty';
  const isStudent = user?.role === 'Student';

  const [sections, setSections] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [sectionGrades, setSectionGrades] = useState([]);
  const [studentGrades, setStudentGrades] = useState([]);
  const [studentResults, setStudentResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [gradeEntries, setGradeEntries] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const sec = await getSections();
        setSections(sec.data || []);
        if (isStudent && user?.student_id) {
          const [grades, results, enr] = await Promise.all([
            getStudentGrades(user.student_id),
            getStudentResults(user.student_id),
            getStudentEnrollments(user.student_id)
          ]);
          setStudentGrades(grades.data || []);
          setStudentResults(results.data || []);
          setEnrollments(enr.data || []);
        }
      } catch { }
      setLoading(false);
    };
    init();
  }, []);

  const loadSectionGrades = async (sectionId) => {
    setSelectedSection(sectionId);
    if (!sectionId) return;
    try {
      const res = await getSectionGrades(sectionId);
      const grades = res.data || [];
      setSectionGrades(grades);
      setGradeEntries(grades.map(g => ({
        student_id: g.student_id,
        section_id: sectionId,
        marks: g.marks ?? '',
        name: g.students?.user_accounts?.username || g.student_id,
        roll: g.students?.roll_number || '—'
      })));
    } catch { setSectionGrades([]); }
  };

  const handleGradeChange = (studentId, marks) => {
    setGradeEntries(prev => prev.map(e => e.student_id === studentId ? { ...e, marks } : e));
  };

  const handleSaveGrades = async () => {
    setSaving(true);
    try {
      const data = gradeEntries
        .filter(e => e.marks !== '')
        .map(e => ({ student_id: e.student_id, section_id: e.section_id, marks: parseFloat(e.marks) }));
      if (data.length === 0) return toast.error('Enter marks for at least one student.');
      await uploadGrades({ grades: data });
      toast.success('Grades saved and GPA updated!');
      setShowGradeModal(false);
      loadSectionGrades(selectedSection);
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to save grades.');
    }
    setSaving(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-indigo-600" size={32} /></div>
  );

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-outfit">Results & Grades</h1>
          <p className="text-slate-500 mt-1 font-medium">
            {isFaculty ? 'Upload and manage grades for your teaching sections.' : 'Your academic performance and grade history.'}
          </p>
        </div>
        {isFaculty && selectedSection && (
          <button onClick={() => setShowGradeModal(true)} className="btn btn-primary shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2">
            <Upload size={16} /> Upload Grades
          </button>
        )}
      </div>

      {/* Faculty View */}
      {isFaculty && (
        <>
          <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-sm">
            <label className="text-sm font-semibold text-slate-700 block mb-2">Select Your Teaching Section</label>
            <select className="w-full max-w-md px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm" value={selectedSection}
              onChange={e => loadSectionGrades(e.target.value)}>
              <option value="">— Choose a Section —</option>
              {sections.map(s => (
                <option key={s.section_id} value={s.section_id}>
                  {s.courses?.course_name} — {s.semester}
                </option>
              ))}
            </select>
          </div>
          {selectedSection && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden animate-slide-up">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                      <th className="p-4">Student Name</th><th className="p-4">Roll No.</th><th className="p-4">Marks</th><th className="p-4">Grade</th><th className="p-4">Grade Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sectionGrades.length === 0 ? (
                      <tr><td colSpan={5} className="text-center py-12 text-slate-400 text-sm">
                        No grades uploaded yet. Click "Upload Grades" to begin.
                      </td></tr>
                    ) : sectionGrades.map(g => (
                      <tr key={g.grade_id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-semibold text-slate-800">{g.students?.user_accounts?.username}</td>
                        <td className="p-4 text-slate-500 text-xs font-mono">{g.students?.roll_number}</td>
                        <td className="p-4"><span className="font-bold text-slate-800">{g.marks ?? '—'}</span><span className="text-slate-400">/100</span></td>
                        <td className="p-4"><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${g.grade?.startsWith('A') ? 'bg-emerald-100 text-emerald-700' : g.grade?.startsWith('B') ? 'bg-blue-100 text-blue-700' : g.grade?.startsWith('C') ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{g.grade || '—'}</span></td>
                        <td className="p-4 font-medium text-slate-700">{g.grade_points ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Student View */}
      {isStudent && (
        <div className="space-y-6">
          {/* CGPA Summary Banner */}
          {studentResults.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {studentResults.slice(0, 1).map(r => (
                <>
                  <div key={r.result_id + '-cgpa'} className="col-span-2 md:col-span-1 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 text-white shadow-lg">
                    <p className="text-indigo-200 text-xs font-semibold uppercase tracking-widest mb-2">Current CGPA</p>
                    <p className="text-5xl font-extrabold">{r.cgpa?.toFixed(2) ?? '—'}</p>
                    <p className="text-indigo-200 text-sm mt-2">Out of 4.0 Scale</p>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:-translate-y-1 transition-all">
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2">Last Sem GPA</p>
                    <p className="text-3xl font-extrabold text-slate-800">{r.semester_gpa?.toFixed(2)}</p>
                    <p className="text-slate-400 text-xs mt-2">{r.semester}</p>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:-translate-y-1 transition-all">
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2">Courses Graded</p>
                    <p className="text-3xl font-extrabold text-slate-800">{studentGrades.length}</p>
                    <p className="text-slate-400 text-xs mt-2">Total Courses</p>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:-translate-y-1 transition-all">
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2">Honor Status</p>
                    <p className="text-xl font-extrabold text-slate-800">{(r.cgpa || 0) >= 3.5 ? '🏆 Dean\'s List' : (r.cgpa || 0) >= 3.0 ? '⭐ Good' : '📚 Average'}</p>
                    <p className="text-slate-400 text-xs mt-2">Academic Standing</p>
                  </div>
                </>
              ))}
            </div>
          )}

          {/* Semester Results */}
          {studentResults.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <TrendingUp size={16} className="text-indigo-500" /> Semester-wise Performance
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead><tr className="border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold"><th className="p-4">Semester</th><th className="p-4">Semester GPA</th><th className="p-4">Cumulative GPA</th></tr></thead>
                  <tbody className="divide-y divide-slate-50">
                    {studentResults.map(r => (
                      <tr key={r.result_id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-semibold text-slate-800">{r.semester}</td>
                        <td className="p-4"><span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-bold">{r.semester_gpa?.toFixed(2)}</span></td>
                        <td className="p-4"><span className="text-lg font-bold text-slate-900">{r.cgpa?.toFixed(2)}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Course Grades */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Award size={16} className="text-indigo-500" /> Course Grades
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead><tr className="border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold"><th className="p-4">Course Name</th><th className="p-4">Semester</th><th className="p-4">Marks</th><th className="p-4">Grade</th><th className="p-4">Grade Points</th></tr></thead>
                <tbody className="divide-y divide-slate-50">
                  {studentGrades.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-12 text-slate-400 text-sm">
                      No grades recorded yet. Grades will appear here after your instructor uploads them.
                    </td></tr>
                  ) : studentGrades.map(g => (
                    <tr key={g.grade_id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-semibold text-slate-800">{g.sections?.courses?.course_name || '—'}</td>
                      <td className="p-4"><span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-semibold">{g.sections?.semester}</span></td>
                      <td className="p-4"><span className="font-bold text-slate-800">{g.marks ?? '—'}</span><span className="text-slate-400">/100</span></td>
                      <td className="p-4"><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${g.grade?.startsWith('A') ? 'bg-emerald-100 text-emerald-700' : g.grade?.startsWith('B') ? 'bg-blue-100 text-blue-700' : g.grade?.startsWith('C') ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{g.grade || '—'}</span></td>
                      <td className="p-4 font-medium text-slate-700">{g.grade_points ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Grade Upload Modal */}
      {showGradeModal && (
        <Modal title={`Upload Grades — ${sections.find(s => s.section_id === selectedSection)?.courses?.course_name || 'Section'}`} onClose={() => setShowGradeModal(false)}>
          <div className="max-h-[420px] overflow-y-auto space-y-2 pr-1 -mr-2">
            {gradeEntries.map(entry => (
              <div key={entry.student_id} className="flex items-center gap-4 p-3 rounded-lg border border-slate-100 bg-slate-50 hover:bg-white transition-colors">
                <div className="w-9 h-9 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-sm shrink-0 uppercase">
                  {entry.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{entry.name}</p>
                  <p className="text-xs text-slate-400 font-mono">{entry.roll}</p>
                </div>
                <div className="w-28 shrink-0">
                  <input type="number" min="0" max="100"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-center font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="0-100" value={entry.marks}
                    onChange={e => handleGradeChange(entry.student_id, e.target.value)} />
                </div>
              </div>
            ))}
            {gradeEntries.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-8">No enrolled students found for this section.</p>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-4">
            <button type="button" onClick={() => setShowGradeModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
            <button onClick={handleSaveGrades} disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />} Save All Grades
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Results;
