import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Paste } from "@/models/Paste";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, ttl_seconds, max_views } = body;

    // Validation
    if (!content || typeof content !== "string" || content.trim() === "") {
      return NextResponse.json(
        { error: "content must be a non-empty string" },
        { status: 400 }
      );
    }

    if (
      ttl_seconds !== undefined &&
      (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)
    ) {
      return NextResponse.json(
        { error: "ttl_seconds must be an integer >= 1" },
        { status: 400 }
      );
    }

    if (
      max_views !== undefined &&
      (!Number.isInteger(max_views) || max_views < 1)
    ) {
      return NextResponse.json(
        { error: "max_views must be an integer >= 1" },
        { status: 400 }
      );
    }

    await connectDB();

    const now = Date.now();

    const paste = await Paste.create({
      content,
      createdAt: now,
      expiresAt: ttl_seconds ? now + ttl_seconds * 1000 : null,
      maxViews: max_views ?? null,
      views: 0,
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
    const url = `${baseUrl}/p/${paste._id.toString()}`;

    return NextResponse.json(
      {
        id: paste._id.toString(),
        url,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
