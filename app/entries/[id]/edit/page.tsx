import { notFound, redirect } from "next/navigation";

import { updateEntry, type EntryFormState } from "@/app/entries/actions";
import { EntryForm } from "@/components/entry-form";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Edit entry — DailyLog",
};

export default async function EditEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: entry, error } = await supabase
    .from("entries")
    .select("id, title, body")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!entry) notFound();

  const updateBound = async (
    prev: EntryFormState,
    formData: FormData,
  ): Promise<EntryFormState> => {
    "use server";
    return updateEntry(id, prev, formData);
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Edit entry</h1>
      <EntryForm
        action={updateBound}
        initial={{ title: entry.title, body: entry.body }}
        submitLabel="Save changes"
        pendingLabel="Saving..."
      />
    </div>
  );
}
