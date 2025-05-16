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

    // Get the current session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ isAdmin: false }, { status: 401 });
    }

    // Check if the current user is the admin
    const isAdmin = session.user.id === adminUserId;

    return NextResponse.json({ isAdmin });
  } catch (error) {
    console.error("Error checking admin status:", error);
    return NextResponse.json(
      { error: "Error checking admin status" },
      { status: 500 }
    );
  }
}
