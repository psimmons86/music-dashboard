const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  content: { 
    type: String, 
    required: true 
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: function() {
      return false;
    }
  },
  category: {
    type: String,
    required: true,
    enum: ['Music News', 'Artist Spotlight', 'Features', 'Reviews', 'Tutorials']
  },
  tags: [{
    type: String,
    trim: true
  }],
  summary: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  image: {
    type: String
  },
  viewCount: {
    type: Number,
    default: 0
  },
  revisions: [{
    content: String,
    updatedAt: Date
  }]
}, {
  timestamps: true
});

blogSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('author')) {
    try {
      const User = mongoose.model('User');
      const author = await User.findById(this.author);
      this.isAdmin = author?.role === 'admin';
    } catch (error) {
      console.error('Error setting isAdmin flag:', error);
    }
  }
  next();
});

module.exports = mongoose.model('Blog', blogSchema);