import { clerkClient, auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } =await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // FIX: You must await clerkClient() as a function now
    const client = await clerkClient();
    const response = await client.users.getUserList();

    const users = response.data.map(user => ({
      id: user.id,
      email: user.primaryEmailAddress?.emailAddress,
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || "Anonymous",
      imageUrl: user.imageUrl,
    }));

    return NextResponse.json(users);
  } catch (error: any) {
    console.error("Clerk Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId: currentUserId } =await auth();
    if (!currentUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { targetUserId } = await req.json();
    
    if (currentUserId === targetUserId) {
      return NextResponse.json({ error: "You cannot delete yourself" }, { status: 400 });
    }

    // FIX: Await clerkClient() here as well
    const client = await clerkClient();
    await client.users.deleteUser(targetUserId);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}