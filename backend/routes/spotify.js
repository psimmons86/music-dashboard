const express = require('express');
const router = express.Router();
const spotifyCtrl = require('../controllers/spotify');

router.get('/connect', spotifyCtrl.connect);
router.get('/callback', spotifyCtrl.callback);
router.get('/status', spotifyCtrl.status);

module.exports = router;