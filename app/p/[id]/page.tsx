import { connectDB } from "@/lib/db";
import { Paste } from "@/models/Paste";
import { getNow } from "@/lib/time";
import mongoose from "mongoose";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PastePage({ params }: PageProps) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    notFound();
  }

  await connectDB();

  const paste = await Paste.findById(id);

  if (!paste) {
    notFound();
  }

  const now = getNow({
    headers: new Headers(),
  } as any);

  // TTL check
  if (paste.expiresAt && now >= paste.expiresAt) {
    notFound();
  }

  // View limit check
  if (paste.maxViews !== null && paste.views >= paste.maxViews) {
    notFound();
  }

  return (
    <main
      style={{
        padding: "2rem",
        fontFamily: "monospace",
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        color: "#000000",
      }}
    >
      <h1>Paste</h1>
      <pre
        style={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          background: "#f4f4f4",
          color: "#000",
          padding: "1rem",
          borderRadius: "4px",
          border: "1px solid #ddd",
        }}
      />
    </main>
  );
}
