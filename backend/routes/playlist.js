const express = require('express');
const router = express.Router();
const playlistCtrl = require('../controllers/playlist');
const ensureLoggedIn = require('../middleware/ensureLoggedIn');

router.use(ensureLoggedIn);
router.post('/', playlistCtrl.createPlaylist);

module.exports = router;