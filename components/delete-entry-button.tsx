"use client";

import { useFormStatus } from "react-dom";

import { deleteEntry } from "@/app/entries/actions";
import { Button } from "@/components/ui/button";

function ConfirmingSubmit() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size="sm"
      variant="destructive"
      disabled={pending}
      onClick={(e) => {
        if (!confirm("Delete this entry? This cannot be undone.")) {
          e.preventDefault();
        }
      }}
    >
      {pending ? "Deleting..." : "Delete"}
    </Button>
  );
}

export function DeleteEntryButton({ id }: { id: string }) {
  return (
    <form action={deleteEntry}>
      <input type="hidden" name="id" value={id} />
      <ConfirmingSubmit />
    </form>
  );
}
