"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function EntriesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-start gap-3 rounded-md border border-red-500/30 bg-red-500/5 p-6">
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <p className="text-sm text-muted-foreground">
        {error.message || "Unexpected error while loading entries."}
      </p>
      <Button size="sm" variant="outline" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
