const express = require('express');
const router = express.Router();
const User = require('../models/user');
const ensureLoggedIn = require('../middleware/ensureLoggedIn');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/profilePictures'));
  },
  filename: function (req, file, cb) {
    cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});


router.get('/profile', ensureLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

router.post('/profile', ensureLoggedIn, async (req, res) => {
  try {
    const { name, bio, location, socialLinks } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 
        name, 
        bio, 
        location,
        socialLinks: {
          discogs: socialLinks?.discogs || '',
          vinylVault: socialLinks?.vinylVault || '',
          lastFm: socialLinks?.lastFm || ''
        }
      },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

router.post('/profile-picture', 
  ensureLoggedIn, 
  upload.single('profilePicture'), 
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const profilePicturePath = `/uploads/profilePictures/${req.file.filename}`;

      const user = await User.findByIdAndUpdate(
        req.user._id,
        { profilePicture: profilePicturePath },
        { new: true }
      ).select('-password');

      console.log('Updated user:', user);

      res.json(user);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      res.status(500).json({ error: 'Failed to upload profile picture' });
    }
  }
);

router.get('/favorites', ensureLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('favoriteGenres favoriteMoods');
    res.json(user);
  } catch (error) {
    console.error('Error getting favorites:', error);
    res.status(500).json({ error: 'Failed to get favorites' });
  }
});

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