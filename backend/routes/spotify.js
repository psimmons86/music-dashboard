const express = require('express');
const router = express.Router();
const spotifyCtrl = require('../controllers/spotify');
const checkToken = require('../middleware/checkToken');
const ensureLoggedIn = require('../middleware/ensureLoggedIn');

// Public endpoints (no auth required)
router.get('/connect', spotifyCtrl.connect);
router.post('/callback', spotifyCtrl.callback);

// All routes below this require authentication
router.use(checkToken);
router.use(ensureLoggedIn);

router.get('/status', spotifyCtrl.status);
router.post('/disconnect', spotifyCtrl.disconnect);
router.get('/top-artists', spotifyCtrl.getTopArtists);
router.get('/recommendations', spotifyCtrl.getRecommendations);
router.get('/recent-albums', spotifyCtrl.getRecentAlbums);
router.get('/playlists', spotifyCtrl.getUserPlaylists);

module.exports = router;