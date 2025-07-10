const mongoose = require("mongoose");
require("dotenv").config();

exports.dbConnect = () => {
  const db_Url = process.env.DB_URL;
  mongoose.connect(db_Url)
    .then(() => {
      console.log("connection with db established successfully");
    })
    .catch((error) => {
      console.log("db connection failed to establish");
      console.error(error);
      process.exit(1);
    });
};
