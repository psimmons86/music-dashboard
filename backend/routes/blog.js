const express = require('express');
const router = express.Router();
const { blogController, ensureAdmin } = require('../controllers/blog');
const checkToken = require('../middleware/checkToken');

router.get('/posts', blogController.getPublished);
router.get('/posts/:slug', blogController.getOne);


router.use(checkToken);
router.use(ensureAdmin);

router.post('/posts', blogController.create);
router.put('/posts/:id', blogController.update);
router.delete('/posts/:id', blogController.delete);
router.get('/admin/posts', blogController.getAllForAdmin);
router.get('/admin/analytics', blogController.getAnalytics);

module.exports = router;