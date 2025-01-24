const express = require('express');
const router = express.Router();
const newsCtrl = require('../controllers/news');

router.get('/', newsCtrl.getNews);

module.exports = router;