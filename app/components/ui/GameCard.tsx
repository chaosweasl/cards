"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_providers/AuthProvider";

interface GameCardProps {
  title: string;
  description: string;
}

export default function GameCard({ title, description }: GameCardProps) {
  const router = useRouter();
  const { user, loading } = useAuth();

  const handlePlayGame = () => {
    if (user) {
      // Route to the game page based on title
      router.push(`/${title.toLowerCase()}`);
    } else {
      // Show auth modal if not signed in
      document.getElementById("auth-modal")?.classList.add("modal-open");
    }
  };

  return (
    <div className="p-8 border rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white flex flex-col items-center text-center">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <p className="text-gray-600 mb-4">{description}</p>
      <button
        onClick={handlePlayGame}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        disabled={loading}
      >
        Play Now
      </button>
    </div>
  );
}
