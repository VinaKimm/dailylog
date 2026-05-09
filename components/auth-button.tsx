import Link from "next/link";

import { LogoutButton } from "./logout-button";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";

export async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex gap-2">
        <Button asChild size="sm" variant="outline">
          <Link href="/auth/login">Sign in</Link>
        </Button>
        <Button asChild size="sm" variant="default">
          <Link href="/auth/sign-up">Sign up</Link>
        </Button>
      </div>
    );
  }

  const nickname =
    typeof user.user_metadata?.nickname === "string"
      ? (user.user_metadata.nickname as string).trim()
      : "";
  const display = nickname || user.email || "you";

  return (
    <div className="flex items-center gap-3">
      <span className="hidden sm:inline text-sm">Hey, {display}!</span>
      <LogoutButton />
    </div>
  );
}
