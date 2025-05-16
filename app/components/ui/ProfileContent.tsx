"use client";

import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

export default function ProfileContent() {
  const router = useRouter();
  const { user, stats, loading, refreshStats } = useAuth();
  const [message, setMessage] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const supabase = createClient();

  async function updateStats(type: "win" | "loss" | "reset") {
    if (!user || !stats) return;

    try {
      setIsUpdating(true);
      setMessage("Updating stats...");

      if (type === "reset") {
        // Reset stats to 0
        const { data, error } = await supabase
          .from("profiles")
          .update({ wins: 0, losses: 0 })
          .eq("user_id", user.id)
          .select();

        if (error) throw error;

        await refreshStats();
        setMessage("Stats reset successfully!");
      } else {
        // Increment win or loss directly
        const newValue =
          type === "win" ? (stats.wins || 0) + 1 : (stats.losses || 0) + 1;

        const updateData =
          type === "win" ? { wins: newValue } : { losses: newValue };

        console.log(`Updating ${type} to ${newValue}`, updateData);

        const { error } = await supabase
          .from("profiles")
          .update(updateData)
          .eq("user_id", user.id);

        if (error) throw error;

        await refreshStats();
        setMessage(`${type === "win" ? "Win" : "Loss"} recorded successfully!`);
      }

      // Force a page refresh to update UI with new stats
      router.refresh();
    } catch (err: any) {
      console.error("Error updating stats:", err);
      setMessage(`Error updating stats: ${err.message || "Unknown error"}`);
    } finally {
      setIsUpdating(false);
    }
  }

  if (loading) {
    return null; // Will show loading skeleton from loading.tsx
  }

  if (!user) {
    return (
      <div className="card bg-base-200 shadow-xl w-full max-w-md">
        <div className="card-body">
          <h2 className="card-title">Authentication Required</h2>
          <p>You need to be signed in to view your profile.</p>
          <div className="card-actions justify-end mt-4">
            <Link href="/sign-in" className="btn btn-primary">
              Sign In
            </Link>
            <Link href="/" className="btn">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {message && (
        <div
          className={`alert ${
            message.includes("Error") ? "alert-error" : "alert-info"
          } mb-6`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-current shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>{message}</span>
        </div>
      )}

      <div className="card bg-base-200 shadow-xl w-full max-w-md">
        <div className="card-body">
          <h2 className="card-title">User Information</h2>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Name:</strong> {user.user_metadata?.name || "Not provided"}
          </p>

          <div className="divider"></div>

          <h2 className="card-title">Game Statistics</h2>

          <div className="stats stats-vertical lg:stats-horizontal shadow">
            <div className="stat">
              <div className="stat-title">Wins</div>
              <div className="stat-value text-success">{stats?.wins || 0}</div>
            </div>

            <div className="stat">
              <div className="stat-title">Losses</div>
              <div className="stat-value text-error">{stats?.losses || 0}</div>
            </div>

            <div className="stat">
              <div className="stat-title">Win Rate</div>
              <div className="stat-value">
                {stats && stats.wins + stats.losses > 0
                  ? `${Math.round(
                      (stats.wins / (stats.wins + stats.losses)) * 100
                    )}%`
                  : "N/A"}
              </div>
            </div>
          </div>

          <div className="divider">Manage Stats</div>

          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <button
              onClick={() => updateStats("win")}
              disabled={isUpdating}
              className="btn btn-success"
            >
              {isUpdating ? "Recording..." : "Record Win"}
            </button>
            <button
              onClick={() => updateStats("loss")}
              disabled={isUpdating}
              className="btn btn-error"
            >
              {isUpdating ? "Recording..." : "Record Loss"}
            </button>
            <button
              onClick={() => updateStats("reset")}
              disabled={isUpdating}
              className="btn btn-outline"
            >
              {isUpdating ? "Resetting..." : "Reset Stats"}
            </button>
          </div>

          <div className="card-actions justify-end mt-6">
            <Link href="/" className="btn btn-primary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
