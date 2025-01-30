const express = require('express');
const router = express.Router();
const postsCtrl = require('../controllers/posts');
const ensureLoggedIn = require('../middleware/ensureLoggedIn');

router.use(ensureLoggedIn);

router.post('/', postsCtrl.create);
router.get('/', postsCtrl.index);
router.delete('/:id', postsCtrl.deletePost);
router.post('/:id/like', postsCtrl.likePost);

module.exports = router;