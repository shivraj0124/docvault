import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { searchUserDocuments } from "@/services/document.service";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") ?? "";
    const category = searchParams.get("category") ?? "";
    const page = Number(searchParams.get("page") ?? "1");
    const limit = Number(searchParams.get("limit") ?? "10");

    const result = await searchUserDocuments(
      user.id,
      search,
      category,
      page,
      limit
    );

    return NextResponse.json({
      success: true,
      data: result.documents,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}