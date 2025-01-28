const BlogPost = require('../models/blog');


const ensureAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Admin access required' });
  }
};

const blogController = {

  async create(req, res) {
    try {
      const blogPost = new BlogPost({
        ...req.body,
        author: req.user._id
      });
      await blogPost.save();
      res.status(201).json(blogPost);
    } catch (error) {
      console.error('Create blog post error:', error);
      res.status(400).json({ error: error.message });
    }
  },


  async update(req, res) {
    try {
      const blogPost = await BlogPost.findById(req.params.id);
      if (!blogPost) {
        return res.status(404).json({ error: 'Blog post not found' });
      }

      Object.assign(blogPost, req.body);
      await blogPost.save();
      res.json(blogPost);
    } catch (error) {
      console.error('Update blog post error:', error);
      res.status(400).json({ error: error.message });
    }
  },


  async delete(req, res) {
    try {
      const blogPost = await BlogPost.findByIdAndDelete(req.params.id);
      if (!blogPost) {
        return res.status(404).json({ error: 'Blog post not found' });
      }
      res.json({ message: 'Blog post deleted successfully' });
    } catch (error) {
      console.error('Delete blog post error:', error);
      res.status(400).json({ error: error.message });
    }
  },

  async getAllForAdmin(req, res) {
    try {
      const blogPosts = await BlogPost.find()
        .populate('author', 'name')
        .sort('-createdAt');
      res.json(blogPosts);
    } catch (error) {
      console.error('Get admin blog posts error:', error);
      res.status(400).json({ error: error.message });
    }
  },

  async getPublished(req, res) {
    try {
      const blogPosts = await BlogPost.find({ status: 'published' })
        .populate('author', 'name')
        .sort('-createdAt');
      res.json(blogPosts);
    } catch (error) {
      console.error('Get published blog posts error:', error);
      res.status(400).json({ error: error.message });
    }
  },

  async getOne(req, res) {
    try {
      const blogPost = await BlogPost.findOne({ slug: req.params.slug })
        .populate('author', 'name');
      
      if (!blogPost) {
        return res.status(404).json({ error: 'Blog post not found' });
      }

      blogPost.viewCount += 1;
      await blogPost.save();

      res.json(blogPost);
    } catch (error) {
      console.error('Get blog post error:', error);
      res.status(400).json({ error: error.message });
    }
  },

  async getAnalytics(req, res) {
    try {
      const analytics = await BlogPost.aggregate([
        {
          $group: {
            _id: null,
            totalPosts: { $sum: 1 },
            totalViews: { $sum: '$viewCount' },
            averageViews: { $avg: '$viewCount' },
            publishedPosts: {
              $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] }
            },
            draftPosts: {
              $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] }
            }
          }
        }
      ]);

      const topPosts = await BlogPost.find()
        .sort('-viewCount')
        .limit(5)
        .select('title viewCount slug');

      res.json({
        summary: analytics[0],
        topPosts
      });
    } catch (error) {
      console.error('Get blog analytics error:', error);
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = {
  blogController,
  ensureAdmin
};