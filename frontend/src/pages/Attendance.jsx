import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSections, getStudentAttendance, getSectionAttendance, markAttendance, getStudentEnrollments, getSectionEnrollments } from '../api';
import { CalendarCheck, CheckCircle, XCircle, Clock, AlertCircle, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { PageHeader, Card, SectionCard, TableWrapper, EmptyState, Spinner } from '../components/UI';

const STATUS_BADGE = {
  Present: 'badge-green',
  Absent:  'badge-red',
  Late:    'badge-yellow',
  Leave:   'badge-gray',
};

const STATUS_ICON = ({ status }) => {
  if (status === 'Present') return <CheckCircle size={14} className="text-emerald-500" />;
  if (status === 'Absent')  return <XCircle size={14} className="text-red-500" />;
  if (status === 'Late')    return <Clock size={14} className="text-amber-500" />;
  return <AlertCircle size={14} className="text-slate-400" />;
};

const MARK_COLORS = {
  Present: { active: 'bg-emerald-600 text-white border-emerald-600', idle: '' },
  Absent:  { active: 'bg-red-600 text-white border-red-600',         idle: '' },
  Late:    { active: 'bg-amber-500 text-white border-amber-500',     idle: '' },
  Leave:   { active: 'bg-slate-600 text-white border-slate-600',     idle: '' },
};

const Attendance = () => {
  const { user } = useAuth();
  const isFaculty = user?.role === 'Faculty';
  const isStudent = user?.role === 'Student';

  const [sections, setSections]           = useState([]);
  const [enrollments, setEnrollments]     = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [attendanceData, setAttendanceData] = useState([]);
  const [markMap, setMarkMap]             = useState({});
  const [loading, setLoading]             = useState(true);
  const [saving, setSaving]               = useState(false);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const sec = await getSections();
        setSections(sec.data || []);
        if (isStudent && user?.student_id) {
          const enr = await getStudentEnrollments(user.student_id);
          setEnrollments(enr.data || []);
        }
      } catch {}
      setLoading(false);
    };
    init();
  }, []);

  const loadSectionAttendance = async (sectionId, date) => {
    if (!sectionId || !date) return;
    try {
      const [attRes, enrRes] = await Promise.all([getSectionAttendance(sectionId, date), getSectionEnrollments(sectionId)]);
      const attData = attRes.data || [];
      const enrolledStudents = enrRes.data || [];
      const map = {};
      const mergedData = enrolledStudents.map(enr => {
        const student_id = enr.student_id;
        const existing = attData.find(r => r.student_id === student_id);
        if (existing) { map[student_id] = existing.status; return { ...existing, students: enr.students }; }
        return { student_id, section_id: sectionId, date, status: 'Not Marked', students: enr.students };
      });
      setAttendanceData(mergedData);
      setMarkMap(map);
    } catch { setAttendanceData([]); }
  };

  const handleSectionChange = (id) => { setSelectedSection(id); loadSectionAttendance(id, attendanceDate); };
  const handleDateChange    = (d)  => { setAttendanceDate(d); if (selectedSection) loadSectionAttendance(selectedSection, d); };
  const handleMark          = (studentId, status) => setMarkMap(prev => ({ ...prev, [studentId]: status }));

  const loadStudentAttendance = async (sectionId) => {
    if (!sectionId || !user?.student_id) return;
    setSelectedSection(sectionId);
    try { const res = await getStudentAttendance(user.student_id, sectionId); setAttendanceData(res.data || []); }
    catch { setAttendanceData([]); }
  };

  const handleSaveAttendance = async () => {
    if (!selectedSection || !attendanceDate) return toast.error('Select section and date.');
    if (attendanceData.length === 0) return toast.error('No students found in this section.');
    setSaving(true);
    try {
      const records = Object.entries(markMap).map(([student_id, status]) => ({ student_id, status }));
      if (records.length === 0) return toast.error('No attendance records to save.');
      await markAttendance({ section_id: selectedSection, date: attendanceDate, records });
      toast.success('Attendance saved!');
    } catch (err) { toast.error(err?.response?.data?.error || 'Failed to save.'); }
    setSaving(false);
  };

  const present    = attendanceData.filter(r => r.status === 'Present').length;
  const total      = attendanceData.length;
  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Attendance Records"
        subtitle={isFaculty ? 'Mark and manage student attendance for your sections.' : 'View your attendance history and current standing.'}
        actions={isFaculty && selectedSection && (
          <button onClick={handleSaveAttendance} disabled={saving} className="btn btn-primary">
            {saving ? <><span className="animate-spin">⏳</span> Saving...</> : <><CheckCircle size={15} /> Save Attendance</>}
          </button>
        )}
      />

      {/* Controls */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="form-group">
            <label className="form-label">Select Course Section</label>
            <select
              className="form-input form-select"
              value={selectedSection}
              onChange={e => isStudent ? loadStudentAttendance(e.target.value) : handleSectionChange(e.target.value)}
            >
              <option value="">— Choose a Course —</option>
              {(isStudent ? enrollments.map(e => e.sections) : sections).filter(Boolean).map(s => (
                <option key={s.section_id} value={s.section_id}>
                  {s.courses?.course_name} — {s.semester}
                </option>
              ))}
            </select>
          </div>

          {isFaculty && (
            <div className="form-group">
              <label className="form-label">Attendance Date</label>
              <input type="date" className="form-input" value={attendanceDate} onChange={e => handleDateChange(e.target.value)} />
            </div>
          )}

          {isStudent && selectedSection && total > 0 && (
            <div className="flex items-end">
              <div
                className={`flex items-center justify-between w-full p-4 rounded-xl border-2 ${percentage >= 75 ? 'border-emerald-200' : 'border-red-200'}`}
                style={{ background: percentage >= 75 ? 'rgba(240,253,244,0.80)' : 'rgba(254,242,242,0.80)' }}
              >
                <div>
                  <p className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${percentage >= 75 ? 'text-emerald-700' : 'text-red-700'}`}>
                    Total Attendance
                  </p>
                  <p className={`text-2xl font-extrabold ${percentage >= 75 ? 'text-emerald-800' : 'text-red-800'}`}>{percentage}%</p>
                </div>
                {percentage < 75 ? <AlertCircle size={22} className="text-red-500 animate-pulse" /> : <CheckCircle size={22} className="text-emerald-500" />}
              </div>
            </div>
          )}
        </div>
      </Card>

      {loading ? <Spinner /> : !selectedSection ? (
        <EmptyState icon={CalendarCheck} title="No Course Selected" subtitle="Choose a course from the dropdown above to view attendance." />
      ) : attendanceData.length === 0 && isFaculty ? (
        <EmptyState icon={Users} title="No Students Found" subtitle="Enrolled students will appear here to mark attendance." />
      ) : (
        <SectionCard title={`Attendance — ${attendanceData.length} Students`}>
          <TableWrapper>
            <thead>
              <tr>
                <th>Student</th>
                {isFaculty && <th>Roll No.</th>}
                {isStudent && <th>Date</th>}
                <th>Status</th>
                {isFaculty && <th className="text-center">Mark Attendance</th>}
              </tr>
            </thead>
            <tbody>
              {attendanceData.map(r => (
                <tr key={isStudent ? r.attendance_id : r.student_id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(239,246,255,0.80)', border: '1px solid rgba(219,234,254,0.60)' }}>
                        <STATUS_ICON status={r.status} />
                      </div>
                      <span className="font-semibold text-slate-800 text-sm">{r.students?.user_accounts?.username || r.students?.roll_number || '—'}</span>
                    </div>
                  </td>
                  {isFaculty && <td><code className="text-xs text-slate-500">{r.students?.roll_number}</code></td>}
                  {isStudent && <td className="text-sm text-slate-500">{r.date ? format(new Date(r.date), 'dd MMM yyyy') : '—'}</td>}
                  <td><span className={`badge ${STATUS_BADGE[r.status] || 'badge-gray'}`}>{r.status}</span></td>
                  {isFaculty && (
                    <td>
                      <div className="flex gap-1.5 justify-center">
                        {['Present', 'Absent', 'Late', 'Leave'].map(s => (
                          <button
                            key={s}
                            onClick={() => handleMark(r.student_id, s)}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                              markMap[r.student_id] === s
                                ? MARK_COLORS[s].active
                                : 'bg-white text-slate-500 border-slate-200 hover:border-blue-300 hover:text-blue-600'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </TableWrapper>
        </SectionCard>
      )}
    </div>
  );
};

export default Attendance;
