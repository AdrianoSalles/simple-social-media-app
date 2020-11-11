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

// Generate token method
const generateToken = (user) => {
  const userToken = { id: user.id, email: user.email, username: user.username };
  return jwt.sign(userToken, SECRET_KEY, { expiresIn: '1h' });
};

// Hash password method
const getHashPassword = async (password) => {
  const salt = 12;
  return await bcrypt.hash(password, salt);
};

// Login method
const login = async (_, { username, password }) => {
  const { errors, valid } = validateLoginInput(username, password);

  if (!valid) {
    throw new UserInputError('Errors', { errors });
  }

  const user = await User.findOne({ username });

  if (!user) {
    errors.general = 'User not found';
    throw new UserInputError('User not found', { errors });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    errors.general = 'Wrong credentials';
    throw new UserInputError('Wrong credentials', { errors });
  }

  const token = generateToken(user);

  return {
    ...user._doc,
    id: user._id,
    token,
  };
};

// Register method
const register = async (
  _,
  { registerInput: { username, email, password, confirmPassword } }
) => {
  // Validate user data
  const registerData = { username, email, password, confirmPassword };
  const { valid, errors } = validateRegisterInput(registerData);

  if (!valid) {
    throw new UserInputError('Errors', { errors });
  }

  // make sure user does not already exist
  const user = await User.findOne({ username });

  if (user) {
    const errors = { username: 'This username is taken' };
    throw new UserInputError('Username is taken', { errors });
  }

  // hash password and create an auth token
  const passwordHash = getHashPassword(password);
  const createdAt = new Date().toISOString();

  const newUser = new User({
    email,
    username,
    passwordHash,
    createdAt,
  });

  const createUserResult = await newUser.save();
  const userToken = generateToken(createUserResult);

  return {
    ...createUserResult._doc,
    id: createUserResult._id,
    token: userToken,
  };
};

module.exports = {
  Mutation: {
    login,
    register,
  },
};
