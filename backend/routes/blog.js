const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog');
const checkToken = require('../middleware/checkToken');
const ensureLoggedIn = require('../middleware/ensureLoggedIn');

// Public routes (no auth required)
router.get('/', blogController.getAll);
router.get('/:id', blogController.getOne);

// Protected routes (require login only)
router.use(checkToken);
router.use(ensureLoggedIn);

router.post('/', blogController.create);
router.get('/user/posts', blogController.getUserBlogs);
router.put('/:id', blogController.update);
router.delete('/:id', blogController.delete);

module.exports = router;