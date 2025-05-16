"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_providers/AuthProvider";
import Link from "next/link";
import BlackjackGame from "./BlackjackGame";

export default function BlackjackControls() {
  const router = useRouter();
  const { user } = useAuth();
  const [showGame, setShowGame] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlay = () => {
    if (!user) {
      setError("You must be signed in to play Blackjack");
      return;
    }

    setShowGame(true);
    setError(null);
  };

  if (showGame) {
    return <BlackjackGame />;
  }

  return (
    <>
      {error && (
        <div className="alert alert-error mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="card bg-base-200 shadow-xl w-full max-w-lg">
        <div className="card-body">
          <h2 className="card-title">Game Controls</h2>

          <div className="flex justify-center my-4">
            <button
              onClick={handlePlay}
              className="btn btn-primary btn-lg"
              disabled={!user}
            >
              Play Game
            </button>
          </div>

          {!user && (
            <div className="mt-4 text-center">
              <p className="mb-2">You need to be signed in to play Blackjack</p>
              <div className="flex justify-center gap-2">
                <Link href="/sign-in" className="btn btn-sm">
                  Sign In
                </Link>
                <Link href="/sign-up" className="btn btn-sm">
                  Sign Up
                </Link>
              </div>
            </div>
          )}

          {user && (
            <div className="mt-4 text-center">
              <p>Track your wins and losses in your profile</p>
              <Link href="/profile" className="btn btn-sm btn-outline mt-2">
                Go to Profile
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
