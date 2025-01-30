const Post = require('../models/post');

async function index(req, res) {
  const posts = await Post.find({})
    .populate('user')
    .sort('-createdAt');
  res.json(posts);
}

async function create(req, res) {
  try {
    req.body.user = req.user._id;
    const post = await Post.create({
      content: req.body.content,
      currentSong: req.body.currentSong,
      user: req.user._id
    });
    const populatedPost = await post.populate('user');
    res.json(populatedPost);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'Create Post Failed' });
  }
}

async function deletePost(req, res) {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found or unauthorized' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('Delete post error:', err);
    res.status(400).json({ message: 'Delete Post Failed' });
  }
}

async function likePost(req, res) {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userId = req.user._id;
    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json({ isLiked: !isLiked, likeCount: post.likes.length });
  } catch (err) {
    console.error('Like post error:', err);
    res.status(500).json({ message: 'Like Post Failed' });
  }
}

module.exports = {
  create,
  index,
  deletePost,
  likePost
};