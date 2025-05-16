"use client";

import React, { useState, useEffect } from "react";
import { supabaseService } from "@/app/_lib/supabase-service";
import type { UserStats } from "@/app/_lib/supabase-service";

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState<UserStats[]>([]);
  const [selectedUser, setSelectedUser] = useState("");

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await supabaseService.getAllUserStats();
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setMessage("Failed to load users");
    } finally {
      setLoading(false);
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

  // Admin panel UI
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

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
        <div className="overflow-x-auto bg-white rounded-lg shadow">
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
              {users.length === 0 && loading && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">
                    Loading user data...
                  </td>
                </tr>
              )}
              {users.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
