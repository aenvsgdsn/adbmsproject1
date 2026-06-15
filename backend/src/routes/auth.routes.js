const express = require('express');
const router = express.Router();
const { login, createUser, getMe } = require('../controllers/auth.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.post('/login', login);
router.post('/register', authenticate, authorize('Admin'), createUser); // Only Admin can create users
router.get('/me', authenticate, getMe);

module.exports = router;
