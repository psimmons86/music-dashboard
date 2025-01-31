const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog');
const checkToken = require('../middleware/checkToken');
const ensureLoggedIn = require('../middleware/ensureLoggedIn');
const ensureAdmin = require('../middleware/ensureAdmin');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const uploadDir = path.join(__dirname, '../uploads/blog-images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});


router.get('/', blogController.getAll);
router.get('/:id', blogController.getOne);


router.use(checkToken);
router.use(ensureLoggedIn);


router.get('/user/posts', blogController.getUserBlogs);


router.use(ensureAdmin);


router.post('/', upload.single('image'), blogController.create);


router.put('/:id', upload.single('image'), blogController.update);


router.delete('/:id', blogController.delete);


router.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    const imageUrl = `/uploads/blog-images/${req.file.filename}`;
    const absoluteUrl = `${req.protocol}://${req.get('host')}${imageUrl}`;
    res.json({ url: absoluteUrl });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

module.exports = router;