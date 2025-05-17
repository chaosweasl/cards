import BlackjackControls from "@/app/components/games/BlackjackControls";

export default function BlackjackPage() {
  return (
    <div className="hero min-h-screen bg-base-200 p-4">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-3xl font-bold mb-6">Blackjack</h1>
          <BlackjackControls />
        </div>
      </div>
    </div>
  );
}
