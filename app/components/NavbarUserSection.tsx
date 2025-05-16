"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "../context/AuthContext";

export default function NavbarUserSection() {
  const router = useRouter();
  const { user, stats, isClient } = useAuth();
  const supabase = createClient();

  const handleSignOut = async () => {
    // Sign out on client side first
    await supabase.auth.signOut();
    // Then call the server endpoint
    await fetch("/auth/signout", { method: "POST" });
    router.refresh();
  };

  // If we haven't yet determined if we're on the client,
  // render a loading skeleton
  if (!isClient) {
    return (
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-4">
          <div className="h-6 bg-gray-600 rounded w-24 animate-pulse"></div>
          <div className="flex items-center space-x-2 bg-gray-700 rounded px-3 py-1 animate-pulse">
            <div className="h-4 bg-gray-600 rounded w-12"></div>
            <span className="text-white">|</span>
            <div className="h-4 bg-gray-600 rounded w-12"></div>
          </div>
          <div className="h-8 bg-gray-600 rounded w-20 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center space-x-4">
        <Link href="/profile" className="text-white hover:text-gray-300">
          {user.user_metadata?.name || user.email}
        </Link>
        {stats && (
          <div className="flex items-center space-x-2 bg-gray-700 rounded px-3 py-1">
            <span className="text-green-400 font-medium">
              W: {stats.wins || 0}
            </span>
            <span className="text-white">|</span>
            <span className="text-red-400 font-medium">
              L: {stats.losses || 0}
            </span>
          </div>
        )}
        <button
          onClick={handleSignOut}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <Link href="/sign-in" className="text-white hover:text-gray-300">
        Sign In
      </Link>
      <Link
        href="/sign-up"
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
      >
        Sign Up
      </Link>
    </div>
  );
}
