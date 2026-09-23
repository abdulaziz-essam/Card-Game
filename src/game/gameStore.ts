import { create } from 'zustand';
import { PlayingCard, generateHand } from './PlayingCard';
import { decideCard, decideTarget } from './AIOpponent';

export interface LocationState {
  name: string;
  description: string;
  playerCards: PlayingCard[];
  aiCards: PlayingCard[];
}

const MAX_CARDS_PER_SIDE = 4;

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
    playerHand: generateHand(7),
    aiHand: generateHand(7),
    locations: [
      { name: 'Tower Alpha', description: 'The first battleground', playerCards: [], aiCards: [] },
      { name: 'Tower Beta', description: 'The second battleground', playerCards: [], aiCards: [] },
      { name: 'Tower Gamma', description: 'The third battleground', playerCards: [], aiCards: [] },
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
    if (loc.playerCards.length >= MAX_CARDS_PER_SIDE) return;

    const newLocations = state.locations.map((l, i) =>
      i === locationIndex
        ? { ...l, playerCards: [...l.playerCards, card] }
        : l
    );
    const newPlayerHand = state.playerHand.filter(c => c.id !== card.id);

    set({ locations: newLocations, playerHand: newPlayerHand, isPlayerTurn: false });

    // Check game end before AI move
    const nextState = get();
    if (_isGameOver(newPlayerHand, nextState.aiHand)) {
      _resolveGame(newLocations, set);
      return;
    }

    // AI moves after 2s
    setTimeout(() => get()._aiMove(), 2000);
  },

  _aiMove: () => {
    const state = get();
    if (state.isPlayerTurn || state.gameOver) return;

    const aiCardsPerLoc = state.locations.map(l => l.aiCards.length);
    const card = decideCard(state.aiHand, 'medium');

    let newLocations = state.locations;
    let newAiHand = state.aiHand;

    if (card) {
      const targetIdx = decideTarget(aiCardsPerLoc, 'medium');
      const loc = state.locations[targetIdx];

      if (loc.aiCards.length < MAX_CARDS_PER_SIDE) {
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
