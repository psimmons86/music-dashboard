const express = require('express');
const router = express.Router();
const playlistCtrl = require('../controllers/playlist');

router.post('/', playlistCtrl.createPlaylist);

module.exports = router;