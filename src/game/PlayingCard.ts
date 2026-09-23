export interface PlayingCard {
  id: string;
  name: string;
  power: number;
  cost: number;
  ability?: string;
  color: string;
}

const NAMES = [
  'Iron Hero', 'Thunder God', 'Spider Knight', 'Captain Star',
  'Black Shadow', 'Scarlet Mage', 'Hulk Warrior', 'Ant Soldier',
  'Doctor Mystic', 'Star Guardian', 'Winter Fighter', 'Hawk Eye',
];

const COLORS = [
  '#FF0000', '#0066FF', '#FFFF00', '#FF00FF',
  '#00FF00', '#FF6600', '#FF0099', '#9900FF',
];

let _idCounter = 0;

export function randomCard(): PlayingCard {
  const name = NAMES[Math.floor(Math.random() * NAMES.length)];
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  const power = 1 + Math.floor(Math.random() * 10);
  const cost = 1 + Math.floor(Math.random() * 6);
  const ability = Math.random() > 0.5 ? 'On Reveal: +2 power' : undefined;

  return { id: `card_${_idCounter++}`, name, power, cost, color, ability };
}

export function generateHand(count = 7): PlayingCard[] {
  return Array.from({ length: count }, () => randomCard());
}
