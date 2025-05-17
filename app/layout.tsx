import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/layout/Navbar";
import { AuthProvider } from "@/app/_providers/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Card Games",
  description: "A simple card games application",
};

// This layout uses a Client Component AuthProvider
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" data-theme="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-base-100 text-base-content`}
      >
        <AuthProvider>
          <Navbar />
          <main className="container mx-auto px-4 py-8 mt-16">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
