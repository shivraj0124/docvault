import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/validations/auth.validation";
import { registerUser } from "@/services/auth.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input
    const validatedData = registerSchema.parse(body);

    // Register user
    const result = await registerUser(validatedData);

    return NextResponse.json(result, {
      status: 201,
    });
  } catch (error: any) {
    // Zod validation errors
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
        message: error.message || "Something went wrong",
      },
      { status: 400 }
    );
  }
}