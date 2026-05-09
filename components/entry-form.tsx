"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";

import type { EntryFormState } from "@/app/entries/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  action: (
    prev: EntryFormState,
    formData: FormData,
  ) => Promise<EntryFormState>;
  initial?: { title: string; body: string };
  submitLabel: string;
  pendingLabel: string;
};

function SubmitButton({ idle, pending }: { idle: string; pending: string }) {
  const { pending: isPending } = useFormStatus();
  return (
    <Button type="submit" disabled={isPending}>
      {isPending ? pending : idle}
    </Button>
  );
}

export function EntryForm({
  action,
  initial,
  submitLabel,
  pendingLabel,
}: Props) {
  const [state, formAction] = useActionState<EntryFormState, FormData>(
    action,
    null,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          maxLength={120}
          defaultValue={initial?.title ?? ""}
          required
          autoFocus
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="body">Body</Label>
        <textarea
          id="body"
          name="body"
          rows={10}
          defaultValue={initial?.body ?? ""}
          className="flex min-h-32 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
        />
      </div>
      {state?.error && (
        <p className="text-sm text-red-500" role="alert">
          {state.error}
        </p>
      )}
      <div className="flex items-center justify-end gap-2">
        <Button asChild variant="outline" type="button">
          <Link href="/entries">Cancel</Link>
        </Button>
        <SubmitButton idle={submitLabel} pending={pendingLabel} />
      </div>
    </form>
  );
}
