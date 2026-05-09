"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type EntryFormState = { error: string } | null;

function readEntryFields(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "");
  return { title, body };
}

function validate(title: string): string | null {
  if (title.length < 1) return "Title is required.";
  if (title.length > 120) return "Title must be 120 characters or less.";
  return null;
}

export async function createEntry(
  _prev: EntryFormState,
  formData: FormData,
): Promise<EntryFormState> {
  const { title, body } = readEntryFields(formData);
  const invalid = validate(title);
  if (invalid) return { error: invalid };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { error } = await supabase
    .from("entries")
    .insert({ user_id: user.id, title, body });

  if (error) return { error: error.message };

  revalidatePath("/entries");
  redirect("/entries");
}

export async function updateEntry(
  id: string,
  _prev: EntryFormState,
  formData: FormData,
): Promise<EntryFormState> {
  const { title, body } = readEntryFields(formData);
  const invalid = validate(title);
  if (invalid) return { error: invalid };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { error } = await supabase
    .from("entries")
    .update({ title, body })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/entries");
  revalidatePath(`/entries/${id}/edit`);
  redirect("/entries");
}

export async function deleteEntry(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("entries").delete().eq("id", id).eq("user_id", user.id);

  revalidatePath("/entries");
}
