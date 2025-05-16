import GameCard from "./components/GameCard";
import UserWelcomeCard from "./components/UserWelcomeCard";
import AuthModal from "./components/AuthModal";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Welcome to Card Games</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
        <GameCard
          title="Blackjack"
          description="Play a classic game of Blackjack against the dealer."
        />
        <UserWelcomeCard />
      </div>

      <AuthModal />
    </div>
  );
}
