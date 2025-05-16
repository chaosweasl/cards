export default function Loading() {
  return (
    <div className="flex flex-col items-center p-6 max-w-4xl mx-auto">
      <div className="h-10 bg-gray-300 rounded w-48 mb-8 animate-pulse"></div>

      <div className="w-full bg-base-200 rounded-lg shadow-xl p-6 animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>

        <div className="space-y-4 mb-8">
          <div className="h-6 bg-gray-300 rounded w-full"></div>
          <div className="h-6 bg-gray-300 rounded w-3/4"></div>
          <div className="h-6 bg-gray-300 rounded w-1/2"></div>
        </div>

        <div className="flex space-x-4 mt-8">
          <div className="h-10 bg-gray-300 rounded w-32"></div>
          <div className="h-10 bg-gray-300 rounded w-32"></div>
        </div>
      </div>

      <div className="w-full bg-base-200 rounded-lg shadow-xl p-6 mt-8 animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>

        <div className="grid grid-cols-2 gap-4">
          <div className="h-28 bg-gray-300 rounded"></div>
          <div className="h-28 bg-gray-300 rounded"></div>
          <div className="h-28 bg-gray-300 rounded"></div>
          <div className="h-28 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
}
