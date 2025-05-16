import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin Panel - Card Games",
  description: "Admin panel for managing card games statistics",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Server-side authentication and admin check using the secure method
  const supabase = await createClient();

  // Use getUser() instead of getSession() for authenticated data
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // Handle authentication errors
  if (error || !user) {
    console.error("Authentication error:", error);
    redirect("/");
  }

  // Get admin user ID from environment variable
  const adminUserId = process.env.ADMIN_USER_ID;

  // If admin ID not set or user is not admin, redirect
  if (!adminUserId || user.id !== adminUserId) {
    redirect("/");
  }

  // Only admins reach this point
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-900 text-white mb-6 py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Card Games Admin</h1>
            <div className="flex gap-4">
              <a href="/" className="hover:underline">
                Home
              </a>
              <a href="/admin" className="hover:underline">
                Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
