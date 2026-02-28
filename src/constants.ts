import { TileType, PlayerId, Weapon } from './types';

export const GRID_WIDTH = 10;
export const GRID_HEIGHT = 5;

export const INITIAL_STATS = {
  power: 5,
  gold: 20,
  upgradeCoins: 2,
};

export const INITIAL_BUILD_COSTS = {
  GOLD_MINE: 10,
  BLACKSMITH: 20,
};

export const TOWER_HEALTH_BY_LEVEL: Record<number, number> = {
  1: 100,
  2: 1000,
  3: 2000,
  4: 3500,
};

export const UPGRADE_COIN_COSTS: Record<number, number> = {
  2: 1,
  3: 2,
  4: 4,
};

export const REWARDS = {
  MINE_GOLD: (level: number) => 5 * Math.pow(2, level - 1),
};

export const WEAPONS: Weapon[] = [
  { id: 'w1', name: 'Rusty Dagger', power: 2, cost: 10, tier: 1, iconType: 'dagger', color: '#94a3b8' },
  { id: 'w2', name: 'Short Sword', power: 5, cost: 25, tier: 1, iconType: 'sword', color: '#cbd5e1' },
  { id: 'w3', name: 'Iron Mace', power: 10, cost: 50, tier: 2, iconType: 'mace', color: '#64748b' },
  { id: 'w4', name: 'War Hammer', power: 20, cost: 100, tier: 2, iconType: 'hammer', color: '#475569' },
  { id: 'w5', name: 'Magic Wand', power: 40, cost: 250, tier: 3, iconType: 'wand', color: '#3b82f6' },
  { id: 'w6', name: 'Excalibur Fragment', power: 80, cost: 600, tier: 3, iconType: 'sword', color: '#f59e0b' },
  { id: 'w7', name: 'Dragon Slayer Axe', power: 150, cost: 1500, tier: 4, iconType: 'axe', color: '#ef4444' },
  { id: 'w8', name: 'God Killer Spear', power: 500, cost: 5000, tier: 4, iconType: 'spear', color: '#a855f7' },
];

export const MONSTER_TYPES = [
  { name: 'Zombie', powerRange: [3, 6], goldRange: [5, 10], coinRange: [0, 1], lucky: false },
  { name: 'Skeleton', powerRange: [5, 8], goldRange: [8, 15], coinRange: [1, 1], lucky: false },
  { name: 'Orc', powerRange: [8, 12], goldRange: [15, 25], coinRange: [1, 2], lucky: false },
  { name: 'Dragon', powerRange: [15, 25], goldRange: [50, 100], coinRange: [2, 5], lucky: true },
];
