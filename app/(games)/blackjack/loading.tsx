export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">Blackjack</h1>

      <div className="card bg-base-200 shadow-xl w-full max-w-lg animate-pulse">
        <div className="card-body space-y-4">
          {/* Title skeleton */}
          <div className="h-8 bg-gray-300 rounded w-1/3" />

          {/* Center button skeleton */}
          <div className="flex justify-center">
            <div className="h-12 bg-gray-300 rounded w-32" />
          </div>

          {/* Divider skeleton */}
          <div className="h-2 bg-gray-300 rounded w-full" />

          {/* Action buttons skeleton */}
          <div className="flex flex-wrap justify-center gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-300 rounded w-28" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
