import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } =
      await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        {
          message: "All fields are required",
        },
        {
          status: 400,
        }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        {
          message:
            "Password must be at least 8 characters",
        },
        {
          status: 400,
        }
      );
    }

    const [rows]: any = await pool.query(
      `
      SELECT password
      FROM users
      WHERE id = ?
      `,
      [user.id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      rows[0].password
    );

    if (!isMatch) {
      return NextResponse.json(
        {
          message: "Current password is incorrect",
        },
        {
          status: 400,
        }
      );
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    await pool.query(
      `
      UPDATE users
      SET password = ?
      WHERE id = ?
      `,
      [hashedPassword, user.id]
    );

    return NextResponse.json({
      message: "Password changed successfully",
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