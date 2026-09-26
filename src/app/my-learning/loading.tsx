export default function MyLearningLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      <div className="space-y-2 pb-6 border-b border-slate-800">
        <div className="h-4 w-32 rounded skeleton-shimmer"></div>
        <div className="h-8 w-72 rounded-xl skeleton-shimmer"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-64 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="h-4 w-20 rounded skeleton-shimmer"></div>
              <div className="h-6 w-3/4 rounded skeleton-shimmer"></div>
              <div className="h-10 w-full rounded skeleton-shimmer"></div>
            </div>
            <div className="h-10 w-full rounded-xl skeleton-shimmer"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
