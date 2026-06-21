import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCourses, createCourse, getDepartments, deleteCourse, getSections, createSection, getFaculty, deleteSection } from '../api';
import { BookOpen, Plus, Layers, LayoutGrid, LayoutList, Trash2, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageHeader, Modal, ModalFooter, FormField, EmptyState, Spinner, SectionCard, TableWrapper } from '../components/UI';

const CourseCard = ({ course, onDelete, canEdit }) => (
  <div
    className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-300 animate-fade-in"
    style={{
      background: 'rgba(255,255,255,0.90)',
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
    {/* Banner */}
    <div className="h-28 relative flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1d4ed8, #4f46e5)' }}>
      <Layers size={52} className="text-white opacity-10 absolute -right-3 -bottom-3 rotate-12" />
      <BookOpen size={30} className="text-white opacity-90" />
      <div className="absolute top-3 left-3">
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg"
          style={{ background: 'rgba(255,255,255,0.20)', backdropFilter: 'blur(8px)', color: 'white', border: '1px solid rgba(255,255,255,0.25)' }}>
          {course.course_code}
        </span>
      </div>
      {canEdit && onDelete && (
        <button
          onClick={() => onDelete(course.course_id)}
          className="absolute top-3 right-3 p-1.5 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: 'rgba(239,68,68,0.70)', backdropFilter: 'blur(8px)' }}
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
    {/* Body */}
    <div className="p-4 flex flex-col flex-grow">
      <h3 className="font-bold text-slate-800 text-sm leading-snug mb-3 line-clamp-2">{course.course_name}</h3>
      <div className="mt-auto flex items-center justify-between text-xs">
        <span className="text-slate-400 flex items-center gap-1"><Layers size={12} /> {course.departments?.department_code || 'General'}</span>
        <span className="font-bold text-blue-600 px-2 py-0.5 rounded-lg" style={{ background: 'rgba(239,246,255,0.80)', border: '1px solid rgba(219,234,254,0.60)' }}>
          {course.credit_hours} Cr
        </span>
      </div>
    </div>
  </div>
);

const Courses = () => {
  const { user } = useAuth();
  const [courses, setCourses]         = useState([]);
  const [sections, setSections]       = useState([]);
  const [departments, setDepartments] = useState([]);
  const [faculty, setFaculty]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [activeTab, setActiveTab]     = useState('courses');
  const [showCourseModal, setShowCourseModal]   = useState(false);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [courseForm, setCourseForm]   = useState({ course_code: '', course_name: '', credit_hours: 3, department_id: '' });
  const [sectionForm, setSectionForm] = useState({ course_id: '', faculty_id: '', semester: '', capacity: 30 });
  const [saving, setSaving]           = useState(false);

  const canEdit = user?.role === 'Admin' || user?.role === 'Faculty';

  const load = async () => {
    setLoading(true);
    try {
      const [c, s, d, f] = await Promise.all([getCourses(), getSections(), getDepartments(), getFaculty()]);
      setCourses(c.data || []);
      setSections(s.data || []);
      setDepartments(d.data || []);
      setFaculty(f.data || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAddCourse = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createCourse(courseForm);
      toast.success('Course created!');
      setShowCourseModal(false);
      setCourseForm({ course_code: '', course_name: '', credit_hours: 3, department_id: '' });
      load();
    } catch (err) { toast.error(err?.response?.data?.error || 'Failed.'); }
    setSaving(false);
  };

  const handleAddSection = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createSection(sectionForm);
      toast.success('Section created!');
      setShowSectionModal(false);
      setSectionForm({ course_id: '', faculty_id: '', semester: '', capacity: 30 });
      load();
    } catch (err) { toast.error(err?.response?.data?.error || 'Failed.'); }
    setSaving(false);
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try { await deleteCourse(id); toast.success('Course deleted'); load(); }
    catch { toast.error('Failed to delete course'); }
  };

  const handleDeleteSection = async (id) => {
    if (!window.confirm('Delete this section?')) return;
    try { await deleteSection(id); toast.success('Section deleted'); load(); }
    catch { toast.error('Failed to delete section'); }
  };

  const TAB_BTN = (tab, label, Icon) => (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${activeTab === tab ? 'text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
      style={activeTab === tab ? {
        background: 'rgba(255,255,255,0.95)',
        border: '1px solid rgba(147,197,253,0.50)',
        boxShadow: '0 2px 8px rgba(37,99,235,0.10)',
      } : { border: '1px solid transparent' }}
    >
      <Icon size={15} />{label}
    </button>
  );

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Academic Courses"
        subtitle="Explore our diverse catalog of programs and course sections"
      />

      <div className="card mb-7 p-4 bg-white rounded-2xl shadow-sm border border-zinc-100">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-1.5 p-1.5 rounded-xl w-full md:w-fit overflow-x-auto"
            style={{ background: 'rgba(239,246,255,0.70)', border: '1px solid rgba(219,234,254,0.60)' }}>
            {TAB_BTN('courses', `Catalog (${courses.length})`, LayoutGrid)}
            {TAB_BTN('sections', `Sections (${sections.length})`, LayoutList)}
          </div>
          {canEdit && (
            <div className="flex gap-3 w-full md:w-auto">
              <button onClick={() => setShowSectionModal(true)} className="btn btn-secondary w-full md:w-auto"><Users size={15} /> Add Section</button>
              <button onClick={() => setShowCourseModal(true)} className="btn btn-primary w-full md:w-auto"><Plus size={15} /> Add Course</button>
            </div>
          )}
        </div>
      </div>

      {loading ? <Spinner /> : activeTab === 'courses' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {courses.length === 0
            ? <div className="col-span-full"><EmptyState icon={BookOpen} title="No courses available" /></div>
            : courses.map(c => <CourseCard key={c.course_id} course={c} onDelete={handleDeleteCourse} canEdit={canEdit} />)
          }
        </div>
      ) : (
        <SectionCard title="Active Sections">
          <TableWrapper>
            <thead>
              <tr>
                <th>Course</th>
                <th>Instructor</th>
                <th>Semester</th>
                <th>Seats</th>
                {canEdit && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {sections.length === 0 ? (
                <tr><td colSpan={5}><EmptyState icon={LayoutList} title="No active sections" /></td></tr>
              ) : sections.map(s => (
                <tr key={s.section_id}>
                  <td>
                    <p className="font-semibold text-slate-800 text-sm">{s.courses?.course_name || '—'}</p>
                    <p className="text-xs text-blue-500 font-medium mt-0.5">{s.courses?.course_code}</p>
                  </td>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {s.faculty?.user_accounts?.username?.charAt(0) || '?'}
                      </div>
                      <span className="text-sm text-slate-700 font-medium">{s.faculty?.user_accounts?.username || '—'}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-gray">{s.semester}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(226,232,240,0.80)' }}>
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(1 - (s.available_seats / s.capacity)) * 100}%`,
                            background: s.available_seats === 0 ? '#ef4444' : '#22c55e',
                          }}
                        />
                      </div>
                      <span className={`text-xs font-bold ${s.available_seats === 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                        {s.available_seats}/{s.capacity}
                      </span>
                    </div>
                  </td>
                  {canEdit && (
                    <td>
                      <button onClick={() => handleDeleteSection(s.section_id)} className="btn btn-danger btn-sm">
                        <Trash2 size={13} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </TableWrapper>
        </SectionCard>
      )}

      {/* Course Modal */}
      {showCourseModal && (
        <Modal title="Create New Course" onClose={() => setShowCourseModal(false)}>
          <form onSubmit={handleAddCourse} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Course Code">
                <input className="form-input uppercase" placeholder="CS101" required value={courseForm.course_code} onChange={e => setCourseForm({ ...courseForm, course_code: e.target.value })} />
              </FormField>
              <FormField label="Credit Hours">
                <input type="number" className="form-input" min="1" max="6" required value={courseForm.credit_hours} onChange={e => setCourseForm({ ...courseForm, credit_hours: +e.target.value })} />
              </FormField>
            </div>
            <FormField label="Course Name">
              <input className="form-input" placeholder="Introduction to Computer Science" required value={courseForm.course_name} onChange={e => setCourseForm({ ...courseForm, course_name: e.target.value })} />
            </FormField>
            <FormField label="Department">
              <select className="form-input form-select" required value={courseForm.department_id} onChange={e => setCourseForm({ ...courseForm, department_id: e.target.value })}>
                <option value="">Select Department</option>
                {departments.map(d => <option key={d.department_id} value={d.department_id}>{d.department_name}</option>)}
              </select>
            </FormField>
            <ModalFooter onCancel={() => setShowCourseModal(false)} submitLabel="Save Course" loading={saving} icon={Plus} />
          </form>
        </Modal>
      )}

      {/* Section Modal */}
      {showSectionModal && (
        <Modal title="Open New Section" onClose={() => setShowSectionModal(false)}>
          <form onSubmit={handleAddSection} className="space-y-4">
            <FormField label="Course">
              <select className="form-input form-select" required value={sectionForm.course_id} onChange={e => setSectionForm({ ...sectionForm, course_id: e.target.value })}>
                <option value="">Select Course</option>
                {courses.map(c => <option key={c.course_id} value={c.course_id}>{c.course_name} ({c.course_code})</option>)}
              </select>
            </FormField>
            <FormField label="Assigned Faculty">
              <select className="form-input form-select" required value={sectionForm.faculty_id} onChange={e => setSectionForm({ ...sectionForm, faculty_id: e.target.value })}>
                <option value="">Select Instructor</option>
                {faculty.map(f => <option key={f.faculty_id} value={f.faculty_id}>{f.user_accounts?.username} — {f.designation}</option>)}
              </select>
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Semester Term">
                <input className="form-input" placeholder="Fall 2026" required value={sectionForm.semester} onChange={e => setSectionForm({ ...sectionForm, semester: e.target.value })} />
              </FormField>
              <FormField label="Seat Capacity">
                <input type="number" className="form-input" min="1" required value={sectionForm.capacity} onChange={e => setSectionForm({ ...sectionForm, capacity: +e.target.value })} />
              </FormField>
            </div>
            <ModalFooter onCancel={() => setShowSectionModal(false)} submitLabel="Open Section" loading={saving} icon={Plus} />
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Courses;
