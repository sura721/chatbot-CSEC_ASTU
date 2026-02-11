import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar"; // Import the Navbar
import ChatWidget from "@/components/ChatWidget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dev Club AI",
  description: "AI Chatbot for University Dev Club",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {/* Add Navbar here so it shows on every page */}
          <Navbar />
          <main>{children}</main>
          <ChatWidget /> 
        </body>
      </html>
    </ClerkProvider>
  );
}