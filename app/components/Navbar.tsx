"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{ wins: number; losses: number } | null>(
    null
  );
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      console.log("Current user:", user?.id);

      if (user) {
        // Fetch user stats from profiles table
        const { data, error } = await supabase
          .from("profiles")
          .select("wins, losses")
          .eq("id", user.id)
          .single();

        console.log("Fetched stats data:", data);
        if (error) console.log("Error fetching stats:", error);

        if (data) {
          setStats(data);
          console.log("Set stats to:", data);
        } else if (error && error.code !== "PGRST116") {
          console.error("Error fetching user stats:", error);
        }
      }

      setLoading(false);
    }
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      console.log("Auth state changed, user:", currentUser?.id);

      if (currentUser) {
        // Fetch user stats when auth state changes
        const { data, error } = await supabase
          .from("profiles")
          .select("wins, losses")
          .eq("id", currentUser.id)
          .single();

        console.log("Auth change stats:", data);
        if (error) console.log("Auth change error:", error);

        if (data) {
          setStats(data);
        }
      } else {
        setStats(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const handleSignOut = async () => {
    // Sign out on client side first
    await supabase.auth.signOut();
    // Then call the server endpoint
    await fetch("/auth/signout", { method: "POST" });
    router.refresh();
  };

  console.log("Rendering Navbar, stats:", stats);

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white font-bold text-xl">
          Card Games
        </Link>

        <div className="flex items-center space-x-4">
          {!loading && (
            <>
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/profile"
                    className="text-white hover:text-gray-300"
                  >
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
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="text-white hover:text-gray-300"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
