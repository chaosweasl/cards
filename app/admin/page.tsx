"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/app/_providers/AuthProvider";
import { supabaseService } from "@/app/_lib/supabase-service";
import { useRouter } from "next/navigation";
import type { UserStats } from "@/app/_lib/supabase-service";

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Start with loading true
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState<UserStats[]>([]);
  const [selectedUser, setSelectedUser] = useState("");

  // Check if user is admin on mount or user change
  useEffect(() => {
    const checkAdmin = async () => {
      setLoading(true);

      if (!user) {
        // Not logged in
        setLoading(false);
        return;
      }

      try {
        // Fetch from server-side API endpoint
        const response = await fetch("/api/check-admin");
        const data = await response.json();

        if (data.isAdmin) {
          setIsAdmin(true);
          // Fetch users since we're admin
          await fetchUsers();
        } else {
          setMessage("Unauthorized: Admin access only");
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setMessage("Error checking authorization");
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [user]);

  const fetchUsers = async () => {
    try {
      const data = await supabaseService.getAllUserStats();
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setMessage("Failed to load users");
    }
  };

  const addWin = async () => {
    if (!selectedUser) {
      setMessage("Please select a user");
      return;
    }

    setLoading(true);
    try {
      await supabaseService.recordWin(selectedUser);
      setMessage(`Win added for user ${selectedUser}`);
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error("Error adding win:", error);
      setMessage("Failed to add win");
    } finally {
      setLoading(false);
    }
  };

  const addLoss = async () => {
    if (!selectedUser) {
      setMessage("Please select a user");
      return;
    }

    setLoading(true);
    try {
      await supabaseService.recordLoss(selectedUser);
      setMessage(`Loss added for user ${selectedUser}`);
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error("Error adding loss:", error);
      setMessage("Failed to add loss");
    } finally {
      setLoading(false);
    }
  };

  const resetStats = async () => {
    if (!selectedUser) {
      setMessage("Please select a user");
      return;
    }

    if (!confirm(`Reset stats for user ${selectedUser}?`)) {
      return;
    }

    setLoading(true);
    try {
      await supabaseService.resetStats(selectedUser);
      setMessage(`Stats reset for user ${selectedUser}`);
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error("Error resetting stats:", error);
      setMessage("Failed to reset stats");
    } finally {
      setLoading(false);
    }
  };

  // If loading, show loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
        <p>Loading...</p>
      </div>
    );
  }

  // If not logged in, prompt to log in
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>Please log in to access the admin panel</p>
          <button
            onClick={() => router.push("/")}
            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // If not admin, show unauthorized message
  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Unauthorized: Admin access only</p>
          <button
            onClick={() => router.push("/")}
            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  // Admin panel UI
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      {message && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded">
          {message}
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Manage User Stats</h2>

        <div className="mb-4">
          <label className="block mb-2">Select User:</label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full p-2 border rounded text-black"
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user.user_id} value={user.user_id}>
                {user.user_id} (W: {user.wins} / L: {user.losses})
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={addWin}
            disabled={!selectedUser || loading}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-50"
          >
            Add Win
          </button>
          <button
            onClick={addLoss}
            disabled={!selectedUser || loading}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded disabled:opacity-50"
          >
            Add Loss
          </button>
          <button
            onClick={resetStats}
            disabled={!selectedUser || loading}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded disabled:opacity-50"
          >
            Reset Stats
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">User Stats</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Wins
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Losses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Win Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.user_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {user.user_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {user.wins}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {user.losses}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {user.wins + user.losses > 0
                      ? `${Math.round(
                          (user.wins / (user.wins + user.losses)) * 100
                        )}%`
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
