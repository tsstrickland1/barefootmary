import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/account";

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect to the intended destination with a confirmation flag
  const destination = new URL(next, url.origin);
  destination.searchParams.set("confirmed", "true");
  return NextResponse.redirect(destination);
}
