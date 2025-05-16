"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
      } catch (err) {
        console.error("Error getting user:", err);
      }
    }
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const handlePlayBlackjack = () => {
    if (user) {
      router.push("/blackjack");
    } else {
      document.getElementById("auth-modal")?.classList.add("modal-open");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Welcome to Card Games</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
        <div className="p-8 border rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white flex flex-col items-center text-center">
          <h2 className="text-2xl font-semibold mb-4">Blackjack</h2>
          <p className="text-gray-600 mb-4">
            Play a classic game of Blackjack against the dealer.
          </p>
          <button
            onClick={handlePlayBlackjack}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            Play Now
          </button>
        </div>

        {!user ? (
          <div className="p-8 border rounded-lg shadow-md bg-white flex flex-col items-center text-center">
            <h2 className="text-2xl font-semibold mb-4">
              Sign In to Play More
            </h2>
            <p className="text-gray-600 mb-4">
              Sign in with your GitHub account to access more games and save
              your progress.
            </p>
            <Link
              href="/sign-in"
              className="mt-4 px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition-colors"
            >
              Sign In
            </Link>
          </div>
        ) : (
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
        )}
      </div>

      {/* Authentication Modal */}
      <div id="auth-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Authentication Required</h3>
          <p className="py-4">You need to be signed in to play Blackjack.</p>
          <div className="modal-action">
            <Link href="/sign-in" className="btn btn-primary">
              Sign In
            </Link>
            <Link href="/sign-up" className="btn">
              Sign Up
            </Link>
            <button
              className="btn btn-outline"
              onClick={() =>
                document
                  .getElementById("auth-modal")
                  ?.classList.remove("modal-open")
              }
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
