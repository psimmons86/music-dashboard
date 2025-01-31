const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// JWT Creation Utility
const createJWT = (user) => {
  // Ensure SECRET is set
  if (!process.env.SECRET) {
    throw new Error('SECRET environment variable is not set');
  }

  // Create token with user information
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
  // User Signup
  async signup(req, res) {
    try {
      const { name, email, password, adminCode } = req.body;

      // Input validation
      if (!name || !email || !password) {
        return res.status(400).json({ 
          message: 'Please provide name, email, and password' 
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ 
          message: 'User already exists' 
        });
      }

      // Determine user role
      const role = adminCode && adminCode === process.env.ADMIN_SECRET_CODE 
        ? 'admin' 
        : 'user';

      // Create new user
      const user = new User({
        name,
        email: email.toLowerCase(),
        password,
        role
      });

      // Save user to database
      await user.save();

      // Generate JWT
      const token = createJWT(user);

      // Prepare user response (remove sensitive data)
      const userResponse = user.toObject();
      delete userResponse.password;

      // Send successful response
      res.status(201).json({
        user: userResponse,
        token
      });

    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ 
        message: 'Error signing up', 
        error: error.message 
      });
    }
  },

  // User Login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Input validation
      if (!email || !password) {
        return res.status(400).json({ 
          message: 'Please provide email and password' 
        });
      }

      // Find user by email (case-insensitive)
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({ 
          message: 'Invalid credentials' 
        });
      }

      // Verify password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ 
          message: 'Invalid credentials' 
        });
      }

      // Generate JWT
      const token = createJWT(user);

      // Prepare user response (remove sensitive data)
      const userResponse = user.toObject();
      delete userResponse.password;

      // Send successful response
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

  // Get User Profile
  async getProfile(req, res) {
    try {
      // Find user by ID from token, excluding sensitive fields
      const user = await User.findById(req.user._id)
        .select('-password -__v');
      
      // Handle user not found
      if (!user) {
        return res.status(404).json({ 
          message: 'User not found' 
        });
      }

      // Send user profile
      res.json(user);

    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ 
        message: 'Error getting profile', 
        error: error.message 
      });
    }
  },

  // Update User Role (Admin only)
  async updateRole(req, res) {
    try {
      // Check if the requesting user is an admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({ 
          message: 'Unauthorized: Admin access required' 
        });
      }

      const { userId, role, secretKey } = req.body;

      // Validate admin secret key
      if (!secretKey || secretKey !== process.env.ADMIN_SECRET_CODE) {
        return res.status(403).json({ 
          message: 'Unauthorized: Invalid admin secret' 
        });
      }

      // Validate input
      if (!userId || !role) {
        return res.status(400).json({ 
          message: 'Please provide user ID and new role' 
        });
      }

      // Validate role
      const validRoles = ['user', 'admin'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ 
          message: 'Invalid role' 
        });
      }

      // Find and update user
      const user = await User.findByIdAndUpdate(
        userId, 
        { role }, 
        { 
          new: true, 
          select: '-password -__v' 
        }
      );

      // Handle user not found
      if (!user) {
        return res.status(404).json({ 
          message: 'User not found' 
        });
      }

      // Send successful response
      res.json({
        message: 'User role updated successfully',
        user
      });

    } catch (error) {
      console.error('Update role error:', error);
      res.status(500).json({ 
        message: 'Error updating user role', 
        error: error.message 
      });
    }
  },
};

module.exports = authController;