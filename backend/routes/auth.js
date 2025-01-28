
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const checkToken = require('../middleware/checkToken');
const ensureAdmin = require('../middleware/ensureAdmin');
const User = require('../models/user');  // Add this import

// Public routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Protected routes
router.get('/profile', checkToken, authController.getProfile);

// Admin routes
router.post('/update-role', checkToken, ensureAdmin, authController.updateUserRole);

// Temporary admin maker route
router.post('/make-admin', async (req, res) => {
   try {
     const userEmail = "hadroncollides@gmail.com"; 
     const user = await User.findOne({ email: userEmail });
     if (!user) return res.status(404).json({ message: 'User not found' });
     
     user.role = 'admin';
     await user.save();
     
     res.json({ message: 'Admin role granted successfully' });
   } catch (error) {
     res.status(500).json({ message: error.message });
   }
});

module.exports = router;