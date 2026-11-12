import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

try {
  if (!MONGO_URI) throw new Error("MONGO_URI is not defined");
  if (!DB_NAME) throw new Error("DB_NAME is not defined");

  await mongoose.connect(MONGO_URI, {
    dbName: DB_NAME,
  });

    console.log(`\x1b[35mMongoDB connected via Mongoose\x1b[0m`);
  
} catch (err) {
  console.error("Error connecting to MongoDB:", err);
  process.exit(1);
}
