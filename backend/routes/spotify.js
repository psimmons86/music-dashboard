const express = require('express');
const router = express.Router();
const spotifyCtrl = require('../controllers/spotify');
const playlistCtrl = require('../controllers/playlist');
const checkToken = require('../middleware/checkToken');
const ensureLoggedIn = require('../middleware/ensureLoggedIn');

router.get('/connect', checkToken, spotifyCtrl.connect);
router.post('/callback', checkToken, spotifyCtrl.callback);

router.use(checkToken);
router.use(ensureLoggedIn);

router.get('/status', spotifyCtrl.status);
router.post('/disconnect', spotifyCtrl.disconnect);
router.post('/playlist', playlistCtrl.createPlaylist);

module.exports = router;