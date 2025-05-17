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
    <div className="card w-full max-w-md bg-base-100 shadow-xl">
      <div className="card-body">
        <h1 className="card-title text-2xl justify-center">{title}</h1>
        {error && <div className="alert alert-error">{error}</div>}
        <button
          onClick={handleGithubSignIn}
          disabled={isDisabled}
          className="btn btn-neutral w-full gap-2"
        >
          <Github size={18} />
          {loading ? "Signing in..." : "Sign in with GitHub"}
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
