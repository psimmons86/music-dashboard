const User = require('../models/user');
const jwt = require('jsonwebtoken');

async function createJWT(user) {
  return jwt.sign(
    { _id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
}

const authController = {
  async signup(req, res) {
    try {
      const { name, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create new user
      const user = new User({ name, email, password });
      await user.save();

      // Generate JWT
      const token = await createJWT(user);

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      res.status(201).json({
        user: userResponse,
        token
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ message: 'Error creating user' });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT
      const token = await createJWT(user);

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      res.json({
        user: userResponse,
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Error logging in' });
    }
  },

  async getProfile(req, res) {
    try {
      const user = await User.findById(req.user._id).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ message: 'Error getting profile' });
    }
  }
};

module.exports = authController;