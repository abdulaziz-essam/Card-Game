import { create } from 'zustand';
import { PlayingCard, generateHand } from './PlayingCard';
import { decideCard, decideTarget } from './AIOpponent';

export interface LocationState {
  name: string;
  description: string;
  maxCards: number;        // how many players fit this zone
  playerCards: PlayingCard[];
  aiCards: PlayingCard[];
}

// True 11v11: GK=1, DEF=4, MID=3, ATK=3 → 11 per side across 4 zones
const HAND_SIZE = 11;

function locationPower(cards: PlayingCard[]) {
  return cards.reduce((sum, c) => sum + c.power, 0);
}

function getWinner(loc: LocationState): 'player' | 'ai' | 'tie' {
  const pp = locationPower(loc.playerCards);
  const ap = locationPower(loc.aiCards);
  if (pp > ap) return 'player';
  if (ap > pp) return 'ai';
  return 'tie';
}

interface GameState {
  playerHand: PlayingCard[];
  aiHand: PlayingCard[];
  locations: LocationState[];
  isPlayerTurn: boolean;
  gameOver: boolean;
  playerWon: boolean;

  playPlayerCard: (card: PlayingCard, locationIndex: number) => void;
  resetGame: () => void;
  _aiMove: () => void;
}

function makeInitialState() {
  return {
    playerHand: generateHand(HAND_SIZE),
    aiHand: generateHand(HAND_SIZE),
    locations: [
      { name: 'Goalkeeper', description: 'Last line of defence',      maxCards: 1, playerCards: [], aiCards: [] },
      { name: 'Defence',    description: 'Hold the defensive line',   maxCards: 4, playerCards: [], aiCards: [] },
      { name: 'Midfield',   description: 'Control the centre',        maxCards: 3, playerCards: [], aiCards: [] },
      { name: 'Attack',     description: 'Press the opponent\'s goal', maxCards: 3, playerCards: [], aiCards: [] },
    ],
    isPlayerTurn: true,
    gameOver: false,
    playerWon: false,
  };
}

export const useGameStore = create<GameState>((set, get) => ({
  ...makeInitialState(),

  playPlayerCard: (card, locationIndex) => {
    const state = get();
    if (!state.isPlayerTurn || state.gameOver) return;

    const loc = state.locations[locationIndex];
    if (loc.playerCards.length >= loc.maxCards) return;

    const newLocations = state.locations.map((l, i) =>
      i === locationIndex
        ? { ...l, playerCards: [...l.playerCards, card] }
        : l
    );
    const newPlayerHand = state.playerHand.filter(c => c.id !== card.id);

    set({ locations: newLocations, playerHand: newPlayerHand, isPlayerTurn: false });

    if (_isGameOver(newPlayerHand, get().aiHand)) {
      _resolveGame(newLocations, set);
      return;
    }

    setTimeout(() => get()._aiMove(), 1800);
  },

  _aiMove: () => {
    const state = get();
    if (state.isPlayerTurn || state.gameOver) return;

    const aiCardsPerLoc = state.locations.map(l => l.aiCards.length);
    const aiMaxPerLoc   = state.locations.map(l => l.maxCards);
    const card = decideCard(state.aiHand, 'medium');

    let newLocations = state.locations;
    let newAiHand = state.aiHand;

    if (card) {
      const targetIdx = decideTarget(aiCardsPerLoc, 'medium', aiMaxPerLoc);
      const loc = state.locations[targetIdx];

      if (loc.aiCards.length < loc.maxCards) {
        newLocations = state.locations.map((l, i) =>
          i === targetIdx
            ? { ...l, aiCards: [...l.aiCards, card] }
            : l
        );
        newAiHand = state.aiHand.filter(c => c.id !== card.id);
      }
    }

    set({ locations: newLocations, aiHand: newAiHand, isPlayerTurn: true });

    if (_isGameOver(state.playerHand, newAiHand)) {
      _resolveGame(newLocations, set);
    }
  },

  resetGame: () => set(makeInitialState()),
}));

function _isGameOver(playerHand: PlayingCard[], aiHand: PlayingCard[]) {
  return playerHand.length === 0 || aiHand.length === 0;
}

function _resolveGame(
  locations: LocationState[],
  set: (partial: Partial<GameState>) => void
) {
  let playerWins = 0;
  let aiWins = 0;
  for (const loc of locations) {
    const w = getWinner(loc);
    if (w === 'player') playerWins++;
    if (w === 'ai') aiWins++;
  }
  set({ gameOver: true, playerWon: playerWins > aiWins });
}
