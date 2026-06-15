const express = require('express');
const router = express.Router();
const { enrollStudent, getStudentEnrollments, getSectionEnrollments, withdrawEnrollment } = require('../controllers/enrollment.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.post('/', authenticate, authorize('Student', 'Admin'), enrollStudent);
router.get('/student/:student_id', authenticate, getStudentEnrollments);
router.get('/section/:section_id', authenticate, authorize('Faculty', 'Admin'), getSectionEnrollments);
router.put('/:enrollment_id/withdraw', authenticate, withdrawEnrollment);

module.exports = router;
