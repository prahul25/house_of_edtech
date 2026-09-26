export default function GlobalLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-fade-in">
      <div className="space-y-3 max-w-xl">
        <div className="h-6 w-32 rounded-lg skeleton-shimmer"></div>
        <div className="h-10 w-3/4 rounded-xl skeleton-shimmer"></div>
        <div className="h-4 w-full rounded-lg skeleton-shimmer"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-64 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4"
          >
            <div className="h-4 w-24 rounded skeleton-shimmer"></div>
            <div className="h-6 w-3/4 rounded skeleton-shimmer"></div>
            <div className="h-20 w-full rounded-xl skeleton-shimmer"></div>
            <div className="h-10 w-full rounded-xl skeleton-shimmer"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
