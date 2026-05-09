import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DeleteEntryButton } from "@/components/delete-entry-button";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "DailyLog — Entries",
};

export default async function EntriesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: entries, error } = await supabase
    .from("entries")
    .select("id, title, body, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your entries</h1>
        <Button asChild>
          <Link href="/entries/new">New entry</Link>
        </Button>
      </header>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-dashed p-10 text-center">
          <p className="text-muted-foreground">No entries yet.</p>
          <Button asChild variant="default">
            <Link href="/entries/new">Write your first entry</Link>
          </Button>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="flex flex-col gap-2 rounded-md border p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col">
                  <h2 className="font-semibold leading-tight">{entry.title}</h2>
                  <time
                    className="text-xs text-muted-foreground"
                    dateTime={entry.created_at}
                  >
                    {new Date(entry.created_at).toLocaleString()}
                  </time>
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/entries/${entry.id}/edit`}>Edit</Link>
                  </Button>
                  <DeleteEntryButton id={entry.id} />
                </div>
              </div>
              {entry.body && (
                <p className="whitespace-pre-wrap text-sm text-foreground/80">
                  {entry.body}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
