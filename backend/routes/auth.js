const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const checkToken = require('../middleware/checkToken');
const ensureAdmin = require('../middleware/ensureAdmin');

// Public routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Protected routes
router.get('/profile', checkToken, authController.getProfile);

// Admin-only route
router.post('/update-role', 
  checkToken,
  ensureAdmin,
  authController.updateRole
);

module.exports = router;