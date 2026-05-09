"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error: string } | null;

export async function signIn(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  redirect("/entries");
}

export async function signUp(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const repeat = String(formData.get("repeat-password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }
  if (password !== repeat) {
    return { error: "Passwords do not match." };
  }

  const headerStore = await headers();
  // Origin can be missing on same-site Server Action POSTs; fall back to
  // host + forwarded proto so the redirect URL we hand to Supabase is
  // always absolute. If both are missing (rare), drop emailRedirectTo and
  // let Supabase use the project's Site URL.
  const origin =
    headerStore.get("origin") ??
    (() => {
      const host = headerStore.get("host");
      if (!host) return "";
      const proto = headerStore.get("x-forwarded-proto") ?? "http";
      return `${proto}://${host}`;
    })();

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: origin
      ? { emailRedirectTo: `${origin}/auth/confirm?next=/entries` }
      : undefined,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/auth/sign-up-success");
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
}
