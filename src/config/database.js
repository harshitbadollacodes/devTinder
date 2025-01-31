const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://harshitbadolla5:CPzzSf7bgO9zq14z@namastenodepracticehars.lswsd.mongodb.net/devTinder"
  );
};

const initialiseDBConnection = () => {
  connectDB()
    .then(() => {
      console.log("DB connected successfully...");
    })
    .catch((error) => {
      console.error(`Unable to connect to DB ${error.message}`);
    });
};

module.exports = initialiseDBConnection;
