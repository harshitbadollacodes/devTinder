const express = require("express");
const bcrypt = require("bcrypt");

const { User } = require("../models/userModel");
const { signupValidator } = require("../utils/validation");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  signupValidator(req);
  const { firstName, lastName, emailId, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    firstName,
    lastName,
    emailId,
    password: hashedPassword,
  });

  await user.save();
  res.send("Signup successful");
  try {
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    //check if user exists?
    const user = await User.findOne({ emailId });
    if (!user) {
      res.status(404).send({ message: "Invalid credentials" });
    }

    // const isPasswordValid = await bcrypt.compare(password, user.password);
    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      res.status(401).send({ success: false, message: "Invalid credentials" });
    }

    const token = await user.getJWT();
    res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) });
    res.send({ success: true, user });
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
});

authRouter.post("/logout", (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });
    res.send({ success: true, message: "Logout successful" });
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
});

module.exports = {
  authRouter,
};
