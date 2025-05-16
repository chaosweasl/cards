/**
 * Game utility functions
 */

export interface Card {
  suit: "hearts" | "diamonds" | "clubs" | "spades";
  value: number;
  name: string;
}

/**
 * Creates a standard deck of 52 playing cards
 */
export function createDeck(): Card[] {
  const suits = ["hearts", "diamonds", "clubs", "spades"] as const;
  const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  const valueNames = {
    1: "Ace",
    11: "Jack",
    12: "Queen",
    13: "King",
  };

  const deck: Card[] = [];

  for (const suit of suits) {
    for (const value of values) {
      deck.push({
        suit,
        value,
        name: valueNames[value as keyof typeof valueNames] || value.toString(),
      });
    }
  }

  return deck;
}

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Calculate score for Blackjack
 */
export function calculateBlackjackScore(cards: Card[]): number {
  let score = 0;
  let aces = 0;

  for (const card of cards) {
    if (card.value === 1) {
      // Ace
      aces += 1;
      score += 11;
    } else if (card.value >= 10) {
      // Face cards
      score += 10;
    } else {
      score += card.value;
    }
  }

  // Adjust aces if needed
  while (score > 21 && aces > 0) {
    score -= 10;
    aces -= 1;
  }

  return score;
}
