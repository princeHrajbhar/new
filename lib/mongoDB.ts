import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDB = async (): Promise<void> => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    console.log("MongoDB is already connected");
    return;
  }

  try {
    const dbURI = process.env.MONGODB_URL;
    if (!dbURI) {
      throw new Error("MONGODB_URL is not defined in environment variables");
    }

    await mongoose.connect(dbURI, {
      dbName: "imageupload",
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
    });

    isConnected = true;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error instanceof Error ? error.message : error);
    throw new Error("Failed to connect to MongoDB");
  }
};
