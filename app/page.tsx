import GameCard from "@/app/components/ui/GameCard";
import UserWelcomeCard from "@/app/components/ui/UserWelcomeCard";
import AuthModal from "@/app/components/auth/AuthModal";

export default function HomePage() {
  return (
    <div className="hero min-h-screen bg-base-200 -mt-16">
      <div className="hero-content text-center flex-col">
        <h1 className="text-4xl font-bold my-8">Welcome to Card Games</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
          <GameCard
            title="Blackjack"
            description="Play a classic game of Blackjack against the dealer."
          />
          <UserWelcomeCard />
        </div>

        <AuthModal />
      </div>
    </div>
  );
}
