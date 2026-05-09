import { redirect } from "next/navigation";

import { createEntry } from "@/app/entries/actions";
import { EntryForm } from "@/components/entry-form";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "New entry — DailyLog",
};

export default async function NewEntryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">New entry</h1>
      <EntryForm
        action={createEntry}
        submitLabel="Save entry"
        pendingLabel="Saving..."
      />
    </div>
  );
}
