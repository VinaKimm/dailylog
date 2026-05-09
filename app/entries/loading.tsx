export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="h-7 w-40 animate-pulse rounded bg-foreground/10" />
        <div className="h-9 w-28 animate-pulse rounded bg-foreground/10" />
      </div>
      <ul className="flex flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <li
            key={i}
            className="flex flex-col gap-2 rounded-md border p-4"
            aria-hidden
          >
            <div className="h-4 w-1/2 animate-pulse rounded bg-foreground/10" />
            <div className="h-3 w-1/4 animate-pulse rounded bg-foreground/10" />
            <div className="h-3 w-full animate-pulse rounded bg-foreground/10" />
          </li>
        ))}
      </ul>
    </div>
  );
}
