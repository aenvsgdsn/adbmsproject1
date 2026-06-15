const express = require('express');
const router = express.Router();
const { markAttendance, getStudentAttendance, getSectionAttendance } = require('../controllers/attendance.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.post('/', authenticate, authorize('Faculty', 'Admin'), markAttendance);
router.get('/student/:student_id/section/:section_id', authenticate, getStudentAttendance);
router.get('/section/:section_id/date/:date', authenticate, authorize('Faculty', 'Admin'), getSectionAttendance);

module.exports = router;
