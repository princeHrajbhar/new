import mongoose, { Schema, model, models } from "mongoose";

// Define the schema for the image gallery
const ImageGallarySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      validate: {
        validator: function (email: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // Basic email validation
        },
        message: "Invalid email format",
      },
    },
    image_url: {
      type: String,
      required: [true, "Image URL is required"],
    },
    public_id: {
      type: String,
      required: [true, "Image public ID is required"],
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Export the model
const ImageGallaryModel =
  models.ImageGallary || model("ImageGallary", ImageGallarySchema);

export default ImageGallaryModel;
