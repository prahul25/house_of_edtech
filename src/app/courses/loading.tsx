export default function CoursesLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* Header Skeleton */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="h-5 w-40 rounded-full mx-auto skeleton-shimmer"></div>
        <div className="h-10 w-96 rounded-2xl mx-auto skeleton-shimmer"></div>
        <div className="h-4 w-80 rounded-lg mx-auto skeleton-shimmer"></div>
      </div>

      {/* Filter Bar Skeleton */}
      <div className="h-24 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 skeleton-shimmer"></div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-80 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex justify-between">
                <div className="h-5 w-24 rounded-full skeleton-shimmer"></div>
                <div className="h-5 w-20 rounded-full skeleton-shimmer"></div>
              </div>
              <div className="h-6 w-3/4 rounded-lg skeleton-shimmer"></div>
              <div className="h-12 w-full rounded-lg skeleton-shimmer"></div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800/80">
              <div className="h-4 w-1/2 rounded skeleton-shimmer"></div>
              <div className="h-10 w-full rounded-xl skeleton-shimmer"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
