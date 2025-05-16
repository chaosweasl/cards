import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get admin user ID from environment variable
    const adminUserId = process.env.ADMIN_USER_ID;

    if (!adminUserId) {
      console.error("ADMIN_USER_ID environment variable not set");
      return NextResponse.json({ isAdmin: false }, { status: 500 });
    }

    // Create a Supabase client for server-side use
    const supabase = await createClient();

    // Use getUser() instead of getSession() for authenticated data
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.error("Authentication error:", error);
      return NextResponse.json({ isAdmin: false }, { status: 401 });
    }

    // Check if the current user is the admin
    const isAdmin = user.id === adminUserId;

    return NextResponse.json({ isAdmin });
  } catch (error) {
    console.error("Error checking admin status:", error);
    return NextResponse.json(
      { error: "Error checking admin status" },
      { status: 500 }
    );
  }
}
