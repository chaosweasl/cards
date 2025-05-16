"use client";

import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

export interface UserStats {
  wins: number;
  losses: number;
}

export class SupabaseService {
  private supabase = createClient();

  async getUserStats(userId: string): Promise<UserStats | null> {
    try {
      const { data, error } = await this.supabase
        .from("profiles")
        .select("wins, losses")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error("Error fetching user stats:", error);
        return null;
      }

      return data as UserStats;
    } catch (err) {
      console.error("Unexpected error fetching user stats:", err);
      return null;
    }
  }

  async updateUserStats(
    userId: string,
    stats: Partial<UserStats>
  ): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from("profiles")
        .update(stats)
        .eq("user_id", userId);

      if (error) {
        console.error("Error updating user stats:", error);
        return false;
      }

      return true;
    } catch (err) {
      console.error("Unexpected error updating user stats:", err);
      return false;
    }
  }

  async recordWin(userId: string): Promise<boolean> {
    const stats = await this.getUserStats(userId);
    if (!stats) return false;

    return this.updateUserStats(userId, { wins: (stats.wins || 0) + 1 });
  }

  async recordLoss(userId: string): Promise<boolean> {
    const stats = await this.getUserStats(userId);
    if (!stats) return false;

    return this.updateUserStats(userId, { losses: (stats.losses || 0) + 1 });
  }

  async resetStats(userId: string): Promise<boolean> {
    return this.updateUserStats(userId, { wins: 0, losses: 0 });
  }
}

// Singleton instance for client-side usage
export const supabaseService = new SupabaseService();
