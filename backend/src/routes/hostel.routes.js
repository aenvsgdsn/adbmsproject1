const express = require('express');
const router = express.Router();
const { getHostels, allocateRoom, getStudentAllotment, vacateRoom, addHostel, addRoom } = require('../controllers/hostel.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.get('/', authenticate, getHostels);
router.post('/add', authenticate, authorize('Admin'), addHostel);
router.post('/rooms/add', authenticate, authorize('Admin'), addRoom);
router.post('/allocate', authenticate, authorize('Admin'), allocateRoom);
router.get('/student/:student_id', authenticate, getStudentAllotment);
router.put('/vacate/:allotment_id', authenticate, authorize('Admin'), vacateRoom);

module.exports = router;
