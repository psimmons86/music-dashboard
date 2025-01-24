const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { checkToken } = require('../middleware/checkToken');

// Public routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Protected routes
router.get('/profile', checkToken, authController.getProfile);

module.exports = router;