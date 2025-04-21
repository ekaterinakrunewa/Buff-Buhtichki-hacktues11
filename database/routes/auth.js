const express = require('express');
const router = express.Router();
const { signup, login, logout, verifyToken } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.get('/verify', authMiddleware, verifyToken);

module.exports = router;