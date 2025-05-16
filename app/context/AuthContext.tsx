"use client";

import { createClient } from "@/utils/supabase/client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type User = any;
type Stats = {
  wins: number;
  losses: number;
} | null;

type AuthContextType = {
  user: User | null;
  stats: Stats;
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
  const [stats, setStats] = useState<Stats>(null);
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
      const { data, error } = await supabase
        .from("profiles")
        .select("wins, losses")
        .eq("user_id", userId)
        .single();

      console.log("Fetched stats data:", data);

      if (data) {
        setStats(data);
      } else if (error && error.code === "PGRST116") {
        // No profile found, create one
        try {
          const { data: newProfile, error: insertError } = await supabase
            .from("profiles")
            .insert({
              user_id: userId,
              wins: 0,
              losses: 0,
            })
            .select();

          console.log("New profile created:", newProfile);
          if (newProfile && newProfile.length > 0) {
            setStats(newProfile[0]);
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
        console.log("Auth context - Current user:", user?.id);

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
      console.log("Auth state changed, user:", currentUser?.id);

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
