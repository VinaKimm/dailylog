"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { updateNickname, type ProfileState } from "@/app/profile/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save nickname"}
    </Button>
  );
}

export function NicknameForm({ initial }: { initial: string }) {
  const [state, formAction] = useActionState<ProfileState, FormData>(
    updateNickname,
    null,
  );

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <Label htmlFor="nickname">Nickname</Label>
      <Input
        id="nickname"
        name="nickname"
        maxLength={60}
        defaultValue={initial}
        placeholder="e.g. Vina"
      />
      {state && "error" in state && (
        <p className="text-sm text-red-500" role="alert">
          {state.error}
        </p>
      )}
      {state && "ok" in state && state.ok && (
        <p className="text-sm text-emerald-600" role="status">
          Saved{state.nickname ? ` as “${state.nickname}”` : " (cleared)"}.
        </p>
      )}
      <SubmitButton />
    </form>
  );
}
