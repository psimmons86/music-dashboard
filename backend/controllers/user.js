const User = require('../models/user');
const bcrypt = require('bcrypt');

async function getProfile(req, res) {
  try {
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
}

async function updateProfile(req, res) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.bio = req.body.bio || user.bio;
    user.location = req.body.location || user.location;
    user.socialLinks = req.body.socialLinks || user.socialLinks;
    user.preferences = req.body.preferences || user.preferences;

    await user.save();

    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      message: 'Error updating profile', 
      error: error.message 
    });
  }
}

async function uploadProfilePicture(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.profilePicture = `/uploads/profilePictures/${req.file.filename}`;
    await user.save();

    res.json({ message: 'Profile picture updated successfully' });
  } catch (error) {
    console.error('Upload profile picture error:', error);
    res.status(500).json({ 
      message: 'Error uploading profile picture', 
      error: error.message 
    });
  }
}

async function getFavorites(req, res) {
  try {
    const user = await User.findById(req.user._id)
      .select('favoriteGenres favoriteMoods');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      favoriteGenres: user.favoriteGenres,
      favoriteMoods: user.favoriteMoods
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ 
      message: 'Error getting favorites', 
      error: error.message 
    });
  }
}

async function setFavorites(req, res) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.favoriteGenres = req.body.favoriteGenres || user.favoriteGenres;
    user.favoriteMoods = req.body.favoriteMoods || user.favoriteMoods;

    await user.save();

    res.json({ message: 'Favorites updated successfully' });
  } catch (error) {
    console.error('Set favorites error:', error);
    res.status(500).json({ 
      message: 'Error setting favorites', 
      error: error.message 
    });
  }
}

module.exports = {
  getProfile,
  updateProfile, 
  uploadProfilePicture,
  getFavorites,
  setFavorites
};