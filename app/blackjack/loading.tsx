export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">Blackjack</h1>

      <div className="card bg-base-200 shadow-xl w-full max-w-lg animate-pulse">
        <div className="card-body">
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>

          <div className="flex justify-center my-4">
            <div className="h-12 bg-gray-300 rounded w-32"></div>
          </div>

          <div className="h-2 bg-gray-300 rounded w-full my-6"></div>

          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <div className="h-10 bg-gray-300 rounded w-28"></div>
            <div className="h-10 bg-gray-300 rounded w-28"></div>
            <div className="h-10 bg-gray-300 rounded w-28"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
