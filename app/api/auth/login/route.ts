import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/validations/auth.validation";
import { loginUser } from "@/services/auth.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const data = loginSchema.parse(body);

    const result = await loginUser(
      data.email,
      data.password
    );

    const response = NextResponse.json({
      message: "Login successful",
      user: result.user,
    });

    response.cookies.set("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 401 }
    );
  }
}