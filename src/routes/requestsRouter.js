const express = require("express");
const { userAuth } = require("../middleware/auth");

const connectionRequestRouter = express.Router();

connectionRequestRouter.post("/sendConnectionRequest", userAuth, (req, res) => {
  try {
    const { user } = req;
    res.send(`${user.firstName} sent a request`);
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
});

module.exports = {
  connectionRequestRouter,
};
