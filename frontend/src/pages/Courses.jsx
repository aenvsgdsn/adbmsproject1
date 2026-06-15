import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getCourses, createCourse, getDepartments, deleteCourse,
  getSections, createSection, getFaculty, deleteSection,
} from '../api';
import { BookOpen, Plus, X, Loader2, Users, Layers, LayoutGrid, LayoutList, ChevronRight, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

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

const CourseCard = ({ course }) => (
  <div className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
    <div className="h-32 bg-slate-100 relative overflow-hidden shrink-0">
        <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
          <Layers size={48} className="text-white opacity-20 absolute -right-2 -bottom-2 transform rotate-12" />
          <BookOpen size={32} className="text-white opacity-90" />
        </div>
      <div className="absolute top-3 left-3">
        <span className="bg-white/90 backdrop-blur text-slate-800 px-2.5 py-1 rounded-md text-xs font-bold shadow-sm">
          {course.course_code}
        </span>
      </div>
    </div>
    <div className="p-5 flex flex-col flex-grow">
      <h3 className="font-bold text-slate-800 text-lg leading-tight mb-2 line-clamp-2">{course.course_name}</h3>
      <div className="mt-auto pt-4 flex items-center justify-between text-sm">
        <span className="text-slate-500 flex items-center gap-1.5"><Layers size={14} /> {course.departments?.department_code || 'General'}</span>
        <span className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{course.credit_hours} Cr</span>
      </div>
      {course.onDelete && (
        <button onClick={() => course.onDelete(course.course_id)} className="absolute top-3 right-3 p-1.5 bg-white/90 backdrop-blur rounded-md text-red-500 hover:bg-red-50 hover:text-red-600 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
          <Trash2 size={16} />
        </button>
      )}
    </div>
  </div>
);

const Courses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses');
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [courseForm, setCourseForm] = useState({ course_code: '', course_name: '', credit_hours: 3, department_id: '' });
  const [sectionForm, setSectionForm] = useState({ course_id: '', faculty_id: '', semester: '', capacity: 30 });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [c, s, d, f] = await Promise.all([getCourses(), getSections(), getDepartments(), getFaculty()]);
      setCourses(c.data || []);
      setSections(s.data || []);
      setDepartments(d.data || []);
      setFaculty(f.data || []);
    } catch { }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAddCourse = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await createCourse(courseForm);
      toast.success('Course created!');
      setShowCourseModal(false);
      setCourseForm({ course_code: '', course_name: '', credit_hours: 3, department_id: '' });
      load();
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to create course.');
    }
    setSaving(false);
  };

  const handleAddSection = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await createSection(sectionForm);
      toast.success('Section created!');
      setShowSectionModal(false);
      setSectionForm({ course_id: '', faculty_id: '', semester: '', capacity: 30 });
      load();
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to create section.');
    }
    setSaving(false);
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await deleteCourse(id);
      toast.success('Course deleted');
      load();
    } catch { toast.error('Failed to delete course'); }
  };

  const handleDeleteSection = async (id) => {
    if (!window.confirm('Are you sure you want to delete this section?')) return;
    try {
      await deleteSection(id);
      toast.success('Section deleted');
      load();
    } catch { toast.error('Failed to delete section'); }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-outfit">Academic Courses</h1>
          <p className="text-slate-500 mt-1 font-medium">Explore our diverse catalog of programs and course sections.</p>
        </div>
        {(user?.role === 'Admin' || user?.role === 'Faculty') && (
          <div className="flex gap-3">
            <button onClick={() => setShowSectionModal(true)} className="btn bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm transition-all flex items-center gap-2">
              <Users size={16} /> Add Section
            </button>
            <button onClick={() => setShowCourseModal(true)} className="btn btn-primary shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2">
              <Plus size={16} /> Add Course
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-slate-100 p-1.5 rounded-lg w-fit shadow-inner mb-8">
        <button onClick={() => setActiveTab('courses')}
          className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
            activeTab === 'courses' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}>
          <LayoutGrid size={16} /> Course Catalog ({courses.length})
        </button>
        <button onClick={() => setActiveTab('sections')}
          className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
            activeTab === 'sections' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}>
          <LayoutList size={16} /> Active Sections ({sections.length})
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-indigo-600" size={32} /></div>
      ) : activeTab === 'courses' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {courses.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white rounded-xl border border-slate-200 border-dashed">
              <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium">No courses available.</p>
            </div>
          ) : courses.map(c => (
             <CourseCard key={c.course_id} course={{...c, onDelete: (user?.role === 'Admin' || user?.role === 'Faculty') ? handleDeleteCourse : null}} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden animate-slide-up">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="p-4">Course Name & Code</th>
                  <th className="p-4">Faculty Instructor</th>
                  <th className="p-4">Semester</th>
                  <th className="p-4">Available Seats</th>
                  {(user?.role === 'Admin' || user?.role === 'Faculty') && <th className="p-4">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sections.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-12 text-slate-400 text-sm">No active sections found.</td></tr>
                ) : sections.map(s => (
                  <tr key={s.section_id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-800">{s.courses?.course_name || '—'}</div>
                      <div className="text-xs text-indigo-600 font-medium mt-0.5">{s.courses?.course_code}</div>
                    </td>
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-xs uppercase shrink-0">
                         {s.faculty?.user_accounts?.username?.charAt(0) || '?'}
                      </div>
                      <span className="font-medium text-slate-700">{s.faculty?.user_accounts?.username || '—'}</span>
                    </td>
                    <td className="p-4">
                       <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-semibold">{s.semester}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-full max-w-[100px] h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${s.available_seats === 0 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${(1 - (s.available_seats / s.capacity)) * 100}%` }}></div>
                        </div>
                        <span className={`text-xs font-bold ${s.available_seats === 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                          {s.available_seats} / {s.capacity}
                        </span>
                      </div>
                    </td>
                    {(user?.role === 'Admin' || user?.role === 'Faculty') && (
                      <td className="p-4">
                        <button onClick={() => handleDeleteSection(s.section_id)} className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Course Modal */}
      {showCourseModal && (
        <Modal title="Create New Course" onClose={() => setShowCourseModal(false)}>
          <form onSubmit={handleAddCourse} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="text-sm font-semibold text-slate-700 mb-1 block">Course Code</label>
                <input className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all uppercase" placeholder="CS101" required
                  value={courseForm.course_code} onChange={e => setCourseForm({ ...courseForm, course_code: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="text-sm font-semibold text-slate-700 mb-1 block">Credit Hours</label>
                <input type="number" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" min="1" max="6" required
                  value={courseForm.credit_hours} onChange={e => setCourseForm({ ...courseForm, credit_hours: +e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label className="text-sm font-semibold text-slate-700 mb-1 block">Course Name</label>
              <input className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Introduction to Computer Science" required
                value={courseForm.course_name} onChange={e => setCourseForm({ ...courseForm, course_name: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="text-sm font-semibold text-slate-700 mb-1 block">Department</label>
              <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required value={courseForm.department_id}
                onChange={e => setCourseForm({ ...courseForm, department_id: e.target.value })}>
                <option value="">Select Department</option>
                {departments.map(d => <option key={d.department_id} value={d.department_id}>{d.department_name}</option>)}
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
              <button type="button" onClick={() => setShowCourseModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
              <button type="submit" disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Save Course
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Section Modal */}
      {showSectionModal && (
        <Modal title="Open New Section" onClose={() => setShowSectionModal(false)}>
          <form onSubmit={handleAddSection} className="space-y-4">
            <div className="form-group">
              <label className="text-sm font-semibold text-slate-700 mb-1 block">Course</label>
              <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required value={sectionForm.course_id}
                onChange={e => setSectionForm({ ...sectionForm, course_id: e.target.value })}>
                <option value="">Select Course</option>
                {courses.map(c => <option key={c.course_id} value={c.course_id}>{c.course_name} ({c.course_code})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="text-sm font-semibold text-slate-700 mb-1 block">Assigned Faculty</label>
              <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required value={sectionForm.faculty_id}
                onChange={e => setSectionForm({ ...sectionForm, faculty_id: e.target.value })}>
                <option value="">Select Instructor</option>
                {faculty.map(f => <option key={f.faculty_id} value={f.faculty_id}>{f.user_accounts?.username} — {f.designation}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="text-sm font-semibold text-slate-700 mb-1 block">Semester Term</label>
                <input className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Fall 2026" required
                  value={sectionForm.semester} onChange={e => setSectionForm({ ...sectionForm, semester: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="text-sm font-semibold text-slate-700 mb-1 block">Seat Capacity</label>
                <input type="number" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" min="1" required
                  value={sectionForm.capacity} onChange={e => setSectionForm({ ...sectionForm, capacity: +e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
              <button type="button" onClick={() => setShowSectionModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
              <button type="submit" disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Open Section
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Courses;
