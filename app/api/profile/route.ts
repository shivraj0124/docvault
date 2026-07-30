import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    message: "Profile fetched successfully",
    user,
  });
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name } = await request.json();

    if (!name || name.trim().length < 3) {
      return NextResponse.json(
        {
          message: "Name must be at least 3 characters",
        },
        {
          status: 400,
        }
      );
    }

    await pool.query(
      `
      UPDATE users
      SET name = ?
      WHERE id = ?
      `,
      [name.trim(), user.id]
    );

    return NextResponse.json({
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}