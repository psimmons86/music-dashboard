const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog');
const checkToken = require('../middleware/checkToken');

// Public routes - no authentication needed
router.get('/', blogController.getAll);
router.get('/:id', blogController.getOne);

// Protected routes - need to be logged in
router.use(checkToken);
router.post('/', blogController.create);
router.put('/:id', blogController.update);
router.delete('/:id', blogController.delete);
router.get('/user/posts', blogController.getUserBlogs);

module.exports = router;