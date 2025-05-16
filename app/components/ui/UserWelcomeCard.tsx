"use client";

import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

export default function UserWelcomeCard() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="p-8 border rounded-lg shadow-md bg-white flex flex-col items-center text-center">
        <h2 className="text-2xl font-semibold mb-4">Sign In to Play More</h2>
        <p className="text-gray-600 mb-4">
          Sign in with your GitHub account to access more games and save your
          progress.
        </p>
        <Link
          href="/sign-in"
          className="mt-4 px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 border rounded-lg shadow-md bg-white flex flex-col items-center text-center">
      <h2 className="text-2xl font-semibold mb-4">Welcome Back!</h2>
      <p className="text-gray-600 mb-4">
        Glad to see you again, {user.user_metadata?.name || user.email}!
      </p>
      <div className="flex gap-4">
        <Link
          href="/profile"
          className="mt-2 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          View Profile
        </Link>
      </div>
      <p className="text-gray-500 mt-4">More games coming soon!</p>
    </div>
  );
}
