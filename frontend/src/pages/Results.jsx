import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSections, getSectionGrades, getStudentGrades, getStudentResults, uploadGrades } from '../api';
import { BarChart2, Upload, TrendingUp, Award, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageHeader, SectionCard, TableWrapper, Modal, EmptyState, Spinner, StatCard } from '../components/UI';

const gradeClass = (grade) => {
  if (!grade) return 'badge-gray';
  if (grade.startsWith('A')) return 'badge-green';
  if (grade.startsWith('B')) return 'badge-blue';
  if (grade.startsWith('C')) return 'badge-yellow';
  return 'badge-red';
};

const Results = () => {
  const { user } = useAuth();
  const isFaculty = user?.role === 'Faculty';
  const isStudent = user?.role === 'Student';

  const [sections, setSections]           = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [sectionGrades, setSectionGrades] = useState([]);
  const [studentGrades, setStudentGrades] = useState([]);
  const [studentResults, setStudentResults] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [gradeEntries, setGradeEntries]   = useState([]);
  const [saving, setSaving]               = useState(false);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const sec = await getSections();
        setSections(sec.data || []);
        if (isStudent && user?.student_id) {
          const [grades, results] = await Promise.all([getStudentGrades(user.student_id), getStudentResults(user.student_id)]);
          setStudentGrades(grades.data || []);
          setStudentResults(results.data || []);
        }
      } catch {}
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
      setGradeEntries(grades.map(g => ({ student_id: g.student_id, section_id: sectionId, marks: g.marks ?? '', name: g.students?.user_accounts?.username || g.student_id, roll: g.students?.roll_number || '—' })));
    } catch { setSectionGrades([]); }
  };

  const handleGradeChange = (studentId, marks) => setGradeEntries(prev => prev.map(e => e.student_id === studentId ? { ...e, marks } : e));

  const handleSaveGrades = async () => {
    setSaving(true);
    try {
      const data = gradeEntries.filter(e => e.marks !== '').map(e => ({ student_id: e.student_id, section_id: e.section_id, marks: parseFloat(e.marks) }));
      if (data.length === 0) return toast.error('Enter marks for at least one student.');
      await uploadGrades({ grades: data });
      toast.success('Grades saved and GPA updated!');
      setShowGradeModal(false);
      loadSectionGrades(selectedSection);
    } catch (err) { toast.error(err?.response?.data?.error || 'Failed to save grades.'); }
    setSaving(false);
  };

  if (loading) return <Spinner />;

  const latestResult = studentResults[0];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Results & Grades"
        subtitle={isFaculty ? 'Upload and manage grades for your sections.' : 'Your academic performance and grade history.'}
      />

      {/* Faculty View */}
      {isFaculty && (
        <>
          <div className="card p-5 mb-6">
            <div className="form-group max-w-md">
              <label className="form-label">Select Your Teaching Section</label>
              <select className="form-input form-select" value={selectedSection} onChange={e => loadSectionGrades(e.target.value)}>
                <option value="">— Choose a Section —</option>
                {sections.map(s => <option key={s.section_id} value={s.section_id}>{s.courses?.course_name} — {s.semester}</option>)}
              </select>
            </div>
          </div>

          {selectedSection && (
            <SectionCard 
              title="Student Grades"
              actions={
                <button onClick={() => setShowGradeModal(true)} className="btn btn-primary shrink-0">
                  <Upload size={15} /> Upload Grades
                </button>
              }
            >
              <TableWrapper>
                <thead>
                  <tr>
                    <th>Student</th><th>Roll No.</th><th>Marks</th><th>Grade</th><th>Grade Points</th>
                  </tr>
                </thead>
                <tbody>
                  {sectionGrades.length === 0 ? (
                    <tr><td colSpan={5}><EmptyState icon={Upload} title="No grades uploaded yet" subtitle='Click "Upload Grades" to begin.' /></td></tr>
                  ) : sectionGrades.map(g => (
                    <tr key={g.grade_id}>
                      <td><span className="font-semibold text-slate-800">{g.students?.user_accounts?.username}</span></td>
                      <td><code className="text-xs text-slate-500">{g.students?.roll_number}</code></td>
                      <td><span className="font-bold text-slate-800">{g.marks ?? '—'}</span><span className="text-slate-400 text-xs">/100</span></td>
                      <td><span className={`badge ${gradeClass(g.grade)}`}>{g.grade || '—'}</span></td>
                      <td className="font-medium text-slate-700">{g.grade_points ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </TableWrapper>
            </SectionCard>
          )}
        </>
      )}

      {/* Student View */}
      {isStudent && (
        <div className="space-y-6">
          {latestResult && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* CGPA Hero Card */}
              <div
                className="col-span-2 lg:col-span-1 p-6 rounded-2xl text-white"
                style={{ background: 'linear-gradient(135deg, #1d4ed8, #4f46e5)', boxShadow: '0 8px 24px rgba(37,99,235,0.30)' }}
              >
                <p className="text-blue-200 text-[10px] font-bold uppercase tracking-widest mb-2">Current CGPA</p>
                <p className="text-5xl font-extrabold">{latestResult.cgpa?.toFixed(2) ?? '—'}</p>
                <p className="text-blue-200 text-sm mt-2">Out of 4.0 Scale</p>
              </div>
              <StatCard label="Last Sem GPA"   value={latestResult.semester_gpa?.toFixed(2)} sub={latestResult.semester} icon={TrendingUp} bgClass="bg-blue-50" colorClass="text-blue-600" />
              <StatCard label="Courses Graded" value={studentGrades.length} sub="Total Courses"  icon={BarChart2}  bgClass="bg-indigo-50" colorClass="text-indigo-600" />
              <StatCard
                label="Honor Status"
                value={(latestResult.cgpa || 0) >= 3.5 ? "Dean's List" : (latestResult.cgpa || 0) >= 3.0 ? 'Good Standing' : 'Average'}
                icon={Award}
                bgClass={(latestResult.cgpa || 0) >= 3.5 ? 'bg-amber-50' : 'bg-blue-50'}
                colorClass={(latestResult.cgpa || 0) >= 3.5 ? 'text-amber-600' : 'text-blue-600'}
              />
            </div>
          )}

          {studentResults.length > 0 && (
            <SectionCard title="Semester-wise Performance">
              <TableWrapper>
                <thead><tr><th>Semester</th><th>Semester GPA</th><th>Cumulative GPA</th></tr></thead>
                <tbody>
                  {studentResults.map(r => (
                    <tr key={r.result_id}>
                      <td className="font-semibold text-slate-800">{r.semester}</td>
                      <td><span className="badge badge-blue">{r.semester_gpa?.toFixed(2)}</span></td>
                      <td><span className="text-lg font-bold text-slate-900">{r.cgpa?.toFixed(2)}</span></td>
                    </tr>
                  ))}
                </tbody>
              </TableWrapper>
            </SectionCard>
          )}

          <SectionCard title="Course Grades">
            <TableWrapper>
              <thead><tr><th>Course</th><th>Semester</th><th>Marks</th><th>Grade</th><th>Grade Points</th></tr></thead>
              <tbody>
                {studentGrades.length === 0 ? (
                  <tr><td colSpan={5}><EmptyState icon={BarChart2} title="No grades recorded yet" subtitle="Grades will appear here after your instructor uploads them." /></td></tr>
                ) : studentGrades.map(g => (
                  <tr key={g.grade_id}>
                    <td className="font-semibold text-slate-800">{g.sections?.courses?.course_name || '—'}</td>
                    <td><span className="badge badge-gray">{g.sections?.semester}</span></td>
                    <td><span className="font-bold text-slate-800">{g.marks ?? '—'}</span><span className="text-slate-400 text-xs">/100</span></td>
                    <td><span className={`badge ${gradeClass(g.grade)}`}>{g.grade || '—'}</span></td>
                    <td className="font-medium text-slate-700">{g.grade_points ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </TableWrapper>
          </SectionCard>
        </div>
      )}

      {/* Grade Upload Modal */}
      {showGradeModal && (
        <Modal
          title={`Upload Grades — ${sections.find(s => s.section_id === selectedSection)?.courses?.course_name || 'Section'}`}
          onClose={() => setShowGradeModal(false)}
          maxWidth="max-w-2xl"
        >
          <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
            {gradeEntries.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">No enrolled students found for this section.</p>
            ) : gradeEntries.map(entry => (
              <div
                key={entry.student_id}
                className="flex items-center gap-4 p-3 rounded-xl transition-colors"
                style={{ background: 'rgba(239,246,255,0.50)', border: '1px solid rgba(219,234,254,0.60)' }}
              >
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0 uppercase">
                  {entry.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{entry.name}</p>
                  <p className="text-xs text-slate-400 font-mono">{entry.roll}</p>
                </div>
                <input
                  type="number" min="0" max="100"
                  className="form-input w-24 text-center font-bold text-sm"
                  placeholder="0–100"
                  value={entry.marks}
                  onChange={e => handleGradeChange(entry.student_id, e.target.value)}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 pt-4 mt-4" style={{ borderTop: '1px solid rgba(226,232,240,0.70)' }}>
            <button onClick={() => setShowGradeModal(false)} className="btn btn-secondary">Cancel</button>
            <button onClick={handleSaveGrades} disabled={saving} className="btn btn-primary">
              {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : <><Upload size={14} /> Save All Grades</>}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Results;
