// Disable unused variable rule for 'req' in this file
/* eslint-disable @typescript-eslint/no-unused-vars */

import { connectToDB } from "@/lib/mongoDB";
import ImageGallaryModel from "@/models/ImageGallarySchema";

import { NextRequest, NextResponse } from "next/server";
import { UploadImage } from "@/lib/upload-image";

// POST function (for creating new members)
export const POST = async (req: NextRequest) => {
  try {
    // Connect to MongoDB
    await connectToDB();

    // Parse request data
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const image = formData.get("image") as File | null;

    // Validate input
    if (!name || !email || !image) {
      return NextResponse.json({ error: "Name, email, and image are required" }, { status: 400 });
    }

    // Upload image to Cloudinary
    let uploadResponse;
    try {
      uploadResponse = await UploadImage(image, "nextjs-imagegallary");
    } catch (uploadError) {
      console.error("Error uploading image:", uploadError);
      return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
    }

    // Save to database
    const newEntry = await ImageGallaryModel.create({
      name,
      email,
      image_url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
    });

    return NextResponse.json(
      { message: "Image uploaded successfully", data: newEntry },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/member:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
};

// GET function (for retrieving all members)
export const GET = async (req: NextRequest) => {
  try {
    // Connect to MongoDB
    await connectToDB();

    // Fetch all members from the database
    const members = await ImageGallaryModel.find();

    // If no members are found
    if (members.length === 0) {
      return NextResponse.json({ message: "No members found" }, { status: 404 });
    }

    // Return the list of members
    return NextResponse.json({ data: members }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/member:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
};

