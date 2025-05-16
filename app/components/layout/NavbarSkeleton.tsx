export default function NavbarSkeleton() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-xl">Card Games</div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-4">
            <div className="h-6 bg-gray-600 rounded w-24 animate-pulse"></div>
            <div className="flex items-center space-x-2 bg-gray-700 rounded px-3 py-1 animate-pulse">
              <div className="h-4 bg-gray-600 rounded w-12"></div>
              <span className="text-white">|</span>
              <div className="h-4 bg-gray-600 rounded w-12"></div>
            </div>
            <div className="h-8 bg-gray-600 rounded w-20 animate-pulse"></div>
          </div>
        </div>
      </div>
    </nav>
  );
}
