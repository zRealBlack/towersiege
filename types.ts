export enum TileType {
  EMPTY = 'EMPTY',
  TOWER = 'TOWER',
  GOLD_MINE = 'GOLD_MINE',
  BLACKSMITH = 'BLACKSMITH',
  MONSTER = 'MONSTER',
}

export enum PlayerId {
  PLAYER_1 = 'PLAYER_1',
  PLAYER_2 = 'PLAYER_2',
}

export interface Stats {
  power: number;
  gold: number;
  upgradeCoins: number;
}

export interface Building {
  type: TileType;
  level: number;
  owner: PlayerId;
}

export interface Monster {
  type: string;
  power: number;
  rewardGold: number;
  rewardCoins: number;
  lucky?: boolean;
}

export interface TileData {
  x: number;
  y: number;
  type: TileType;
  building?: Building;
  monster?: Monster;
  owner?: PlayerId; // For territory
}

export interface Weapon {
  id: string;
  name: string;
  power: number;
  cost: number;
  tier: number;
  iconType: string;
  color: string;
}

export interface PlayerState {
  id: PlayerId;
  name: string;
  color: string;
  pos: { x: number; y: number };
  stats: Stats;
  towerHealth: number;
  towerLevel: number;
  inventory: Weapon[];
  equippedWeapons: Weapon[];
}

export interface GameState {
  board: TileData[][];
  players: Record<PlayerId, PlayerState>;
  turn: PlayerId;
  winner: PlayerId | null;
  logs: string[];
}
