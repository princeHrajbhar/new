import { ImageGallaryModel } from "@/models/Member";
import { connectToDB } from "@/lib/mongoDB";
import { UploadImage } from "@/lib/upload-image";
import { NextRequest, NextResponse } from "next/server";

connectToDB();

export const GET = async () => {
    try {
      const images = await ImageGallaryModel.find({});
      
      // Return just the images array, without wrapping it in an object
      return NextResponse.json(images, { status: 200 });
    } catch (error) {
      console.error("Error fetching data:", error);
      return NextResponse.json(
        { error: "Failed to fetch data" },
        { status: 500 }
      );
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
