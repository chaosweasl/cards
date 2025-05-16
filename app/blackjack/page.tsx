"use client";

import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

function Blackjack() {
  const router = useRouter();
  const { user, refreshStats } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const updateStats = async (type: "win" | "loss" | "reset") => {
    if (!user) return;

    console.log(`Updating stats - type: ${type}, user: ${user.id}`);

    try {
      if (type === "reset") {
        // Reset stats to 0
        console.log("Resetting stats to 0");
        const { data, error } = await supabase
          .from("profiles")
          .update({ wins: 0, losses: 0 })
          .eq("user_id", user.id)
          .select();

        console.log("Reset result:", data, error);
      } else {
        // Increment win or loss
        const field = type === "win" ? "wins" : "losses";
        console.log(`Incrementing ${field}`);

        // First check if profile exists
        const { data: profileCheck, error: checkError } = await supabase
          .from("profiles")
          .select("user_id, wins, losses")
          .eq("user_id", user.id)
          .single();

        console.log("Profile check before update:", profileCheck, checkError);

        if (profileCheck) {
          // Update existing profile
          console.log("Profile exists, updating it");
          try {
            // Direct increment without RPC
            const newValue =
              type === "win"
                ? (profileCheck.wins || 0) + 1
                : (profileCheck.losses || 0) + 1;

            const updateData =
              type === "win" ? { wins: newValue } : { losses: newValue };

            console.log(`Setting ${field} to ${newValue}`);

            const { data: updateResult, error: updateError } = await supabase
              .from("profiles")
              .update(updateData)
              .eq("user_id", user.id)
              .select();

            console.log("Update result:", updateResult, updateError);
          } catch (rpcError) {
            console.error("Error with update:", rpcError);
          }
        } else {
          // Insert new profile with initial stats
          console.log("Profile doesn't exist, creating one");
          const { data: insertResult, error: insertError } = await supabase
            .from("profiles")
            .insert({
              user_id: user.id,
              wins: type === "win" ? 1 : 0,
              losses: type === "loss" ? 1 : 0,
            })
            .select();

          console.log("Insert result:", insertResult, insertError);
        }
      }

      // Refresh stats in the global context
      await refreshStats();

      // Force refresh of the page
      router.refresh();
    } catch (err) {
      console.error("Error updating stats:", err);
    }
  };

  const handlePlay = () => {
    if (!user) {
      setError("You must be signed in to play Blackjack");
      return;
    }

    // Here you would start the game
    setError(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">Blackjack</h1>

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

          {user && <div className="divider">Stats Management</div>}

          {user && (
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
          )}
        </div>
      </div>
    </div>
  );
}

export default Blackjack;
