import { auth } from "@clerk/nextjs/server";
import { ChatModel } from "@/lib/models/Chat";
import connectDB from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } =await  auth();
  if (!userId) return NextResponse.json([], { status: 401 });

  await connectDB();
  const history = await ChatModel.find({ userId }).sort({ createdAt: 1 }).limit(50);
  
  return NextResponse.json(history);
}