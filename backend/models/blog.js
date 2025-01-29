const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
  title: { 
    type: String, 
    required: true 
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
  category: {
    type: String,
    required: true,
    enum: ['Music News', 'Artist Spotlight', 'Industry Trends', 'Reviews', 'Tutorials']
  },
  tags: [{
    type: String
  }],
  summary: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
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

module.exports = mongoose.model('Blog', blogSchema);