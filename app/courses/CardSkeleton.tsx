/** Loading placeholder for a course card, shown while progress loads. */
export function CardSkeleton() {
  return (
    <div className="card flex flex-col p-5">
      <div className="h-5 w-28 animate-pulse rounded-full bg-ash/70" />
      <div className="mt-4 h-5 w-3/4 animate-pulse rounded bg-ash/70" />
      <div className="mt-2 h-4 w-full animate-pulse rounded bg-ash/60" />
      <div className="mt-4 h-3 w-32 animate-pulse rounded bg-ash/50" />
      <div className="mt-4 h-1.5 w-full animate-pulse rounded-full bg-ash/60" />
      <div className="mt-5 h-4 w-24 animate-pulse rounded bg-ash/50" />
    </div>
  );
}
