const express = require('express');
const router = express.Router();
const postsCtrl = require('../controllers/posts');

// All paths start with '/api/posts'

// POST /api/posts
router.post('/', postsCtrl.create);
// GET /api/posts
router.get('/', postsCtrl.index);

module.exports = router;