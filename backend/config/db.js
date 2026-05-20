const mongoose = require("mongoose");
const { setStoreMode } = require("./store");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
    setStoreMode("mongo");
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    setStoreMode("file");
    console.warn(`MongoDB connection failed: ${error.message}`);
    console.warn("Using local JSON file database at backend/data/db.json");
  }
};

module.exports = connectDB;
