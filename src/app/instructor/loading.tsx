export default function InstructorLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center pb-6 border-b border-slate-800">
        <div className="space-y-2">
          <div className="h-4 w-28 rounded skeleton-shimmer"></div>
          <div className="h-8 w-64 rounded-xl skeleton-shimmer"></div>
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-28 rounded-xl skeleton-shimmer"></div>
          <div className="h-10 w-36 rounded-xl skeleton-shimmer"></div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3"
          >
            <div className="h-4 w-24 rounded skeleton-shimmer"></div>
            <div className="h-8 w-16 rounded skeleton-shimmer"></div>
          </div>
        ))}
      </div>

      {/* Course rows */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 skeleton-shimmer"
          ></div>
        ))}
      </div>
    </div>
  );
}
