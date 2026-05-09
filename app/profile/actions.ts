"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export type ProfileState =
  | { error: string }
  | { ok: true; nickname: string }
  | null;

export async function updateNickname(
  _prev: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const nickname = String(formData.get("nickname") ?? "").trim();
  if (nickname.length > 60) {
    return { error: "Nickname must be 60 characters or less." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { error } = await supabase.auth.updateUser({
    data: { nickname: nickname || null },
  });

  if (error) return { error: error.message };

  revalidatePath("/profile");
  revalidatePath("/entries");
  revalidatePath("/history");
  return { ok: true, nickname };
}
