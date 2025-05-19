"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Github, Mail } from "lucide-react";
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
      const redirectTo = `${window.location.origin}/auth/callback`;
      console.log("Redirecting to:", redirectTo); // For debugging

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo,
        },
      });

      if (error) {
        setError(error.message);
        console.error("OAuth error:", error);
      }
    } catch (err) {
      setError("An error occurred during sign in");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get the current URL for proper redirect
      const redirectTo = `${window.location.origin}/auth/callback`;
      console.log("Redirecting to:", redirectTo); // For debugging

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        setError(error.message);
        console.error("OAuth error:", error);
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
    <div className="card w-full max-w-md bg-base-100 shadow-xl">
      <div className="card-body">
        <h1 className="card-title text-2xl justify-center">{title}</h1>
        {error && <div className="alert alert-error">{error}</div>}

        <button
          onClick={handleGithubSignIn}
          disabled={isDisabled}
          className="btn btn-neutral w-full gap-2 mb-2"
        >
          <Github size={18} />
          {loading ? "Signing in..." : "Sign in with GitHub"}
        </button>

        <button
          onClick={handleGoogleSignIn}
          disabled={isDisabled}
          className="btn bg-white hover:bg-gray-100 text-gray-800 border-gray-300 w-full gap-2"
        >
          <svg viewBox="0 0 48 48" width="18" height="18">
            <path
              fill="#FFC107"
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            ></path>
            <path
              fill="#FF3D00"
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            ></path>
            <path
              fill="#4CAF50"
              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
            ></path>
            <path
              fill="#1976D2"
              d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            ></path>
          </svg>
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>

        {isSignIn && (
          <p className="text-center text-base-content/70 mt-2">
            Don't have an account?{" "}
            <Link href="/sign-up" className="link link-primary">
              Sign up
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
