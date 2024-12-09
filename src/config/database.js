const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://gandesaideep1112:cpgzyhIaXWpvgwEv@namastenode.boyw2.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
