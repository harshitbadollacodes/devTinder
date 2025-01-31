const validator = require("validator");

const signupValidator = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Firstname or Last name is invalid");
  }

  if (!validator.isEmail(emailId)) {
    throw new Error("Email is invalid");
  }

  if (validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
};

module.exports = { signupValidator };
