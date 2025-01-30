const User = require('../models/user');
const jwt = require('jsonwebtoken');

// JWT Creation Utility
const createJWT = (user) => {
  if (!process.env.SECRET) {
    throw new Error('SECRET environment variable is not set');
  }

  return jwt.sign(
    { 
      user: { 
        _id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      } 
    },
    process.env.SECRET,
    { expiresIn: '24h' }
  );
};

// Authentication Controller
const authController = {
  // Login method
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
      }

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Verify password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT
      const token = createJWT(user);

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Prepare user response (remove sensitive data)
      const userResponse = user.toObject();
      delete userResponse.password;

      res.json({
        user: userResponse,
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        message: 'Error logging in', 
        error: error.message 
      });
    }
  },

  // Signup method (existing code)
  async signup(req, res) {
    // ... (your existing signup method)
  },

  // Get Profile method
  async getProfile(req, res) {
    try {
      // Find user by ID from JWT payload
      const user = await User.findById(req.user._id)
        .select('-password -__v');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ 
        message: 'Error getting profile', 
        error: error.message 
      });
    }
  },

  // Role update method (existing code)
  async updateRole(req, res) {
    // ... (your existing updateRole method)
  }
};

module.exports = authController;