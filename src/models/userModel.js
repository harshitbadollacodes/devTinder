const { Schema, model } = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = new Schema(
  {
    firstName: { type: String, required: true, minLength: 4, maxLength: 50 },
    lastName: { type: String },
    emailId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true },
    age: {
      type: String,
      min: 18,
    },
    about: {
      type: String,
      default: "bio is loading...",
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Not a valid gender");
        }
      },
    },
    skills: {
      type: [String],
    },
    photoURL: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, "DEV@TINDER123", {
    expiresIn: "1d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const hashedPassword = user.password;

  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    hashedPassword
  );

  return isPasswordValid;
};

userSchema.methods.validateURL = async function (URL) {
  return validator.isURLValid(URL);
};

const User = model("User", userSchema);

module.exports = { User };
