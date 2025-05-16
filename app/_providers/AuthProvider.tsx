"use client";

import { createClient } from "@/utils/supabase/client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "@supabase/supabase-js";
import { UserStats, supabaseService } from "@/app/_lib/supabase-service";

type AuthContextType = {
  user: User | null;
  stats: UserStats | null;
  loading: boolean;
  error: string | null;
  isClient: boolean;
  refreshStats: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const supabase = createClient();

  // Set isClient to true when component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch user stats from Supabase
  async function fetchStats(userId: string) {
    try {
      const stats = await supabaseService.getUserStats(userId);

      if (stats) {
        setStats(stats);
      } else {
        // No profile found, create one
        try {
          const success = await supabaseService.updateUserStats(userId, {
            wins: 0,
            losses: 0,
          });

          if (success) {
            setStats({ wins: 0, losses: 0 });
          }
        } catch (err) {
          console.error("Error creating profile:", err);
        }
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  }

  // Function to refresh stats - can be called after updates
  async function refreshStats() {
    if (!user) return;
    await fetchStats(user.id);
  }

  // Initialize auth state
  useEffect(() => {
    if (!isClient) return;

    async function initializeAuth() {
      try {
        setLoading(true);
        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser();

        setUser(user);

        // Fetch stats if user is logged in
        if (user) {
          await fetchStats(user.id);
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
        setError("Failed to initialize authentication");
      } finally {
        setLoading(false);
      }
    }

    initializeAuth();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        await fetchStats(currentUser.id);
      } else {
        setStats(null);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [isClient]); // Only run this effect when isClient changes

  const value = {
    user,
    stats,
    loading,
    error,
    isClient,
    refreshStats,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
