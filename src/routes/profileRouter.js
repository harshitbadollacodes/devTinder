const express = require("express");
const { userAuth } = require("../middleware/auth");
const { User } = require("../models/userModel");
const { validateEditFields } = require("../utils/validation");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const { user } = req;
    res.send(user);
  } catch (error) {
    console.log("error from profile/view");
    res.status(400).send(`Error: ${error.message}`);
  }
});

module.exports = {
  profileRouter,
};

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const isEditBodyValid = validateEditFields(req);

    if (!isEditBodyValid) {
      throw new Error("updated not allowed");
    }

    const { user: loggedInUser } = req;

    Object.keys(req.body).forEach(
      (field) => (loggedInUser[field] = req.body[field])
    );

    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName}'s details updated successfully`,
      loggedInUser,
    });
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
});
