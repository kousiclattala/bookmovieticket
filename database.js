const mongoose = require("mongoose");

const database = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.DB_URL);
    console.log("DB CONNECTED");
  } catch (error) {
    console.log("Error in connecting DB", error);
  }
};

module.exports = database;
