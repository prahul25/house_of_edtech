export default function LearnLoading() {
  return (
    <div className="flex flex-col lg:flex-row min-h-[85vh] bg-slate-950 animate-fade-in">
      {/* Sidebar skeleton */}
      <div className="w-full lg:w-80 bg-slate-900/80 border-r border-slate-800 p-5 space-y-6 flex-shrink-0">
        <div className="space-y-2 pb-4 border-b border-slate-800">
          <div className="h-4 w-28 rounded skeleton-shimmer"></div>
          <div className="h-6 w-3/4 rounded-lg skeleton-shimmer"></div>
          <div className="h-2 w-full rounded-full skeleton-shimmer mt-3"></div>
        </div>

        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-9 w-full rounded-xl skeleton-shimmer"></div>
          ))}
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="flex-1 p-6 sm:p-10 max-w-4xl space-y-6">
        <div className="space-y-2 pb-6 border-b border-slate-800">
          <div className="h-4 w-32 rounded skeleton-shimmer"></div>
          <div className="h-10 w-2/3 rounded-xl skeleton-shimmer"></div>
        </div>

        <div className="h-80 w-full rounded-2xl border border-slate-800 bg-slate-900/60 p-6 skeleton-shimmer"></div>
      </div>
    </div>
  );
}
