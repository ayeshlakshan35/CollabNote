import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DB_NAME || undefined,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`MongoDB Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    throw error;
  }
};

export default connectDB;