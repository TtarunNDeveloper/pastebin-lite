import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    // Check DB connectivity
    await connectDB();

    return NextResponse.json(
      { ok: true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false },
      { status: 500 }
    );
  }
}
