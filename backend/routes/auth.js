const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const checkToken = require('../middleware/checkToken');


router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.get('/profile', checkToken, authController.getProfile);


router.post('/update-role', 
  checkToken,
  authController.updateRole
);

module.exports = router;