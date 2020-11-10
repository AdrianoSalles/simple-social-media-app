const { UserInputError } = require('apollo-server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');
const {
  validateRegisterInput,
  validateLoginInput,
} = require('../../util/validators');

// Configs
const { SECRET_KEY } = require('../../config');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    SECRET_KEY,
    {
      expiresIn: '1h',
    }
  );
};

module.exports = {
  Mutation: {
    // Login users
    login: async (_, { username, password }) => {
      const { errors, valid } = validateLoginInput(username, password);

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      const user = await User.findOne({ username });

      if (!user) {
        errors.general = 'User not found';
        throw new UserInputError('User not found', { errors });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        errors.general = 'Wrong credentials';
        throw new UserInputError('Wrong credentials', { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
    // Function to register users
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
      const token = generateToken(result);

      return {
        ...result._doc,
        id: result._id,
        token,
      };
    },
  },
};
