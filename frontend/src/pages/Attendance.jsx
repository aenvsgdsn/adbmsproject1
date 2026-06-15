import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getSections, getStudentAttendance, getSectionAttendance, markAttendance, getStudentEnrollments, getSectionEnrollments
} from '../api';
import { CalendarCheck, Loader2, CheckCircle, XCircle, Clock, AlertCircle, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const statusColors = {
  Present: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Absent: 'bg-rose-100 text-rose-700 border-rose-200',
  Late: 'bg-amber-100 text-amber-700 border-amber-200',
  Leave: 'bg-slate-100 text-slate-700 border-slate-200',
};

const AttendanceStatusIcon = ({ status }) => {
  if (status === 'Present') return <CheckCircle size={14} className="text-green-500" />;
  if (status === 'Absent') return <XCircle size={14} className="text-red-500" />;
  if (status === 'Late') return <Clock size={14} className="text-yellow-500" />;
  return <AlertCircle size={14} className="text-slate-400" />;
};

const Attendance = () => {
  const { user } = useAuth();
  const isFaculty = user?.role === 'Faculty';
  const isStudent = user?.role === 'Student';

  const [sections, setSections] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [attendanceData, setAttendanceData] = useState([]);
  const [markMap, setMarkMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
      } catch { }
      setLoading(false);
    };
    init();
  }, []);

  const loadSectionAttendance = async (sectionId, date) => {
    if (!sectionId || !date) return;
    try {
      // Fetch both attendance records and enrolled students
      const [attRes, enrRes] = await Promise.all([
        getSectionAttendance(sectionId, date),
        getSectionEnrollments(sectionId)
      ]);
      const attData = attRes.data || [];
      const enrolledStudents = enrRes.data || [];

      // Merge: Start with enrolled students and overlay any existing attendance status
      const map = {};
      const mergedData = enrolledStudents.map(enr => {
        const student_id = enr.student_id;
        const existingRecord = attData.find(r => r.student_id === student_id);
        if (existingRecord) {
          map[student_id] = existingRecord.status;
          return { ...existingRecord, students: enr.students }; // Use students data from enrollment for consistency
        } else {
          return {
            student_id,
            section_id: sectionId,
            date,
            status: 'Not Marked',
            students: enr.students
          };
        }
      });
      
      setAttendanceData(mergedData);
      setMarkMap(map);
    } catch { setAttendanceData([]); }
  };

  const handleSectionChange = (id) => {
    setSelectedSection(id);
    loadSectionAttendance(id, attendanceDate);
  };

  const handleDateChange = (d) => {
    setAttendanceDate(d);
    if (selectedSection) loadSectionAttendance(selectedSection, d);
  };

  const handleMark = (studentId, status) => {
    setMarkMap(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSaveAttendance = async () => {
    if (!selectedSection || !attendanceDate) return toast.error('Select section and date.');
    const section = sections.find(s => s.section_id === selectedSection);
    if (!section?.enrollments?.length && attendanceData.length === 0) {
      return toast.error('No students found in this section.');
    }
    setSaving(true);
    try {
      const records = Object.entries(markMap).map(([student_id, status]) => ({
        student_id, section_id: selectedSection, date: attendanceDate, status
      }));
      if (records.length === 0) return toast.error('No attendance records to save.');
      await markAttendance({ records });
      toast.success('Attendance saved!');
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to save attendance.');
    }
    setSaving(false);
  };

  // For student: show their attendance across enrolled sections
  const loadStudentAttendance = async (sectionId) => {
    if (!sectionId || !user?.student_id) return;
    setSelectedSection(sectionId);
    try {
      const res = await getStudentAttendance(user.student_id, sectionId);
      setAttendanceData(res.data || []);
    } catch { setAttendanceData([]); }
  };

  const present = attendanceData.filter(r => r.status === 'Present').length;
  const total = attendanceData.length;
  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-outfit">Attendance Records</h1>
          <p className="text-slate-500 mt-1 font-medium">
            {isFaculty ? 'Mark and manage student attendance for your teaching sections.' : 'View your attendance history and current standing.'}
          </p>
        </div>
        {isFaculty && selectedSection && (
          <button onClick={handleSaveAttendance} disabled={saving} className="btn btn-primary shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 hover:-translate-y-0.5 transition-all">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />} 
            {saving ? 'Saving...' : 'Save Attendance'}
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="form-group">
            <label className="text-sm font-bold text-slate-700 mb-1">Select Course Section</label>
            <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium"
              value={selectedSection}
              onChange={e => isStudent ? loadStudentAttendance(e.target.value) : handleSectionChange(e.target.value)}>
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
              <label className="text-sm font-bold text-slate-700 mb-1">Attendance Date</label>
              <input type="date" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium text-slate-700" value={attendanceDate}
                onChange={e => handleDateChange(e.target.value)} />
            </div>
          )}
          {isStudent && selectedSection && total > 0 && (
            <div className="flex items-end">
              <div className={`px-5 py-3 rounded-xl border-2 flex items-center gap-3 w-full justify-between shadow-sm ${
                percentage >= 75 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-0.5">Total Attendance</p>
                  <p className="text-2xl font-extrabold">{percentage}%</p>
                </div>
                {percentage < 75 && <AlertCircle size={24} className="text-rose-500 animate-pulse" />}
                {percentage >= 75 && <CheckCircle size={24} className="text-emerald-500" />}
              </div>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><Loader2 className="animate-spin text-indigo-600" size={32} /></div>
      ) : !selectedSection ? (
        <div className="py-24 text-center bg-white rounded-xl border border-slate-200 border-dashed animate-slide-up">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-inner">
            <CalendarCheck size={28} className="text-slate-300" />
          </div>
          <p className="text-base font-bold text-slate-800">No Course Selected</p>
          <p className="text-sm font-medium text-slate-500 mt-1">Please choose a course from the dropdown above</p>
        </div>
      ) : attendanceData.length === 0 && isFaculty ? (
        <div className="py-24 text-center bg-white rounded-xl border border-slate-200 border-dashed animate-slide-up">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-inner">
            <Users size={28} className="text-slate-300" />
          </div>
          <p className="text-base font-bold text-slate-800">No Attendance Records Yet</p>
          <p className="text-sm font-medium text-slate-500 mt-1">Enrolled students will appear here to mark attendance</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden animate-slide-up">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead><tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold bg-slate-50">
                <th className="p-4">Student</th>
                {isFaculty && <th className="p-4">Roll No.</th>}
                {isStudent && <th className="p-4">Date</th>}
                <th className="p-4">Status</th>
                {isFaculty && <th className="p-4 text-center">Mark Attendance</th>}
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {attendanceData.map(r => (
                  <tr key={isStudent ? r.attendance_id : r.student_id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shadow-sm border border-slate-200">
                          <AttendanceStatusIcon status={r.status} />
                        </div>
                        <span className="font-bold text-slate-800">
                          {r.students?.user_accounts?.username || r.students?.roll_number || '—'}
                        </span>
                      </div>
                    </td>
                    {isFaculty && <td className="p-4 text-slate-500 text-sm font-mono">{r.students?.roll_number}</td>}
                    {isStudent && <td className="p-4 text-slate-600 text-sm font-medium">{r.date ? format(new Date(r.date), 'dd MMM yyyy') : '—'}</td>}
                    <td className="p-4"><span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusColors[r.status] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>{r.status}</span></td>
                    {isFaculty && (
                      <td className="p-4">
                        <div className="flex gap-1.5 justify-center">
                          {['Present', 'Absent', 'Late', 'Leave'].map(s => (
                            <button key={s}
                              onClick={() => handleMark(r.student_id, s)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border shadow-sm ${markMap[r.student_id] === s
                                ? s === 'Present' ? 'bg-emerald-600 text-white border-emerald-600'
                                  : s === 'Absent' ? 'bg-rose-600 text-white border-rose-600'
                                    : s === 'Late' ? 'bg-amber-500 text-white border-amber-500'
                                      : 'bg-slate-600 text-white border-slate-600'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                              }`}>
                              {s}
                            </button>
                          ))}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
