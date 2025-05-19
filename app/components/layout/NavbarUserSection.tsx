"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/app/_providers/AuthProvider";

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
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="h-6 bg-neutral-focus rounded w-24 animate-pulse"></div>
          <div className="flex items-center gap-2 bg-neutral-focus rounded px-3 py-1 animate-pulse">
            <div className="h-4 bg-neutral-focus rounded w-12"></div>
            <span className="text-neutral-content">|</span>
            <div className="h-4 bg-neutral-focus rounded w-12"></div>
          </div>
          <div className="h-8 bg-neutral-focus rounded w-20 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-4 ml-auto">
        <Link href="/profile" className="link link-hover text-neutral-content">
          {user.user_metadata?.name || user.email}
        </Link>
        {stats && (
          <div className="flex items-center gap-2 bg-neutral-focus rounded px-3 py-1">
            <span className="text-success font-medium">
              W: {stats.wins || 0}
            </span>
            <span className="text-neutral-content">|</span>
            <span className="text-error font-medium">
              L: {stats.losses || 0}
            </span>
          </div>
        )}
        <button onClick={handleSignOut} className="btn btn-error btn-sm">
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 ml-auto">
      <Link href="/sign-in" className="link link-hover text-neutral-content">
        Sign In
      </Link>
      {/* <Link href="/sign-up" className="btn btn-primary btn-sm">
        Sign Up
      </Link> */}
    </div>
  );
}
