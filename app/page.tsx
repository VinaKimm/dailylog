import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { hasEnvVars } from "@/lib/utils";

export default async function Home() {
  if (!hasEnvVars) {
    // Pre-setup state. The original onboarding hero is still available at
    // /welcome if you want to keep it; here we just nudge to /auth/login.
    redirect("/auth/login");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  redirect(user ? "/entries" : "/auth/login");
}
