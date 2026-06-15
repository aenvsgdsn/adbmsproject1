const express = require('express');
const router = express.Router();
const {
  getDepartments, createDepartment,
  getPrograms, createProgram,
  getStudents, getStudentById, createStudent, updateStudent,
  getFaculty, createFaculty,
  getCourses, createCourse, updateCourse, deleteCourse,
  getSections, createSection, updateSection, deleteSection,
} = require('../controllers/academic.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

// Departments
router.get('/departments', authenticate, getDepartments);
router.post('/departments', authenticate, authorize('Admin'), createDepartment);

// Programs
router.get('/programs', authenticate, getPrograms);
router.post('/programs', authenticate, authorize('Admin'), createProgram);

// Students
router.get('/students', authenticate, authorize('Admin', 'Finance', 'Faculty'), getStudents);
router.get('/students/:id', authenticate, getStudentById);
router.post('/students', authenticate, authorize('Admin'), createStudent);
router.put('/students/:id', authenticate, authorize('Admin'), updateStudent);

// Faculty
router.get('/faculty', authenticate, getFaculty);
router.post('/faculty', authenticate, authorize('Admin'), createFaculty);

// Courses
router.get('/courses', authenticate, getCourses);
router.post('/courses', authenticate, authorize('Admin', 'Faculty'), createCourse);
router.put('/courses/:id', authenticate, authorize('Admin', 'Faculty'), updateCourse);
router.delete('/courses/:id', authenticate, authorize('Admin', 'Faculty'), deleteCourse);

// Sections
router.get('/sections', authenticate, getSections);
router.post('/sections', authenticate, authorize('Admin', 'Faculty'), createSection);
router.put('/sections/:id', authenticate, authorize('Admin', 'Faculty'), updateSection);
router.delete('/sections/:id', authenticate, authorize('Admin', 'Faculty'), deleteSection);

module.exports = router;
