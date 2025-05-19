"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_providers/AuthProvider";

interface GameCardProps {
  title: string;
  description: string;
}

const getGameRoute = (title: string) => `/${title.toLowerCase()}`;

export default function GameCard({ title, description }: GameCardProps) {
  const router = useRouter();
  const { user, loading } = useAuth();

  const handlePlayGame = () => {
    if (user) {
      router.push(getGameRoute(title));
    } else {
      document.getElementById("auth-modal")?.classList.add("modal-open");
    }
  };

  return (
    <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow">
      <div className="card-body items-center text-center">
        <h2 className="card-title">{title}</h2>
        <p>{description}</p>
        <button
          onClick={handlePlayGame}
          className="btn btn-primary mt-4"
          disabled={loading}
        >
          Play Now
        </button>
      </div>
    </div>
  );
}
