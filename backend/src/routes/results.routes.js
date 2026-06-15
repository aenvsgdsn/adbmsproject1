const express = require('express');
const router = express.Router();
const { uploadGrades, getStudentGrades, getStudentResults, getSectionGrades } = require('../controllers/results.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.post('/grades', authenticate, authorize('Faculty', 'Admin'), uploadGrades);
router.get('/grades/student/:student_id', authenticate, getStudentGrades);
router.get('/grades/section/:section_id', authenticate, authorize('Faculty', 'Admin'), getSectionGrades);
router.get('/results/student/:student_id', authenticate, getStudentResults);

module.exports = router;
