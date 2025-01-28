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
router.post('/update-role', checkToken, ensureAdmin, async (req, res) => {
  try {
    const { userId, role, secretKey } = req.body;

    // Verify admin secret key
    if (secretKey !== process.env.ADMIN_SECRET_CODE) {
      return res.status(401).json({ message: 'Invalid admin secret key' });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update role
    user.role = role;
    await user.save();

    res.json({ message: 'User role updated successfully' });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Error updating user role' });
  }
});

module.exports = router;