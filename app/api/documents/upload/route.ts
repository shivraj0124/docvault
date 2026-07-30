import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { uploadToCloudinary } from "@/services/storage.service";
import { saveDocument } from "@/services/document.service";
import { validateFile } from "@/validations/file.validation";
import { AppError } from "@/utils/AppError";
import { CATEGORIES } from "@/constants/categories";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    console.log("category",category)

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "File is required",
        },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Category is required",
        },
        { status: 400 }
      );
    }

    if (!CATEGORIES.includes(category as (typeof CATEGORIES)[number])) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid category",
        },
        { status: 400 }
      );
    }

    const validation = validateFile(file, title);

    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          message: validation.message,
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadedFile = await uploadToCloudinary(buffer, file.name);

    await saveDocument({
      userId: (user as any).id,
      title,
      category,
      originalName: file.name,
      storageKey: uploadedFile.public_id,
      storageProvider: "CLOUDINARY",
      fileUrl: uploadedFile.secure_url,
      mimeType: file.type,
      fileSize: file.size,
      is_favourite: false,
    });

    return NextResponse.json({
      success: true,
      message: "Document uploaded successfully",
      data: {
        url: uploadedFile.secure_url,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: error.statusCode }
      );
    }

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}