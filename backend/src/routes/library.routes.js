const express = require('express');
const router = express.Router();
const { getBooks, issueBook, returnBook, getUserBooks, addBook } = require('../controllers/library.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.get('/', authenticate, getBooks);
router.post('/add', authenticate, authorize('Admin'), addBook);
router.post('/issue', authenticate, authorize('Admin', 'Faculty', 'Student'), issueBook);
router.put('/return/:issue_id', authenticate, authorize('Admin', 'Faculty', 'Student'), returnBook);
router.get('/user/:user_id', authenticate, getUserBooks);

module.exports = router;
