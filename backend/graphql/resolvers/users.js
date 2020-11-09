const { UserInputError } = require('apollo-server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');
const { validateRegisterInput } = require('../../util/validators');

// Configs
const { SECRET_KEY } = require('../../config');

module.exports = {
  Mutation: {
    register: async (
      _,
      { registerInput: { username, email, password, confirmPassword } }
    ) => {
      // Validate user data
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      // make sure user does not already exist
      const user = await User.findOne({ username });

      if (user) {
        throw new UserInputError('Username is taken', {
          errors: {
            username: 'This username is taken',
          },
        });
      }

      // hash password and create an auth token
      const salt = 12;
      password = await bcrypt.hash(password, salt);

      const createdAt = new Date().toISOString();
      const newUser = new User({
        email,
        username,
        password,
        createdAt,
      });

      const result = await newUser.save();

      const token = jwt.sign(
        {
          id: result.id,
          email: result.email,
          username: result.username,
        },
        SECRET_KEY,
        {
          expiresIn: '1h',
        }
      );

      return {
        ...result._doc,
        id: result._id,
        token,
      };
    },
  },
};
