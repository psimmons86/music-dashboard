const Blog = require('../models/blog');

const blogController = {
  // Create new blog post
  async create(req, res) {
    try {
      const blog = new Blog({
        ...req.body,
        author: req.user._id
      });
      await blog.save();
      res.status(201).json(blog);
    } catch (error) {
      console.error('Create blog error:', error);
      res.status(400).json({ error: error.message });
    }
  },

  // Get all blog posts
  async getAll(req, res) {
    try {
      const blogs = await Blog.find()
        .populate('author', 'name')
        .sort('-createdAt');
      res.json(blogs);
    } catch (error) {
      console.error('Get blogs error:', error);
      res.status(400).json({ error: error.message });
    }
  },

  // Get single blog post
  async getOne(req, res) {
    try {
      const blog = await Blog.findById(req.params.id)
        .populate('author', 'name');
      
      if (!blog) {
        return res.status(404).json({ error: 'Blog post not found' });
      }

      // Increment view count
      blog.viewCount += 1;
      await blog.save();

      res.json(blog);
    } catch (error) {
      console.error('Get blog error:', error);
      res.status(400).json({ error: error.message });
    }
  },

  // Update blog post (only author can update)
  async update(req, res) {
    try {
      const blog = await Blog.findOne({
        _id: req.params.id,
        author: req.user._id
      });

      if (!blog) {
        return res.status(404).json({ error: 'Blog post not found or unauthorized' });
      }

      Object.assign(blog, req.body);
      await blog.save();
      res.json(blog);
    } catch (error) {
      console.error('Update blog error:', error);
      res.status(400).json({ error: error.message });
    }
  },

  // Delete blog post (only author can delete)
  async delete(req, res) {
    try {
      const blog = await Blog.findOneAndDelete({
        _id: req.params.id,
        author: req.user._id
      });

      if (!blog) {
        return res.status(404).json({ error: 'Blog post not found or unauthorized' });
      }

      res.json({ message: 'Blog post deleted successfully' });
    } catch (error) {
      console.error('Delete blog error:', error);
      res.status(400).json({ error: error.message });
    }
  },

  // Get user's blog posts
  async getUserBlogs(req, res) {
    try {
      const blogs = await Blog.find({ author: req.user._id })
        .populate('author', 'name')
        .sort('-createdAt');
      res.json(blogs);
    } catch (error) {
      console.error('Get user blogs error:', error);
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = blogController;