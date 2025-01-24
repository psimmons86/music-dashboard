const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const checkToken = require('../middleware/checkToken');

// Public routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Protected routes
router.get('/profile', checkToken, function(req, res) {
   authController.getProfile(req, res);
});

module.exports = router;