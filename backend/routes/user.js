const express = require('express');
const router = express.Router();
const User = require('../models/user');
const ensureLoggedIn = require('../middleware/ensureLoggedIn');

// GET /api/user/favorites
router.get('/favorites', ensureLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('favoriteGenres favoriteMoods');
    res.json(user);
  } catch (error) {
    console.error('Error getting favorites:', error);
    res.status(500).json({ error: 'Failed to get favorites' });
  }
});

// POST /api/user/favorites
router.post('/favorites', ensureLoggedIn, async (req, res) => {
  try {
    const { favoriteGenres, favoriteMoods } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { favoriteGenres, favoriteMoods },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    console.error('Error setting favorites:', error);
    res.status(500).json({ error: 'Failed to set favorites' });
  }
});

module.exports = router;