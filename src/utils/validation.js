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

const validateEditFields = (req) => {
  const { skills, about, photoURL, age, gender } = req.body;

  const isPhotoURLValid = validator.isURL(photoURL);

  if (!isPhotoURLValid) {
    throw new Error("Photo URL is invalid");
  }

  const allowedEditFields = ["skills", "about", "gender", "age", "photoURL"];

  return Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
};

module.exports = { signupValidator, validateEditFields };
