const express = require("express");
const cookieParser = require("cookie-parser");

const initialiseDBConnection = require("./config/database");
const { authRouter } = require("./routes/authRouter");
const { profileRouter } = require("./routes/profileRouter");
const { connectionRequestRouter } = require("./routes/requestsRouter");

const app = express();

// initialising DB connection here before the server is starts listening on PORT
initialiseDBConnection();

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRequestRouter);

app.listen(3001);
