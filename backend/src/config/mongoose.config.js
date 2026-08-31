import mongoose from "mongoose";

/**
 * This used to catch the connection error, log "Something went wrong with DB",
 * and return normally — so index.js carried on and started the server against
 * a dead database. Now it rejects and the caller refuses to boot.
 */
const connectToMongoose = async () => {
  const uri = process.env.MONGO_DB_URL;
  if (!uri) {
    throw new Error("MONGO_DB_URL is not set (see .env.example)");
  }

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log("MongoDB connected");
};

export default connectToMongoose;
