const { AuthenticationError } = require('apollo-server');

const checkAuth = require('../../util/checkAuth');
const Post = require('../../models/Post');

// Get all posts
const getPosts = async () => {
  try {
    return await Post.find().sort({ createdAt: -1 });
  } catch (err) {
    throw new Error(err);
  }
};

// Get post by id
const getPost = async (_, { postId }) => {
  try {
    const post = await Post.findById(postId);

    if (post) {
      return post;
    } else {
      throw new Error('Post not found');
    }
  } catch (e) {
    throw new Error(e);
  }
};

// Create a post method
const createPost = async (_, { body }, context) => {
  const user = checkAuth(context);

  const createdAt = new Date().toUTCString();
  const newPost = new Post({
    body,
    user: user.id,
    username: user.username,
    createdAt,
  });

  return await newPost.save();
};

// Delete a post
const deletePost = async (_, { postId }, context) => {
  const user = checkAuth(context);

  try {
    const post = await Post.findById(postId);

    if (user.username === post.username) {
      await post.delete();
      return 'Post deleted successfully';
    }

    throw new AuthenticationError('Action not allowed');
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  Query: {
    getPosts,
    getPost,
  },
  Mutation: {
    createPost,
    deletePost,
  },
};
