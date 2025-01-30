const express = require('express');
const router = express.Router();
const spotifyCtrl = require('../controllers/spotify');
const ensureLoggedIn = require('../middleware/ensureLoggedIn');

// Apply middleware
router.use(ensureLoggedIn);

// Routes
router.get('/connect', spotifyCtrl.connect);
router.post('/callback', spotifyCtrl.callback);
router.get('/status', spotifyCtrl.status);
router.post('/disconnect', spotifyCtrl.disconnect);
router.get('/top-artists', spotifyCtrl.getTopArtists);
router.get('/recommendations', spotifyCtrl.getRecommendations);

module.exports = router;