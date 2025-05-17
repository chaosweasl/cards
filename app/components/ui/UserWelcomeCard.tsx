"use client";

import Link from "next/link";
import { useAuth } from "@/app/_providers/AuthProvider";

export default function UserWelcomeCard() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body items-center text-center">
          <h2 className="card-title">Sign In to Play More</h2>
          <p>
            Sign in with your GitHub account to access more games and save your
            progress.
          </p>
          <div className="card-actions justify-center mt-4">
            <Link href="/sign-in" className="btn btn-neutral">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body items-center text-center">
        <h2 className="card-title">Welcome Back!</h2>
        <p>Glad to see you again, {user.user_metadata?.name || user.email}!</p>
        <div className="card-actions justify-center mt-4">
          <Link href="/profile" className="btn btn-accent">
            View Profile
          </Link>
        </div>
        <p className="text-base-content/70 mt-2">More games coming soon!</p>
      </div>
    </div>
  );
}
