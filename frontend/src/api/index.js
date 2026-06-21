import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? '/_/backend/api' : 'http://localhost:5000/api'),
});

// Attach JWT token from localStorage to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('hisup_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle global 401 - redirect to login
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('hisup_token');
      localStorage.removeItem('hisup_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const loginUser = (credentials) => API.post('/auth/login', credentials);
export const getMe = () => API.get('/auth/me');
export const registerUser = (data) => API.post('/auth/register', data);

// Academic
export const getDepartments = () => API.get('/academic/departments');
export const createDepartment = (data) => API.post('/academic/departments', data);
export const getPrograms = () => API.get('/academic/programs');
export const createProgram = (data) => API.post('/academic/programs', data);
export const getStudents = () => API.get('/academic/students');
export const getStudentById = (id) => API.get(`/academic/students/${id}`);
export const createStudent = (data) => API.post('/academic/students', data);
export const updateStudent = (id, data) => API.put(`/academic/students/${id}`, data);
export const getFaculty = () => API.get('/academic/faculty');
export const createFaculty = (data) => API.post('/academic/faculty', data);
export const getCourses = () => API.get('/academic/courses');
export const createCourse = (data) => API.post('/academic/courses', data);
export const deleteCourse = (id) => API.delete(`/academic/courses/${id}`);
export const getSections = () => API.get('/academic/sections');
export const createSection = (data) => API.post('/academic/sections', data);
export const deleteSection = (id) => API.delete(`/academic/sections/${id}`);

// Enrollments
export const enrollStudent = (data) => API.post('/enrollments', data);
export const getStudentEnrollments = (id) => API.get(`/enrollments/student/${id}`);
export const getSectionEnrollments = (id) => API.get(`/enrollments/section/${id}`);
export const withdrawEnrollment = (id) => API.put(`/enrollments/${id}/withdraw`);

// Attendance
export const markAttendance = (data) => API.post('/attendance', data);
export const getStudentAttendance = (studentId, sectionId) => API.get(`/attendance/student/${studentId}/section/${sectionId}`);
export const getSectionAttendance = (sectionId, date) => API.get(`/attendance/section/${sectionId}/date/${date}`);

// Results
export const uploadGrades = (data) => API.post('/results/grades', data);
export const getStudentGrades = (id) => API.get(`/results/grades/student/${id}`);
export const getStudentResults = (id) => API.get(`/results/results/student/${id}`);
export const getSectionGrades = (id) => API.get(`/results/grades/section/${id}`);

// Finance
export const getFinanceDashboard = () => API.get('/finance/dashboard');
export const getStudentFees = (id) => API.get(`/finance/student/${id}/fees`);
export const submitPayment = (data) => API.post('/finance/payment', data);
export const approvePayment = (id) => API.put(`/finance/payment/${id}/approve`);
export const rejectPayment = (id) => API.put(`/finance/payment/${id}/reject`);
export const getPendingPayments = () => API.get('/finance/pending-payments');
export const getFeeStructures = () => API.get('/finance/fee-structure');
export const createFeeStructure = (data) => API.post('/finance/fee-structure', data);
export const assignStudentFee = (data) => API.post('/finance/assign-fee', data);

// Library
export const getBooks = () => API.get('/library');
export const addBook = (data) => API.post('/library/add', data);
export const issueBook = (data) => API.post('/library/issue', data);
export const returnBook = (id) => API.put(`/library/return/${id}`);
export const getUserBooks = (userId) => API.get(`/library/user/${userId}`);

// Hostel
export const getHostels = () => API.get('/hostel');
export const addHostel = (data) => API.post('/hostel/add', data);
export const addRoom = (data) => API.post('/hostel/rooms/add', data);
export const allocateRoom = (data) => API.post('/hostel/allocate', data);
export const getStudentAllotment = (id) => API.get(`/hostel/student/${id}`);
export const vacateRoom = (id) => API.put(`/hostel/vacate/${id}`);

// Dashboard / Notifications
export const getAdminDashboard = () => API.get('/dashboard/admin');
export const getStudentDashboard = (id) => API.get(`/dashboard/student/${id}`);
export const getFacultyDashboard = (id) => API.get(`/dashboard/faculty/${id}`);
export const getNotifications = () => API.get('/dashboard/notifications');
export const markNotificationRead = (id) => API.put(`/dashboard/notifications/${id}/read`);
export const markAllNotificationsRead = () => API.put('/dashboard/notifications/read-all');
export const getAuditLogs = (params) => API.get('/dashboard/audit-logs', { params });

export default API;
