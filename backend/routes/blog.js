const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog');
const checkToken = require('../middleware/checkToken');


router.get('/', blogController.getAll);
router.get('/:id', blogController.getOne);


router.use(checkToken);
router.post('/', blogController.create);
router.put('/:id', blogController.update);
router.delete('/:id', blogController.delete);
router.get('/user/posts', blogController.getUserBlogs);

module.exports = router;