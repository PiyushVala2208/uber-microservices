import mongoose from "mongoose";

export const connectToDB = async () => {
  try {
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL is not defined in environment variables");
    }

    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log("Captain service connected to MongoDB:", conn.connection.host);
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    process.exit(1); // 0 means success, 1 means failure
  }
};
