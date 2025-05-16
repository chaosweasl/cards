export default function AuthSkeleton() {
  return (
    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md animate-pulse">
      <div className="h-8 bg-gray-200 rounded-md w-1/2 mx-auto mb-6"></div>
      <div className="h-12 bg-gray-300 rounded-md mb-4"></div>
      <div className="h-6 bg-gray-200 rounded-md w-2/3 mx-auto"></div>
    </div>
  );
}
