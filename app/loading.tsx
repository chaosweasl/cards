export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-48 mb-8"></div>

        <div className="w-full max-w-lg bg-base-200 rounded-lg shadow-xl p-6">
          <div className="h-6 bg-gray-300 rounded w-1/3 mb-6"></div>

          <div className="space-y-4 mb-8">
            <div className="h-6 bg-gray-300 rounded w-full"></div>
            <div className="h-6 bg-gray-300 rounded w-3/4"></div>
            <div className="h-6 bg-gray-300 rounded w-1/2"></div>
          </div>

          <div className="flex justify-center space-x-4 mt-8">
            <div className="h-10 bg-gray-300 rounded w-32"></div>
            <div className="h-10 bg-gray-300 rounded w-32"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
