import mongoose from "mongoose";

// Define the schema
const ImageGallarySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  image_url: {
    type: String,
    required: true,
  },
  public_id: {
    type: String,
    required: true,
  },
});

// Create and export the model
const ImageGallaryModel = mongoose.models.ImageGallary || mongoose.model("ImageGallary", ImageGallarySchema);

export default ImageGallaryModel;
