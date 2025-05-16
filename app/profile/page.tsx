"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<{ wins: number; losses: number } | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        await fetchStats(user.id);
      } else {
        setLoading(false);
      }
    }

    getUser();
  }, []);

  async function fetchStats(userId: string) {
    // Check if profile exists
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    console.log("Profile data:", data);
    console.log("Profile error:", error);

    if (data) {
      setStats(data);
    } else if (error && error.code === "PGRST116") {
      // No profile found, create one
      setMessage("Creating new profile...");
      try {
        const { data: newProfile, error: insertError } = await supabase
          .from("profiles")
          .insert({
            id: userId,
            wins: 0,
            losses: 0,
          })
          .select();

        console.log("New profile:", newProfile);
        if (newProfile && newProfile.length > 0) {
          setStats(newProfile[0]);
          setMessage("New profile created!");
        } else {
          setMessage(
            "Error creating profile: " +
              (insertError?.message || "Unknown error")
          );
        }
      } catch (err) {
        console.error("Error creating profile:", err);
        setMessage("Error creating profile");
      }
    } else if (error) {
      setMessage("Error fetching profile: " + error.message);
    }

    setLoading(false);
  }

  async function updateStats(type: "win" | "loss" | "reset") {
    if (!user || !stats) return;

    setLoading(true);

    try {
      if (type === "reset") {
        const { data, error } = await supabase
          .from("profiles")
          .update({ wins: 0, losses: 0 })
          .eq("id", user.id)
          .select();

        if (data && data.length > 0) {
          setStats(data[0]);
          setMessage("Stats reset successfully!");
        } else if (error) {
          setMessage("Error resetting stats: " + error.message);
        }
      } else {
        // Increment win or loss directly
        const newStats = {
          ...stats,
          wins: type === "win" ? (stats.wins || 0) + 1 : stats.wins,
          losses: type === "loss" ? (stats.losses || 0) + 1 : stats.losses,
        };

        const { data, error } = await supabase
          .from("profiles")
          .update(newStats)
          .eq("id", user.id)
          .select();

        if (data && data.length > 0) {
          setStats(data[0]);
          setMessage(
            `${type === "win" ? "Win" : "Loss"} recorded successfully!`
          );
        } else if (error) {
          setMessage(`Error recording ${type}: ` + error.message);
        }
      }
    } catch (err) {
      console.error("Error updating stats:", err);
      setMessage("Error updating stats");
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
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
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

      {message && (
        <div className="alert alert-info mb-6">
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
              className="btn btn-success"
            >
              Record Win
            </button>
            <button
              onClick={() => updateStats("loss")}
              className="btn btn-error"
            >
              Record Loss
            </button>
            <button
              onClick={() => updateStats("reset")}
              className="btn btn-outline"
            >
              Reset Stats
            </button>
          </div>

          <div className="card-actions justify-end mt-6">
            <Link href="/" className="btn btn-primary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
