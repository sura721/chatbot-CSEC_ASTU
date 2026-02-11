import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { DocumentModel } from "@/lib/models/Document";

// GET List of filenames
export async function GET() {
  await connectDB();
  const docs = await DocumentModel.distinct("metadata.fileName");
  return NextResponse.json(docs);
}

// DELETE specific file OR Delete All
export async function DELETE(req: Request) {
  try {
    const { fileName, deleteAll } = await req.json();
    await connectDB();

    if (deleteAll) {
      await DocumentModel.deleteMany({});
      return NextResponse.json({ success: true, message: "Brain cleared" });
    }

    // Specific file deletion
    const result = await DocumentModel.deleteMany({ "metadata.fileName": fileName });
    return NextResponse.json({ success: true, deletedCount: result.deletedCount });
  } catch (err) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}