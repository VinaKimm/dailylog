import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "History — DailyLog",
};

function formatDateKey(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: entries, error } = await supabase
    .from("entries")
    .select("id, title, body, created_at")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  const groups = new Map<string, typeof entries>();
  for (const entry of entries) {
    const key = formatDateKey(entry.created_at);
    const bucket = groups.get(key);
    if (bucket) bucket.push(entry);
    else groups.set(key, [entry]);
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold">History</h1>
        <p className="text-sm text-muted-foreground">
          Your entries grouped by day, newest first.
        </p>
      </header>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-dashed p-10 text-center">
          <p className="text-muted-foreground">No history yet.</p>
          <Button asChild>
            <Link href="/entries/new">Write your first entry</Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {Array.from(groups.entries()).map(([day, dayEntries]) => (
            <section key={day} className="flex flex-col gap-2">
              <h2 className="text-sm font-semibold text-muted-foreground">
                {day}
              </h2>
              <ul className="flex flex-col gap-2">
                {dayEntries.map((entry) => (
                  <li
                    key={entry.id}
                    className="flex flex-col gap-1 rounded-md border p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium">{entry.title}</span>
                      <time
                        className="text-xs text-muted-foreground"
                        dateTime={entry.created_at}
                      >
                        {new Date(entry.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </time>
                    </div>
                    {entry.body && (
                      <p className="line-clamp-2 text-sm text-foreground/70">
                        {entry.body}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
