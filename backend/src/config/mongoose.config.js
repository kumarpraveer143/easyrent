import mongoose from "mongoose";

const connectToMongoose = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("Mongoose is connected Successfully!");
  } catch (err) {
    console.log("Something went wrong with DB");
  }
};

export default connectToMongoose;
