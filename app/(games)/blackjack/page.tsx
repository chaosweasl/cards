import BlackjackControls from "@/app/components/games/BlackjackControls";

export default function BlackjackPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">Blackjack</h1>
      <BlackjackControls />
    </div>
  );
}
