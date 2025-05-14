import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Welcome to Card Games</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
        <Link
          href="/blackjack"
          className="p-8 border rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white flex flex-col items-center text-center"
        >
          <h2 className="text-2xl font-semibold mb-4">Blackjack</h2>
          <p className="text-gray-600 mb-4">
            Play a classic game of Blackjack against the dealer.
          </p>
          <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Play Now
          </button>
        </Link>

        {!user ? (
          <div className="p-8 border rounded-lg shadow-md bg-white flex flex-col items-center text-center">
            <h2 className="text-2xl font-semibold mb-4">
              Sign In to Play More
            </h2>
            <p className="text-gray-600 mb-4">
              Sign in with your GitHub account to access more games and save
              your progress.
            </p>
            <Link
              href="/sign-in"
              className="mt-4 px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition-colors"
            >
              Sign In
            </Link>
          </div>
        ) : (
          <div className="p-8 border rounded-lg shadow-md bg-white flex flex-col items-center text-center">
            <h2 className="text-2xl font-semibold mb-4">Welcome Back!</h2>
            <p className="text-gray-600 mb-4">
              Glad to see you again, {user.user_metadata?.name || user.email}!
            </p>
            <p className="text-gray-500">More games coming soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
