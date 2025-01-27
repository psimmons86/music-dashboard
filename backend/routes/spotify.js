const express = require('express');
const router = express.Router();
const spotifyCtrl = require('../controllers/spotify');
const checkToken = require('../middleware/checkToken');

router.get('/connect', checkToken, spotifyCtrl.connect);
router.post('/callback', checkToken, spotifyCtrl.callback);
router.get('/status', checkToken, spotifyCtrl.status);
router.post('/disconnect', checkToken, spotifyCtrl.disconnect);

module.exports = router;