import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (code) {
    const supabase = await createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${siteUrl}${next}`);
      } else {
        return NextResponse.redirect(`${siteUrl}${next}`);
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${siteUrl}/auth/auth-code-error`);
}
