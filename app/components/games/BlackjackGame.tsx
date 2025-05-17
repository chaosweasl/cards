"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/app/_providers/AuthProvider";
import { supabaseService } from "@/app/_lib/supabase-service";
import Image from "next/image";

interface Card {
  code: string;
  image: string;
  value: string;
  suit: string;
}

interface GameState {
  deckId: string | null;
  playerCards: Card[];
  dealerCards: Card[];
  playerScore: number;
  dealerScore: number;
  gameStatus:
    | "idle"
    | "dealing"
    | "player_turn"
    | "dealer_turn"
    | "player_bust"
    | "dealer_bust"
    | "player_win"
    | "dealer_win"
    | "push";
  loading: boolean;
  message: string;
  revealDealerCard: boolean;
}

const initialState: GameState = {
  deckId: null,
  playerCards: [],
  dealerCards: [],
  playerScore: 0,
  dealerScore: 0,
  gameStatus: "idle",
  loading: false,
  message: "Ready to play Blackjack?",
  revealDealerCard: false,
};

export default function BlackjackGame() {
  const { user, refreshStats, stats } = useAuth();
  const [gameState, setGameState] = useState<GameState>(initialState);
  const [dealingAnimation, setDealingAnimation] = useState(false);

  // Handle the dealer's turn after the player stands
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    // Execute dealer turn with pauses
    if (gameState.gameStatus === "dealer_turn") {
      timeoutId = setTimeout(() => {
        handleDealerTurn();
      }, 1000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [gameState.gameStatus]);

  // Deal cards with animation
  useEffect(() => {
    let dealingTimeout: NodeJS.Timeout;

    if (gameState.gameStatus === "dealing" && gameState.deckId) {
      setDealingAnimation(true);

      dealingTimeout = setTimeout(() => {
        setDealingAnimation(false);
        setGameState((prev) => ({
          ...prev,
          gameStatus: "player_turn",
          message: "Your turn. Hit or Stand?",
        }));
      }, 1500);
    }

    return () => {
      if (dealingTimeout) clearTimeout(dealingTimeout);
    };
  }, [gameState.gameStatus, gameState.deckId]);

  // Calculate the score of a hand
  const calculateScore = (cards: Card[]): number => {
    let score = 0;
    let aces = 0;

    cards.forEach((card) => {
      if (card.value === "ACE") {
        aces += 1;
        score += 11;
      } else if (["KING", "QUEEN", "JACK"].includes(card.value)) {
        score += 10;
      } else {
        score += parseInt(card.value);
      }
    });

    // Adjust for aces if needed
    while (score > 21 && aces > 0) {
      score -= 10;
      aces -= 1;
    }

    return score;
  };

  // Start a new game
  const startGame = async () => {
    setGameState({
      ...initialState,
      loading: true,
      message: "Shuffling cards...",
    });

    try {
      // Create a new shuffled deck
      const deckResponse = await fetch(
        "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
      );
      const deckData = await deckResponse.json();

      if (!deckData.success) {
        throw new Error("Failed to create a new deck");
      }

      // Draw 2 cards for player and 2 for dealer
      const drawResponse = await fetch(
        `https://deckofcardsapi.com/api/deck/${deckData.deck_id}/draw/?count=4`
      );
      const drawData = await drawResponse.json();

      if (!drawData.success) {
        throw new Error("Failed to draw cards");
      }

      const playerCards = [drawData.cards[0], drawData.cards[2]];
      const dealerCards = [drawData.cards[1], drawData.cards[3]];

      const playerScore = calculateScore(playerCards);
      const dealerScore = calculateScore(dealerCards);

      // Set game state to dealing (will trigger animation)
      setGameState({
        deckId: deckData.deck_id,
        playerCards,
        dealerCards,
        playerScore,
        dealerScore,
        gameStatus: "dealing",
        loading: false,
        message: "Dealing cards...",
        revealDealerCard: false,
      });

      // Check for natural blackjacks after dealing animation
      setTimeout(() => {
        if (playerScore === 21 && dealerScore === 21) {
          handleGameOutcome("push", "Both have Blackjack! Push.");
        } else if (playerScore === 21) {
          handleGameOutcome("player_win", "Blackjack! You win!");
        } else if (dealerScore === 21) {
          // Modified: We'll now show that dealer has a natural 21 but give the player a chance
          // to play their hand anyway - if they get 21 too, it'll be a push
          setGameState((prev) => ({
            ...prev,
            message: "Dealer has 21! Try to match it?",
            // We don't reveal dealer's second card yet to maintain suspense
          }));
        }
      }, 1800);
    } catch (error) {
      console.error("Error starting game:", error);
      setGameState({
        ...initialState,
        loading: false,
        message: "Error starting game. Please try again.",
      });
    }
  };

  // Hit - draw a card for the player
  const hit = async () => {
    if (gameState.gameStatus !== "player_turn" || !gameState.deckId) return;

    setGameState({
      ...gameState,
      loading: true,
      message: "Drawing a card...",
    });

    try {
      const response = await fetch(
        `https://deckofcardsapi.com/api/deck/${gameState.deckId}/draw/?count=1`
      );
      const data = await response.json();

      if (!data.success) {
        throw new Error("Failed to draw a card");
      }

      // Add a short delay for animation effect
      setTimeout(() => {
        const newPlayerCards = [...gameState.playerCards, data.cards[0]];
        const newPlayerScore = calculateScore(newPlayerCards);

        // Check if player busts or gets 21
        if (newPlayerScore > 21) {
          // Player busts - show total but allow dealer to play
          setGameState((prev) => ({
            ...prev,
            playerCards: newPlayerCards,
            playerScore: newPlayerScore,
            loading: false,
            message: `You bust with ${newPlayerScore}! Let's see what the dealer gets...`,
            gameStatus: "dealer_turn",
            revealDealerCard: true,
          }));
        } else if (newPlayerScore === 21) {
          // Player has 21 - automatically stand
          setGameState((prev) => ({
            ...prev,
            playerCards: newPlayerCards,
            playerScore: newPlayerScore,
            loading: false,
            message: "You have 21! Dealer's turn...",
          }));

          // Short delay before moving to dealer's turn
          setTimeout(() => {
            // Move to dealer's turn
            setGameState((prev) => ({
              ...prev,
              gameStatus: "dealer_turn",
              revealDealerCard: true,
              message: "Dealer's turn...",
            }));
          }, 1500);
        } else {
          // Normal case - continue player turn
          setGameState((prev) => ({
            ...prev,
            playerCards: newPlayerCards,
            playerScore: newPlayerScore,
            gameStatus: "player_turn",
            loading: false,
            message: "Your turn. Hit or Stand?",
          }));
        }
      }, 500);
    } catch (error) {
      console.error("Error hitting:", error);
      setGameState({
        ...gameState,
        loading: false,
        message: "Error drawing card. Please try again.",
      });
    }
  };

  // Stand - dealer's turn
  const stand = () => {
    if (gameState.gameStatus !== "player_turn" || !gameState.deckId) return;

    // First reveal dealer's hidden card
    setGameState({
      ...gameState,
      gameStatus: "dealer_turn",
      revealDealerCard: true,
      message: "Dealer's turn...",
    });
  };

  // Handle dealer's turn (called after reveal animation)
  const handleDealerTurn = async () => {
    if (!gameState.deckId) return;

    try {
      let currentDealerCards = [...gameState.dealerCards];
      let currentDealerScore = gameState.dealerScore;

      // Check if dealer needs to draw
      if (currentDealerScore < 17) {
        setGameState((prev) => ({
          ...prev,
          loading: true,
          message: "Dealer drawing...",
        }));

        // Dealer draws cards one by one with delay
        const drawCard = async () => {
          const response = await fetch(
            `https://deckofcardsapi.com/api/deck/${gameState.deckId}/draw/?count=1`
          );
          const data = await response.json();

          if (!data.success) {
            throw new Error("Failed to draw a card for dealer");
          }

          currentDealerCards = [...currentDealerCards, data.cards[0]];
          currentDealerScore = calculateScore(currentDealerCards);

          // Update state to show the new card
          setGameState((prev) => ({
            ...prev,
            dealerCards: currentDealerCards,
            dealerScore: currentDealerScore,
            message: `Dealer draws: ${
              data.cards[0].value
            } of ${data.cards[0].suit.toLowerCase()}`,
          }));

          // Check if dealer should draw again, with a delay
          setTimeout(() => {
            // Check if dealer busts
            if (currentDealerScore > 21) {
              // Dealer busts - automatically end the game
              handleGameOutcome("dealer_bust", "Dealer busts! You win!");
            } else if (currentDealerScore < 17) {
              drawCard(); // Draw another card
            } else {
              // Dealer is done drawing
              setTimeout(() => {
                // Update message to indicate dealer stands
                setGameState((prev) => ({
                  ...prev,
                  message: `Dealer stands with ${currentDealerScore}`,
                }));

                // Short delay before determining winner
                setTimeout(() => {
                  determineWinner(currentDealerScore);
                }, 1000);
              }, 500);
            }
          }, 1000);
        };

        // Start the drawing process
        drawCard();
      } else {
        // Dealer already has 17 or more - stands immediately
        setGameState((prev) => ({
          ...prev,
          message: `Dealer stands with ${currentDealerScore}`,
          loading: false,
        }));

        // Determine winner after a short delay
        setTimeout(() => {
          determineWinner(currentDealerScore);
        }, 1500);
      }
    } catch (error) {
      console.error("Error in dealer's turn:", error);
      setGameState({
        ...gameState,
        loading: false,
        message: "Error during dealer's turn. Please try again.",
      });
    }
  };

  // Determine the winner after dealer's turn
  const determineWinner = (dealerScore: number) => {
    const playerScore = gameState.playerScore;
    console.log("Determining winner:", { dealerScore, playerScore });

    // Case 1: Both bust (both over 21)
    if (playerScore > 21 && dealerScore > 21) {
      // Debug the bust comparison
      console.log("Both bust comparison:", {
        playerScore,
        dealerScore,
        playerLower: playerScore < dealerScore,
      });

      if (playerScore < dealerScore) {
        // Player has lower bust score - player wins
        handleGameOutcome(
          "player_win",
          `Both bust! You win with the lower bust (${playerScore} vs dealer's ${dealerScore}).`
        );
      } else if (dealerScore < playerScore) {
        // Dealer has lower bust score - dealer wins
        handleGameOutcome(
          "dealer_win",
          `Both bust! Dealer wins with the lower bust (${dealerScore} vs your ${playerScore}).`
        );
      } else {
        // Exactly same bust score - tie
        handleGameOutcome(
          "push",
          `Unusual tie! Both bust with exactly ${playerScore}.`
        );
      }
      return;
    }

    // Case 2: Only dealer busts
    if (dealerScore > 21) {
      handleGameOutcome(
        "dealer_bust",
        `Dealer busts with ${dealerScore}! You win with ${playerScore}!`
      );
      return;
    }

    // Case 3: Only player busts
    if (playerScore > 21) {
      handleGameOutcome(
        "player_bust",
        `You bust with ${playerScore}. Dealer wins with ${dealerScore}.`
      );
      return;
    }

    // Case 4: No one busts - normal comparison
    if (dealerScore > playerScore) {
      handleGameOutcome(
        "dealer_win",
        `Dealer wins with ${dealerScore} to your ${playerScore}.`
      );
    } else if (dealerScore < playerScore) {
      handleGameOutcome(
        "player_win",
        `You win with ${playerScore} to dealer's ${dealerScore}!`
      );
    } else {
      // Tied scores (not busting)
      handleGameOutcome("push", `Push! Both have ${playerScore}.`);
    }
  };

  // Handle game outcome and record stats
  const handleGameOutcome = async (
    outcome: GameState["gameStatus"],
    message: string
  ) => {
    console.log("Game outcome:", { outcome, message });

    try {
      // Always reveal dealer's card at game end and update state immediately
      // to show the outcome on screen without waiting for database updates
      setGameState((prev) => ({
        ...prev,
        gameStatus: outcome,
        loading: false,
        message,
        revealDealerCard: true,
      }));

      // If user is not logged in, we're done
      if (!user) return;

      // Record win/loss in database
      try {
        console.log("Recording outcome for user:", user.id);
        if (outcome === "player_win" || outcome === "dealer_bust") {
          const result = await supabaseService.recordWin(user.id);
          console.log("Win recorded:", result);

          // Make sure to refresh stats immediately
          await refreshStats();
          console.log("Stats refreshed, current wins:", stats?.wins);
        } else if (outcome === "dealer_win" || outcome === "player_bust") {
          const result = await supabaseService.recordLoss(user.id);
          console.log("Loss recorded:", result);

          // Make sure to refresh stats immediately
          await refreshStats();
          console.log("Stats refreshed, current losses:", stats?.losses);
        }
      } catch (error) {
        console.error("Error recording game outcome in database:", error);
      }
    } catch (error) {
      console.error("Error updating game outcome state:", error);
      // Last-ditch attempt to make sure game shows something
      setGameState((prev) => ({
        ...prev,
        gameStatus: "idle",
        message: "Game ended unexpectedly. Try again?",
      }));
    }
  };

  // Render a card
  const renderCard = (card: Card, index: number, isHidden: boolean = false) => {
    if (isHidden) {
      return (
        <div
          key={index}
          className="relative w-24 h-36 rounded-lg shadow-md overflow-hidden transform transition-all duration-300"
        >
          <Image
            src="https://deckofcardsapi.com/static/img/back.png"
            alt="Card back"
            className="object-cover"
            fill
            sizes="(max-width: 768px) 100vw, 96px"
          />
        </div>
      );
    }

    return (
      <div
        key={index}
        className={`relative w-24 h-36 rounded-lg shadow-md overflow-hidden transform transition-all duration-300 ${
          dealingAnimation ? "animate-deal" : ""
        }`}
        style={{
          animationDelay: `${index * 200}ms`,
        }}
      >
        <Image
          src={card.image}
          alt={`${card.value} of ${card.suit}`}
          className="object-cover"
          fill
          sizes="(max-width: 768px) 100vw, 96px"
        />
      </div>
    );
  };

  return (
    <div className="bg-green-800 text-white p-6 rounded-lg shadow-xl max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Blackjack</h1>

      <div className="mb-6 p-4 bg-green-900 rounded-lg">
        <p className="text-center text-lg">{gameState.message}</p>
      </div>

      {gameState.gameStatus === "idle" ? (
        <div className="flex justify-center mb-8">
          <button
            onClick={startGame}
            disabled={gameState.loading}
            className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-bold text-lg shadow-md disabled:opacity-50"
          >
            {gameState.loading ? "Loading..." : "Start Game"}
          </button>
        </div>
      ) : (
        <>
          {/* Dealer's cards */}
          <div className="mb-8">
            <h2 className="text-xl mb-2">
              Dealer:{" "}
              {!gameState.revealDealerCard ? "?" : gameState.dealerScore}
            </h2>
            <div className="flex flex-wrap gap-2">
              {gameState.dealerCards.map((card, index) =>
                renderCard(
                  card,
                  index,
                  index === 1 && !gameState.revealDealerCard
                )
              )}
            </div>
          </div>

          {/* Player's cards */}
          <div className="mb-8">
            <h2 className="text-xl mb-2">You: {gameState.playerScore}</h2>
            <div className="flex flex-wrap gap-2">
              {gameState.playerCards.map((card, index) =>
                renderCard(card, index)
              )}
            </div>
          </div>

          {/* Game controls */}
          {gameState.gameStatus === "player_turn" ? (
            <div className="flex justify-center gap-4">
              <button
                onClick={hit}
                disabled={gameState.loading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-md disabled:opacity-50"
              >
                Hit
              </button>
              <button
                onClick={stand}
                disabled={gameState.loading}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shadow-md disabled:opacity-50"
              >
                Stand
              </button>
            </div>
          ) : [
              "player_bust",
              "dealer_bust",
              "player_win",
              "dealer_win",
              "push",
            ].includes(gameState.gameStatus) ? (
            <div className="flex justify-center">
              <button
                onClick={startGame}
                className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-bold shadow-md"
              >
                Play Again
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                disabled
                className="px-6 py-3 bg-gray-600 text-white rounded-lg font-bold shadow-md opacity-50 cursor-not-allowed"
              >
                {gameState.loading ? "Loading..." : "Dealer playing..."}
              </button>
            </div>
          )}
        </>
      )}

      <style jsx global>{`
        @keyframes deal {
          0% {
            opacity: 0;
            transform: translateY(-50px) rotate(-10deg);
          }
          100% {
            opacity: 1;
            transform: translateY(0) rotate(0);
          }
        }

        .animate-deal {
          animation: deal 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
