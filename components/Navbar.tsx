"use client";
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { isAdmin } from "@/lib/admin";

export default function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <nav className="p-4 border-b flex justify-between items-center bg-white shadow-sm">
      <Link href="/" className="font-bold text-xl text-blue-600">
        DevClub AI
      </Link>

      <div className="flex gap-4 items-center">
    
          <Link href="/admin" className="text-sm font-medium hover:text-indigo-600">
            Admin Panel
          </Link>
        
        
        {/* If logged in, show User Profile. If not, show Login Button */}
        {isSignedIn ? (
          <UserButton afterSignOutUrl="/" />
        ) : (
          <SignInButton mode="modal">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Sign In
            </button>
          </SignInButton>
        )}
      </div>
    </nav>
  );
}