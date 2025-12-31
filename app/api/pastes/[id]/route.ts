import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Paste } from "@/models/Paste";
import { getNow } from "@/lib/time";
import mongoose from "mongoose";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      );
    }

    await connectDB();

    const paste = await Paste.findById(id);

    if (!paste) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      );
    }

    const now = getNow(req);

    // TTL check
    if (paste.expiresAt && now >= paste.expiresAt) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      );
    }

    // View limit check
    if (paste.maxViews !== null && paste.views >= paste.maxViews) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      );
    }

    // Increment view count atomically
    paste.views += 1;
    await paste.save();

    const remainingViews =
      paste.maxViews !== null
        ? Math.max(paste.maxViews - paste.views, 0)
        : null;

    return NextResponse.json(
      {
        content: paste.content,
        remaining_views: remainingViews,
        expires_at: paste.expiresAt
          ? new Date(paste.expiresAt).toISOString()
          : null,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Not found" },
      { status: 404 }
    );
  }
}
