const jwt = require("jsonwebtoken");
const { User } = require("../models/userModel");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      res.status(401).send("Token is invalid");
    }

    const decodedMessage = await jwt.verify(token, "DEV@TINDER123");

    const { _id } = decodedMessage;

    const user = await User.findById({ _id });
    if (!user) {
      res.status(404).send("User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
};

module.exports = {
  userAuth,
};
