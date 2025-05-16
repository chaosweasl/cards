"use client";

import { useState, useCallback } from "react";
import {
  Card,
  createDeck,
  shuffle,
  calculateBlackjackScore,
} from "@/app/_lib/game-utils";
import { useAuth } from "@/app/_providers/AuthProvider";

interface GameState {
  playerCards: Card[];
  dealerCards: Card[];
  deck: Card[];
  gameStatus: "waiting" | "playing" | "playerWon" | "dealerWon" | "tie";
  playerScore: number;
  dealerScore: number;
}

export function useGameState() {
  const { user, stats, refreshStats } = useAuth();
  const [state, setState] = useState<GameState>({
    playerCards: [],
    dealerCards: [],
    deck: [],
    gameStatus: "waiting",
    playerScore: 0,
    dealerScore: 0,
  });

  const startGame = useCallback(() => {
    const newDeck = shuffle(createDeck());
    const playerCards = [newDeck[0], newDeck[2]];
    const dealerCards = [newDeck[1], newDeck[3]];

    setState({
      playerCards,
      dealerCards,
      deck: newDeck.slice(4),
      gameStatus: "playing",
      playerScore: calculateBlackjackScore(playerCards),
      dealerScore: calculateBlackjackScore(dealerCards),
    });
  }, []);

  const hit = useCallback(() => {
    if (state.gameStatus !== "playing") return;

    const newPlayerCards = [...state.playerCards, state.deck[0]];
    const newDeck = state.deck.slice(1);
    const newPlayerScore = calculateBlackjackScore(newPlayerCards);

    let newGameStatus: GameState["gameStatus"] = state.gameStatus;
    if (newPlayerScore > 21) {
      newGameStatus = "dealerWon";
      if (user && stats) {
        refreshStats();
      }
    }

    setState({
      ...state,
      playerCards: newPlayerCards,
      deck: newDeck,
      playerScore: newPlayerScore,
      gameStatus: newGameStatus,
    });
  }, [state, user, stats, refreshStats]);

  const stand = useCallback(() => {
    if (state.gameStatus !== "playing") return;

    let newDealerCards = [...state.dealerCards];
    let newDeck = [...state.deck];
    let newDealerScore = calculateBlackjackScore(newDealerCards);

    // Dealer draws until 17 or higher
    while (newDealerScore < 17) {
      newDealerCards.push(newDeck[0]);
      newDeck = newDeck.slice(1);
      newDealerScore = calculateBlackjackScore(newDealerCards);
    }

    let newGameStatus: GameState["gameStatus"] = "tie";
    if (newDealerScore > 21 || newDealerScore < state.playerScore) {
      newGameStatus = "playerWon";
    } else if (newDealerScore > state.playerScore) {
      newGameStatus = "dealerWon";
    }

    if (user && stats && newGameStatus !== "tie") {
      refreshStats();
    }

    setState({
      ...state,
      dealerCards: newDealerCards,
      deck: newDeck,
      dealerScore: newDealerScore,
      gameStatus: newGameStatus,
    });
  }, [state, user, stats, refreshStats]);

  const resetGame = useCallback(() => {
    setState({
      playerCards: [],
      dealerCards: [],
      deck: [],
      gameStatus: "waiting",
      playerScore: 0,
      dealerScore: 0,
    });
  }, []);

  return {
    ...state,
    startGame,
    hit,
    stand,
    resetGame,
  };
}
