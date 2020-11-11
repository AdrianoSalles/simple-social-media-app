const { UserInputError } = require('apollo-server');

const Post = require('../../models/Post');
const checkAuth = require('../../util/checkAuth');

// Create comment method
const createComment = async (_, { postId, body }, context) => {
  const { username } = checkAuth(context);

  if (body.trim() === '') {
    const errors = { body: 'Comment body must not be empty' };
    throw new UserInputError('Empty comment', { errors });
  }

  const post = await Post.findById(postId);
  const createdAt = new Date().toISOString();

  if (post) {
    const comment = { body, username, createdAt };
    post.comments.unshift(comment);
    await post.save();

    return post;
  } else {
    throw new UserInputError('Post not found');
  }
};

module.exports = {
  Mutation: {
    createComment,
  },
};
