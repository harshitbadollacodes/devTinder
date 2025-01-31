const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const { User } = require("./models/userModel");
const { signupValidator } = require("./utils/validation");
const initialiseDBConnection = require("./config/database");
const { userAuth } = require("./middleware/auth");

const app = express();

// initialising DB connection here before the server is starts listening on PORT
initialiseDBConnection();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    signupValidator(req);

    const { firstName, lastName, emailId, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });
    await user.save(req.body);

    res.send("User Saved");
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    //check if user exists?
    const user = await User.findOne({ emailId });
    if (!user) {
      res.status(404).send({ message: "Invalid credentials" });
    }

    console.log(user);

    // const isPasswordValid = await bcrypt.compare(password, user.password);
    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      res.status(401).send({ success: false, message: "Invalid credentials" });
    }

    // generate json web token
    // const token = await jwt.sign({ _id: user._id }, "DEV@TINDER123", {
    //   expiresIn: "1d",
    // });

    const token = await user.getJWT();
    res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) });
    res.send({ success: true, user });
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const { user } = req;
    res.send(user);
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const { user } = req;

    res.send(`${user.firstName} sent a request`);
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
});

app.get("/findUser", async (req, res) => {
  try {
    const user = await User.find({ emailId: req.body.emailId });

    if (user.length === 0) {
      res.status(404).send("User not found");
      return;
    }

    res.send(user);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

app.get("/findUserById", async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (user.length === 0) {
      res.status(404).send("User not found");
      return;
    }
    res.send(user);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

app.delete("/deleteUser", async (req, res) => {
  const userId = req.body.userId;
  try {
    const users = await User.findByIdAndDelete(userId);
    if (users.length === 0) {
      res.status(404).send("User not found");
    }
    res.send("User deleted");
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

app.patch("/updateUser/:userId", async (req, res) => {
  const id = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["skills", "age", "about", "gender", "photoURL"];

    const isAllowedUpdates = Object.keys(data).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );

    if (!isAllowedUpdates) {
      throw new Error("Update not allowed");
    }

    if (req.body.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }

    const updatedUser = await User.findByIdAndUpdate(id, data, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).send("User not found.");
    }
    res.send("Updated User");
  } catch (error) {
    res.status(400).send("Something went wrong" + error.message);
  }
});

app.listen(3001);
