module.exports.validateRegisterInput = ({
  username,
  email,
  password,
  confirmPassword,
}) => {
  const errors = {};

  if (username.trim() === '') {
    errors.username = 'Username must not be empty';
  }

  if (email.trim() === '') {
    errors.username = 'Email must not be empty';
  } else {
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = 'Email must be a valid email address';
    }
  }

  if (password.trim() === '') {
    errors.password = 'Password must not bem empty';
  } else {
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Password must match';
    }
  }

  const hasErrors = Object.keys(errors).length < 1;

  return {
    errors,
    valid: hasErrors,
  };
};

module.exports.validateLoginInput = (username, password) => {
  const errors = {};

  if (username.trim() === '') {
    errors.username = 'Username must not be empty';
  }

  if (password.trim() === '') {
    errors.password = 'Password must not be empty';
  }

  const hasErrors = Object.keys(errors).length < 1;

  return {
    errors,
    valid: hasErrors,
  };
};
