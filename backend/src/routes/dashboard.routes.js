const express = require('express');
const router = express.Router();
const { getNotifications, markRead, markAllRead, getAuditLogs, getAdminDashboard, getStudentDashboard, getFacultyDashboard } = require('../controllers/dashboard.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.get('/notifications', authenticate, getNotifications);
router.put('/notifications/:id/read', authenticate, markRead);
router.put('/notifications/read-all', authenticate, markAllRead);
router.get('/audit-logs', authenticate, authorize('Admin'), getAuditLogs);
router.get('/admin', authenticate, authorize('Admin'), getAdminDashboard);
router.get('/student/:student_id', authenticate, getStudentDashboard);
router.get('/faculty/:faculty_id', authenticate, getFacultyDashboard);

module.exports = router;
