import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();

  // Get the origin from the request URL or use a default
  const origin = request.headers.get("origin") || request.nextUrl.origin;

  return NextResponse.redirect(`${origin}/`, {
    status: 302,
  });
}
