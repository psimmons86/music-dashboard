const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const checkToken = require('../middleware/checkToken');
const ensureAdmin = require('../middleware/ensureAdmin');


router.post('/signup', authController.signup);
router.post('/login', authController.login);


router.get('/profile', checkToken, authController.getProfile);


router.post('/update-role', 
  checkToken,     // Verify token first
  ensureAdmin,    // Then check for admin role
  authController.updateRole
);

module.exports = router;