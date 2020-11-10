const { UserInputError } = require('apollo-server');

const Post = require('../../models/Post');
const checkAuth = require('../../util/checkAuth');

module.exports = {
  Mutation: {
    createComment: async (_, { postId, body }, context) => {
      const { username } = checkAuth(context);

      if (body.trim() === '') {
        throw new UserInputError('Empty comment', {
          errors: { body: 'Comment body must not be empty' },
        });
      }

      const post = await Post.findById(postId);
      const createdAt = new Date().toISOString();

      if (post) {
        post.comments.unshift({ body, username, createdAt });
        await post.save();

        return post;
      } else {
        throw new UserInputError('Post not found');
      }
    },
  },
};
