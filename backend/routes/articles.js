const express = require('express');
const router = express.Router();
const articlesCtrl = require('../controllers/articles');
const ensureLoggedIn = require('../middleware/ensureLoggedIn');
const checkToken = require('../middleware/checkToken');

router.use(checkToken);
router.use(ensureLoggedIn);

router.post('/save', articlesCtrl.saveArticle);
router.get('/saved', articlesCtrl.getSavedArticles);
router.delete('/saved/:id', articlesCtrl.deleteSavedArticle);

module.exports = router;