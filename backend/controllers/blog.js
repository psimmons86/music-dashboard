const Blog = require('../models/blog');
const path = require('path');
const fs = require('fs');

// Create upload directories
const createUploadDirs = () => {
  const uploadsDir = path.join(__dirname, '../public/uploads');
  const blogImagesDir = path.join(uploadsDir, 'blog-images');
  
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  if (!fs.existsSync(blogImagesDir)) {
    fs.mkdirSync(blogImagesDir, { recursive: true });
  }
};

createUploadDirs();

const blogController = {
  async create(req, res) {
    try {
      console.log('Received blog data:', {
        body: req.body,
        file: req.file
      });

      const blogData = {
        title: req.body.title,
        content: req.body.content,
        category: req.body.category,
        summary: req.body.summary,
        status: req.body.status || 'draft',
        author: req.user._id
      };

      if (req.body.tags) {
        try {
          blogData.tags = typeof req.body.tags === 'string' 
            ? JSON.parse(req.body.tags) 
            : req.body.tags;
        } catch (e) {
          console.error('Error parsing tags:', e);
          blogData.tags = [];
        }
      }

      if (req.file) {
        blogData.image = `/uploads/blog-images/${req.file.filename}`;
        console.log('Image path set to:', blogData.image);
      }

      if (req.body.isDraft && req.body.previousDraftId) {
        const previousDraft = await Blog.findOne({
          _id: req.body.previousDraftId,
          author: req.user._id
        });
        
        if (previousDraft) {
          previousDraft.revisions.push({
            content: previousDraft.content,
            updatedAt: new Date()
          });
          await previousDraft.remove();
        }
      }

      const blog = new Blog(blogData);
      await blog.save();
      
      const populatedBlog = await Blog.findById(blog._id)
        .populate('author', 'name');
      
      res.status(201).json(populatedBlog);
    } catch (error) {
      console.error('Create blog error:', error);
      res.status(400).json({ error: error.message });
    }
  },

  async getAll(req, res) {
    try {
      const filter = { status: 'published' };
      const blogs = await Blog.find(filter)
        .populate('author', 'name')
        .sort('-createdAt');
      res.json(blogs);
    } catch (error) {
      console.error('Get blogs error:', error);
      res.status(400).json({ error: error.message });
    }
  },

  async getUserBlogs(req, res) {
    try {
      const blogs = await Blog.find({ 
        author: req.user._id,
        $or: [{ status: 'published' }, { status: 'draft' }]
      })
        .populate('author', 'name')
        .sort('-createdAt');
      res.json(blogs);
    } catch (error) {
      console.error('Get user blogs error:', error);
      res.status(400).json({ error: error.message });
    }
  },

  async getOne(req, res) {
    try {
      const blog = await Blog.findById(req.params.id)
        .populate('author', 'name');
      
      if (!blog) {
        return res.status(404).json({ error: 'Blog post not found' });
      }

      if (blog.status === 'published') {
        blog.viewCount += 1;
        await blog.save();
      }

      res.json(blog);
    } catch (error) {
      console.error('Get blog error:', error);
      res.status(400).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const blog = await Blog.findOne({
        _id: req.params.id,
        author: req.user._id
      });

      if (!blog) {
        return res.status(404).json({ error: 'Blog post not found or unauthorized' });
      }

      blog.revisions.push({
        content: blog.content,
        updatedAt: new Date()
      });

      if (req.body.title) blog.title = req.body.title;
      if (req.body.content) blog.content = req.body.content;
      if (req.body.category) blog.category = req.body.category;
      if (req.body.summary) blog.summary = req.body.summary;
      if (req.body.status) blog.status = req.body.status;
      
      if (req.body.tags) {
        try {
          blog.tags = typeof req.body.tags === 'string'
            ? JSON.parse(req.body.tags)
            : req.body.tags;
        } catch (e) {
          console.error('Error parsing tags:', e);
        }
      }

      if (req.file) {
        if (blog.image) {
          const oldImagePath = path.join(__dirname, '../public', blog.image);
          try {
            if (fs.existsSync(oldImagePath)) {
              fs.unlinkSync(oldImagePath);
            }
          } catch (e) {
            console.error('Error deleting old image:', e);
          }
        }
        
        blog.image = `/uploads/blog-images/${req.file.filename}`;
        console.log('Updated image path:', blog.image);
      }

      await blog.save();
      
      const updatedBlog = await Blog.findById(blog._id)
        .populate('author', 'name');
      
      res.json(updatedBlog);
    } catch (error) {
      console.error('Update blog error:', error);
      res.status(400).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const blog = await Blog.findOneAndDelete({
        _id: req.params.id,
        author: req.user._id
      });

      if (!blog) {
        return res.status(404).json({ error: 'Blog post not found or unauthorized' });
      }

      if (blog.image) {
        const imagePath = path.join(__dirname, '../public', blog.image);
        try {
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        } catch (e) {
          console.error('Error deleting image file:', e);
        }
      }

      res.json({ message: 'Blog post deleted successfully' });
    } catch (error) {
      console.error('Delete blog error:', error);
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = blogController;