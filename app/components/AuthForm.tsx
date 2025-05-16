"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Github } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import Link from "next/link";

interface AuthFormProps {
  mode: "signin" | "signup";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const supabase = createClient();

  useEffect(() => {
    // Check if we have a session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        startTransition(() => {
          router.push("/");
        });
      }
    });
  }, [router, supabase.auth]);

  const handleGithubSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError("An error occurred during sign in");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isSignIn = mode === "signin";
  const title = isSignIn ? "Sign In" : "Sign Up";
  const isDisabled = loading || isPending;

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">{title}</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <button
        onClick={handleGithubSignIn}
        disabled={isDisabled}
        className="w-full flex justify-center items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Github size={18} />
        {loading ? "Signing in..." : "Sign in with GitHub"}
      </button>
      {isSignIn && (
        <p className="text-center text-gray-600">
          Don't have an account?{" "}
          <Link href="/sign-up" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      )}
    </div>
  );
}
