export function SkeletonLine({ className = "" }: { className?: string }) {
  return <div className={`h-3 animate-pulseSoft rounded bg-slate-200 ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="rounded-card border border-line bg-card p-4">
      <SkeletonLine className="mb-2 w-1/2" />
      <SkeletonLine className="mb-2 w-full" />
      <SkeletonLine className="w-3/4" />
    </div>
  );
}
