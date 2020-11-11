const { UserInputError } = require('apollo-server');
const Post = require('../../models/Post');
const checkAuth = require('../../util/checkAuth');

// Add like to a post
const likePost = async (_, { postId }, context) => {
  const { username } = checkAuth(context);
  const post = await Post.findById(postId);

  if (!post) {
    throw new UserInputError('Post not found');
  }

  const like = post.likes.find((l) => l.username === username);

  if (like) {
    const likeIndex = post.likes.indexOf(like);
    post.likes.splice(likeIndex, 1);
  } else {
    const createdAt = new Date().toISOString();
    const newLike = { username, createdAt };
    post.likes.push(newLike);
  }

  return await post.save();
};

module.exports = {
  Mutation: {
    likePost,
  },
};
