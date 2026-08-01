import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { removeDocument, renameDocument } from "@/services/document.service";
import { JwtPayload } from "jsonwebtoken";
import { getSignedFileUrl } from "@/services/s3.service";
import { getDocumentById } from "@/repositories/document.repository";
interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const { id } = await params;

    await removeDocument(Number(id), (user as JwtPayload & { id: number }).id);

    return NextResponse.json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 400 },
    );
  }
}

export async function GET(request: Request, { params }: Params) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const { id } = await params;

    const document = await getDocumentById(Number(id));

    if (!document) {
      return NextResponse.json(
        {
          success: false,
          message: "Document not found",
        },
        { status: 404 },
      );
    }

    if (document.user_id !== user.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden",
        },
        { status: 403 },
      );
    }
    const signedUrl =
      document.storage_provider === "S3"
        ? await getSignedFileUrl(document.storage_key)
        : document.file_url;

    return NextResponse.json({
      success: true,
      data: {
        ...document,
        file_url: signedUrl,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const { id } = await params;
    const { title } = await request.json();

    const updatedDocument = await renameDocument(Number(id), user.id, title);

    return NextResponse.json({
      success: true,
      message: "Document renamed successfully",
      data: updatedDocument,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 400 },
    );
  }
}
