import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { dashboardService } from "@/services/dashboard.service";

export async function GET() {
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

    const dashboard = await dashboardService(user.id);

    return NextResponse.json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
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