const User = require('../models/user');
const jwt = require('jsonwebtoken');

function createJWT(user) {
  return jwt.sign(
    { user: { _id: user._id, name: user.name, email: user.email, role: user.role } },
    process.env.SECRET,
    { expiresIn: '24h' }
  );
}

const authController = {
  async signup(req, res) {
    try {
      const { name, email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const user = new User({ name, email, password });
      await user.save();

      const token = await createJWT(user);

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

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = await createJWT(user);

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