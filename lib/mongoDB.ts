import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDB = async (): Promise<void> => {
  // Use `mongoose.set` for controlling strictQuery behavior
  mongoose.set("strictQuery", true);

  // If already connected, no need to reconnect
  if (isConnected) {
    console.log("MongoDB is already connected");
    return;
  }

  // Check if MongoDB URL is set
  const mongoURI = process.env.MONGODB_URL;
  if (!mongoURI) {
    console.error("MongoDB URL is not defined. Please set the MONGODB_URL environment variable.");
    throw new Error("MongoDB URL is not defined");
  }

  try {
    // Attempt to connect to the MongoDB database
    await mongoose.connect(mongoURI, {
      dbName: "imageupload", // Make sure "imageupload" is the correct database name
    });

    isConnected = true;
    console.log("MongoDB is connected");
  } catch (err) {
    console.error("[MongoDB Connection Error]", err); // Improved error logging
    throw new Error("Failed to connect to MongoDB");
  }
};
