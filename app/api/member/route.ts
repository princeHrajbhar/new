import { ImageGallaryModel } from "@/models/Member";
import { connectToDB } from "@/lib/mongoDB";
import { UploadImage } from "@/lib/upload-image";
import { NextRequest, NextResponse } from "next/server";



export const GET = async () => {
    try {
      await connectToDB(); // Ensure the MongoDB connection is successful
  
      const members = await ImageGallaryModel.find().sort({ createdAt: "desc" }); // Fetch members sorted by creation date
  
      if (members.length === 0) {
        return NextResponse.json({ message: "No members found" }, { status: 200 }); // Return empty array response
      }
  
      return NextResponse.json(members, { status: 200 }); // Return the members
    } catch (err) {
      console.error("[members_GET]", err);
      return new NextResponse("Internal Server Error", { status: 500 }); // Return 500 error if something goes wrong
    }
  };


export const POST = async (req: NextRequest) => {
    try {
        const formData = await req.formData();
        const image = formData.get("image") as unknown as File;
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;

        if (!image || !name || !email) {
            return NextResponse.json(
                { error: "Image, name, and email are required" },
                { status: 400 }
            );
        }

        // Upload the image
        const data = await UploadImage(image, "nextjs-imagegallary");

        await connectToDB()

        // Save the uploaded image and additional details to the database
        await ImageGallaryModel.create({
            name,
            email,
            image_url: data.secure_url,
            public_id: data.public_id,
        });

        console.log({ data });
        return NextResponse.json(
            { msg: "Image and details uploaded successfully", data },
            { status: 200 }
        );
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error:", error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            console.error("Unexpected error:", error);
            return NextResponse.json(
                { error: "An unexpected error occurred" },
                { status: 500 }
            );
        }
    }
};
