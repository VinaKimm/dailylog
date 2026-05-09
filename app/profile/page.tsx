import { redirect } from "next/navigation";

import { signOut } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Profile — DailyLog",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { count } = await supabase
    .from("entries")
    .select("id", { count: "exact", head: true });

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Account details and stats.
        </p>
      </header>

      <section className="flex flex-col gap-4 rounded-md border p-5">
        <Field label="Email" value={user.email ?? "—"} />
        <Field
          label="Account created"
          value={new Date(user.created_at).toLocaleString()}
        />
        <Field
          label="Last sign-in"
          value={
            user.last_sign_in_at
              ? new Date(user.last_sign_in_at).toLocaleString()
              : "—"
          }
        />
        <Field label="Total entries" value={String(count ?? 0)} />
      </section>

      <form action={signOut}>
        <Button type="submit" variant="outline">
          Sign out
        </Button>
      </form>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
