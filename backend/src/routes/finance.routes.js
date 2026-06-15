const express = require('express');
const router = express.Router();
const {
  getStudentFees, submitPayment, approvePayment, rejectPayment,
  getPendingPayments, getFinanceDashboard, createFeeStructure, getFeeStructures, assignStudentFee
} = require('../controllers/finance.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.get('/dashboard', authenticate, authorize('Finance', 'Admin'), getFinanceDashboard);
router.get('/pending-payments', authenticate, authorize('Finance', 'Admin'), getPendingPayments);
router.get('/student/:student_id/fees', authenticate, getStudentFees);
router.post('/payment', authenticate, authorize('Student', 'Admin'), submitPayment);
router.put('/payment/:payment_id/approve', authenticate, authorize('Finance', 'Admin'), approvePayment);
router.put('/payment/:payment_id/reject', authenticate, authorize('Finance', 'Admin'), rejectPayment);
router.get('/fee-structure', authenticate, authorize('Finance', 'Admin'), getFeeStructures);
router.post('/fee-structure', authenticate, authorize('Admin', 'Finance'), createFeeStructure);
router.post('/assign-fee', authenticate, authorize('Admin', 'Finance'), assignStudentFee);

module.exports = router;
