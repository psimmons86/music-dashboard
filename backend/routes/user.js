const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const ensureLoggedIn = require('../middleware/ensureLoggedIn');
const multer = require('multer');
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

router.get('/profile', ensureLoggedIn, userController.getProfile);
router.post('/profile', ensureLoggedIn, userController.updateProfile);

router.post(
  '/profile-picture', 
  ensureLoggedIn, 
  upload.single('profilePicture'), 
  userController.uploadProfilePicture
);

router.get('/favorites', ensureLoggedIn, userController.getFavorites);
router.post('/favorites', ensureLoggedIn, userController.setFavorites);

module.exports = router;