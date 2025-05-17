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
    <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow">
      <div className="card-body items-center text-center">
        <h2 className="card-title">{title}</h2>
        <p>{description}</p>
        <div className="card-actions justify-end mt-4">
          <button
            onClick={handlePlayGame}
            className="btn btn-primary"
            disabled={loading}
          >
            Play Now
          </button>
        </div>
      </div>
    </div>
  );
}
