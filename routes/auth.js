const express = require('express');
const router = express.Router();
const { register, login, changePassword } = require('../controllers/authController');

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/change-password', changePassword);

module.exports = router; 