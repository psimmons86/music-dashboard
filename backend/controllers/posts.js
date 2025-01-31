const Post = require('../models/post');

async function index(req, res) {
  try {
    const posts = await Post.find({})
      .populate('user')
      .populate('likes')
      .sort('-createdAt');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
}

async function create(req, res) {
  try {
    const post = await Post.create({
      content: req.body.content,
      currentSong: req.body.currentSong,
      user: req.user._id,
      likes: []
    });

    const populatedPost = await post.populate('user');
    res.json(populatedPost);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create post' });
  }
}

async function deletePost(req, res) {
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found or unauthorized' });
    }

    res.json({ message: 'Post deleted successfully', postId: post._id });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete post' });
  }
}

async function likePost(req, res) {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userId = req.user._id;
    const likeIndex = post.likes.indexOf(userId);
    const wasLiked = likeIndex > -1;

    if (wasLiked) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    
    const updatedPost = await Post.findById(post._id)
      .populate('user')
      .populate('likes');

    res.json({
      isLiked: !wasLiked,
      likeCount: updatedPost.likes.length,
      post: updatedPost
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update like' });
  }
}

module.exports = {
  create,
  index,
  deletePost,
  likePost
};