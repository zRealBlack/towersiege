/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Coins, 
  Hammer, 
  Sword, 
  Skull, 
  Home, 
  Pickaxe, 
  TrendingUp,
  ChevronRight,
  AlertCircle,
  Trophy,
  Ghost,
  Bug,
  Flame,
  Settings,
  Lock,
  Unlock,
  Plus,
  Minus,
  X,
  Axe,
  Zap,
  Target,
  Wand2,
  Palette,
  User,
  Play
} from 'lucide-react';
import { 
  TileType, 
  PlayerId, 
  GameState, 
  TileData, 
  PlayerState,
  Monster,
  Weapon,
  Stats
} from './types';
import { 
  GRID_WIDTH, 
  GRID_HEIGHT, 
  INITIAL_STATS, 
  TOWER_HEALTH_BY_LEVEL,
  UPGRADE_COIN_COSTS,
  INITIAL_BUILD_COSTS,
  REWARDS,
  MONSTER_TYPES,
  WEAPONS
} from './constants';

const createInitialBoard = (): TileData[][] => {
  const board: TileData[][] = [];
  for (let y = 0; y < GRID_HEIGHT; y++) {
    const row: TileData[] = [];
    for (let x = 0; x < GRID_WIDTH; x++) {
      let type = TileType.EMPTY;
      let owner: PlayerId | undefined;

      if (x === 0 && y === 2) {
        type = TileType.TOWER;
        owner = PlayerId.PLAYER_1;
      } else if (x === GRID_WIDTH - 1 && y === 2) {
        type = TileType.TOWER;
        owner = PlayerId.PLAYER_2;
      }

      row.push({ x, y, type, owner });
    }
    board.push(row);
  }
  return board;
};

const getRandomMonster = (): Monster => {
  const config = MONSTER_TYPES[Math.floor(Math.random() * MONSTER_TYPES.length)];
  return {
    type: config.name,
    power: Math.floor(Math.random() * (config.powerRange[1] - config.powerRange[0] + 1)) + config.powerRange[0],
    rewardGold: Math.floor(Math.random() * (config.goldRange[1] - config.goldRange[0] + 1)) + config.goldRange[0],
    rewardCoins: Math.floor(Math.random() * (config.coinRange[1] - config.coinRange[0] + 1)) + config.coinRange[0],
    lucky: config.lucky,
  };
};

function GameSetup({ onStart }: { onStart: (p1: { name: string, color: string }, p2: { name: string, color: string }) => void }) {
  const [p1, setP1] = useState({ name: 'Player 1', color: '#3b82f6' });
  const [p2, setP2] = useState({ name: 'Player 2', color: '#ef4444' });

  const colors = [
    '#ef4444', '#f97316', '#f59e0b', '#10b981', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#71717a'
  ];

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 overflow-hidden relative">
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent" />
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-4xl w-full z-10"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 10 }}
            className="inline-flex items-center justify-center w-32 h-32 bg-emerald-600 rounded-[2.5rem] shadow-2xl shadow-emerald-900/40 mb-8"
          >
            <Shield className="w-16 h-16 text-white" />
          </motion.div>
          <h1 className="text-8xl font-black tracking-tighter text-white mb-4 italic leading-none">
            TOWER<br />SIEGE
          </h1>
          <p className="text-zinc-500 font-medium tracking-[0.3em] uppercase text-sm">A Strategic Battle for Supremacy</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Player 1 Setup */}
          <motion.div 
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-zinc-900 border border-white/10 p-8 rounded-[2rem] shadow-2xl"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: p1.color }}>
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Player 1</h2>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Attacker Side</p>
              </div>
            </div>
            
            <div className="space-y-8">
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase mb-3 block tracking-widest">Commander Name</label>
                <input 
                  type="text" 
                  value={p1.name}
                  onChange={(e) => setP1({ ...p1, name: e.target.value })}
                  className="w-full bg-zinc-800 border-2 border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-emerald-500 transition-all text-lg font-bold text-white"
                  placeholder="Enter name..."
                />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase mb-3 block tracking-widest">Banner Color</label>
                <div className="grid grid-cols-5 gap-3">
                  {colors.map(c => (
                    <button 
                      key={c}
                      onClick={() => setP1({ ...p1, color: c })}
                      className={`aspect-square rounded-xl transition-all ${p1.color === c ? 'ring-4 ring-white ring-offset-4 ring-offset-zinc-900 scale-110 z-10' : 'opacity-40 hover:opacity-100 hover:scale-105'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Player 2 Setup */}
          <motion.div 
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-zinc-900 border border-white/10 p-8 rounded-[2rem] shadow-2xl"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: p2.color }}>
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Player 2</h2>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Defender Side</p>
              </div>
            </div>
            
            <div className="space-y-8">
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase mb-3 block tracking-widest">Commander Name</label>
                <input 
                  type="text" 
                  value={p2.name}
                  onChange={(e) => setP2({ ...p2, name: e.target.value })}
                  className="w-full bg-zinc-800 border-2 border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-emerald-500 transition-all text-lg font-bold text-white"
                  placeholder="Enter name..."
                />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase mb-3 block tracking-widest">Banner Color</label>
                <div className="grid grid-cols-5 gap-3">
                  {colors.map(c => (
                    <button 
                      key={c}
                      onClick={() => setP2({ ...p2, color: c })}
                      className={`aspect-square rounded-xl transition-all ${p2.color === c ? 'ring-4 ring-white ring-offset-4 ring-offset-zinc-900 scale-110 z-10' : 'opacity-40 hover:opacity-100 hover:scale-105'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <button 
          onClick={() => onStart(p1, p2)}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-8 rounded-[2rem] font-black text-2xl flex items-center justify-center gap-4 transition-all shadow-2xl shadow-emerald-900/40 group"
        >
          COMMENCE SIEGE <Play className="w-8 h-8 group-hover:translate-x-2 transition-transform fill-current" />
        </button>
      </motion.div>
    </div>
  );
}

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    board: createInitialBoard(),
    players: {
      [PlayerId.PLAYER_1]: {
        id: PlayerId.PLAYER_1,
        name: 'Player 1',
        color: '#3b82f6',
        pos: { x: 0, y: 2 },
        stats: { ...INITIAL_STATS },
        towerHealth: TOWER_HEALTH_BY_LEVEL[1],
        towerLevel: 1,
        inventory: [],
        equippedWeapons: [],
      },
      [PlayerId.PLAYER_2]: {
        id: PlayerId.PLAYER_2,
        name: 'Player 2',
        color: '#ef4444',
        pos: { x: GRID_WIDTH - 1, y: 2 },
        stats: { ...INITIAL_STATS },
        towerHealth: TOWER_HEALTH_BY_LEVEL[1],
        towerLevel: 1,
        inventory: [],
        equippedWeapons: [],
      },
    },
    turn: PlayerId.PLAYER_1,
    winner: null,
    logs: ['Welcome to Tower Siege!'],
  });

  const startGame = (p1: { name: string, color: string }, p2: { name: string, color: string }) => {
    setGameState(prev => ({
      ...prev,
      players: {
        [PlayerId.PLAYER_1]: { ...prev.players[PlayerId.PLAYER_1], name: p1.name, color: p1.color },
        [PlayerId.PLAYER_2]: { ...prev.players[PlayerId.PLAYER_2], name: p2.name, color: p2.color },
      },
      logs: [`Game started! ${p1.name} goes first.`]
    }));
    setGameStarted(true);
  };

  const [selectedTile, setSelectedTile] = useState<{ x: number, y: number } | null>(null);
  const [upgradeMode, setUpgradeMode] = useState(false);
  const [weaponShopOpen, setWeaponShopOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVictoryAnimating, setIsVictoryAnimating] = useState(false);

  const getPlayerPower = (player: PlayerState) => {
    const weaponPower = player.equippedWeapons.reduce((sum, w) => sum + w.power, 0);
    return player.stats.power + weaponPower;
  };

  const addLog = (msg: string) => {
    setGameState(prev => ({
      ...prev,
      logs: [msg, ...prev.logs].slice(0, 10)
    }));
  };

  const spawnMonsters = useCallback(() => {
    setGameState(prev => {
      const newBoard = prev.board.map(row => row.map(tile => ({ ...tile })));
      let spawned = 0;
      let attempts = 0;
      while (spawned < 2 && attempts < 20) {
        attempts++;
        const rx = Math.floor(Math.random() * GRID_WIDTH);
        const ry = Math.floor(Math.random() * GRID_HEIGHT);
        if (newBoard[ry][rx].type === TileType.EMPTY && !newBoard[ry][rx].monster) {
          newBoard[ry][rx].monster = getRandomMonster();
          spawned++;
        }
      }
      return { ...prev, board: newBoard };
    });
  }, []);

  useEffect(() => {
    spawnMonsters();
  }, [spawnMonsters]);

  useEffect(() => {
    if (gameState.winner && !isVictoryAnimating) {
      setIsVictoryAnimating(true);
    }
  }, [gameState.winner, isVictoryAnimating]);

  const endTurn = () => {
    setGameState(prev => {
      const nextPlayer = prev.turn === PlayerId.PLAYER_1 ? PlayerId.PLAYER_2 : PlayerId.PLAYER_1;
      const currentPlayer = prev.players[prev.turn];
      let goldEarned = 0;
      
      prev.board.forEach(row => {
        row.forEach(tile => {
          if (tile.type === TileType.GOLD_MINE && tile.building?.owner === prev.turn) {
            goldEarned += REWARDS.MINE_GOLD(tile.building.level);
          }
        });
      });

      return {
        ...prev,
        players: {
          ...prev.players,
          [prev.turn]: {
            ...currentPlayer,
            stats: { ...currentPlayer.stats, gold: currentPlayer.stats.gold + goldEarned }
          }
        },
        turn: nextPlayer
      };
    });
    addLog("Turn skipped.");
  };

  const movePlayer = (x: number, y: number) => {
    const player = gameState.players[gameState.turn];
    const enemyId = gameState.turn === PlayerId.PLAYER_1 ? PlayerId.PLAYER_2 : PlayerId.PLAYER_1;
    const enemy = gameState.players[enemyId];
    const playerPower = getPlayerPower(player);
    const enemyPower = getPlayerPower(enemy);
    
    const dist = Math.abs(x - player.pos.x) + Math.abs(y - player.pos.y);
    if (dist !== 1) return;

    const targetTile = gameState.board[y][x];

    // Restriction: Cannot stand on enemy home tower
    if (targetTile.type === TileType.TOWER && targetTile.owner !== gameState.turn) {
      const damage = playerPower;
      addLog(`Attacked enemy tower for ${damage} damage!`);
      
      // If enemy player is on their tower, damage them too (trigger fight)
      if (enemy.pos.x === x && enemy.pos.y === y) {
        const winProb = playerPower / (playerPower + enemyPower);
        if (Math.random() < winProb) {
          addLog(`Victory! You defeated ${enemy.name} on their tower.`);
          setGameState(prev => {
            const nextPlayer = prev.turn === PlayerId.PLAYER_1 ? PlayerId.PLAYER_2 : PlayerId.PLAYER_1;
            const towerPos = enemyId === PlayerId.PLAYER_1 ? { x: 0, y: 2 } : { x: GRID_WIDTH - 1, y: 2 };
            const enemyState = prev.players[enemyId];
            const newHealth = Math.max(0, enemyState.towerHealth - damage);
            return {
              ...prev,
              winner: newHealth === 0 ? prev.turn : null,
              players: {
                ...prev.players,
                [enemyId]: { ...enemyState, pos: towerPos, towerHealth: newHealth }
              },
              turn: nextPlayer
            };
          });
        } else {
          addLog(`Defeat! ${enemy.name} defended their tower. You respawned.`);
          setGameState(prev => {
            const nextPlayer = prev.turn === PlayerId.PLAYER_1 ? PlayerId.PLAYER_2 : PlayerId.PLAYER_1;
            const towerPos = prev.turn === PlayerId.PLAYER_1 ? { x: 0, y: 2 } : { x: GRID_WIDTH - 1, y: 2 };
            const enemyState = prev.players[enemyId];
            const newHealth = Math.max(0, enemyState.towerHealth - damage);
            return {
              ...prev,
              winner: newHealth === 0 ? prev.turn : null,
              players: {
                ...prev.players,
                [prev.turn]: { ...prev.players[prev.turn], pos: towerPos },
                [enemyId]: { ...enemyState, towerHealth: newHealth }
              },
              turn: nextPlayer
            };
          });
        }
      } else {
        // Just damage tower
        setGameState(prev => {
          const enemyState = prev.players[enemyId];
          const newHealth = Math.max(0, enemyState.towerHealth - damage);
          const nextPlayer = prev.turn === PlayerId.PLAYER_1 ? PlayerId.PLAYER_2 : PlayerId.PLAYER_1;
          return {
            ...prev,
            winner: newHealth === 0 ? prev.turn : null,
            players: {
              ...prev.players,
              [enemyId]: { ...enemyState, towerHealth: newHealth }
            },
            turn: nextPlayer
          };
        });
      }
      return;
    }

    // Check if moving onto enemy player (not on their tower)
    if (enemy.pos.x === x && enemy.pos.y === y) {
      const winProb = playerPower / (playerPower + enemyPower);
      if (Math.random() < winProb) {
        addLog(`Victory! You defeated ${enemy.name}. They respawned at their tower.`);
        setGameState(prev => {
          const nextPlayer = prev.turn === PlayerId.PLAYER_1 ? PlayerId.PLAYER_2 : PlayerId.PLAYER_1;
          const towerPos = enemyId === PlayerId.PLAYER_1 ? { x: 0, y: 2 } : { x: GRID_WIDTH - 1, y: 2 };
          return {
            ...prev,
            players: {
              ...prev.players,
              [prev.turn]: { ...prev.players[prev.turn], pos: { x, y } },
              [enemyId]: { ...prev.players[enemyId], pos: towerPos }
            },
            turn: nextPlayer
          };
        });
      } else {
        addLog(`Defeat! ${enemy.name} defeated you. You respawned at your tower.`);
        setGameState(prev => {
          const nextPlayer = prev.turn === PlayerId.PLAYER_1 ? PlayerId.PLAYER_2 : PlayerId.PLAYER_1;
          const towerPos = prev.turn === PlayerId.PLAYER_1 ? { x: 0, y: 2 } : { x: GRID_WIDTH - 1, y: 2 };
          return {
            ...prev,
            players: {
              ...prev.players,
              [prev.turn]: { ...prev.players[prev.turn], pos: towerPos }
            },
            turn: nextPlayer
          };
        });
      }
      return;
    }

    const monsterData = targetTile.monster;
    
    if (monsterData) {
      const winProb = playerPower / (playerPower + monsterData.power);
      if (Math.random() < winProb) {
        let logMsg = `Victory! Killed ${monsterData.type}. Gained ${monsterData.rewardGold} gold.`;
        if (monsterData.lucky) logMsg += " LUCKY DROP!";
        addLog(logMsg);
        
        setGameState(prev => {
          const newBoard = prev.board.map(row => row.map(tile => ({ ...tile })));
          newBoard[y][x].monster = undefined;
          
          const p = prev.players[prev.turn];
          let goldReward = monsterData.rewardGold;
          let powerReward = 0;
          let coinReward = monsterData.rewardCoins;

          if (monsterData.lucky) {
            goldReward = Math.floor(goldReward * 1.5);
            powerReward = 10;
            coinReward += 1;
          }

          const updatedPlayer = {
            ...p,
            pos: { x, y },
            stats: {
              ...p.stats,
              gold: p.stats.gold + goldReward,
              upgradeCoins: p.stats.upgradeCoins + coinReward,
              power: p.stats.power + powerReward
            }
          };

          const nextPlayer = prev.turn === PlayerId.PLAYER_1 ? PlayerId.PLAYER_2 : PlayerId.PLAYER_1;
          return {
            ...prev,
            board: newBoard,
            players: { ...prev.players, [prev.turn]: updatedPlayer },
            turn: nextPlayer
          };
        });
      } else {
        addLog(`Defeat! The ${monsterData.type} was too strong. You respawned at your tower.`);
        setGameState(prev => {
          const p = prev.players[prev.turn];
          const nextPlayer = prev.turn === PlayerId.PLAYER_1 ? PlayerId.PLAYER_2 : PlayerId.PLAYER_1;
          const towerPos = prev.turn === PlayerId.PLAYER_1 ? { x: 0, y: 2 } : { x: GRID_WIDTH - 1, y: 2 };
          return {
            ...prev,
            players: {
              ...prev.players,
              [prev.turn]: {
                ...p,
                pos: towerPos,
                stats: { ...p.stats, gold: Math.max(0, p.stats.gold - 5) }
              }
            },
            turn: nextPlayer
          };
        });
      }
      return;
    }

    setGameState(prev => {
      const nextPlayer = prev.turn === PlayerId.PLAYER_1 ? PlayerId.PLAYER_2 : PlayerId.PLAYER_1;
      return {
        ...prev,
        players: {
          ...prev.players,
          [prev.turn]: { ...prev.players[prev.turn], pos: { x, y } }
        },
        turn: nextPlayer
      };
    });
  };

  const buildStructure = (type: TileType) => {
    const player = gameState.players[gameState.turn];
    
    // Calculate Gold Mine cost and limit
    let goldMineCount = 0;
    gameState.board.forEach(row => row.forEach(tile => {
      if (tile.type === TileType.GOLD_MINE && tile.building?.owner === gameState.turn) {
        goldMineCount++;
      }
    }));

    let cost = 0;
    if (type === TileType.GOLD_MINE) {
      if (goldMineCount >= 4) {
        addLog("Maximum 4 Gold Mines allowed!");
        return;
      }
      cost = (goldMineCount + 1) * 10;
    } else {
      cost = INITIAL_BUILD_COSTS.BLACKSMITH;
    }

    if (player.stats.gold < cost) {
      addLog(`Not enough gold! Need ${cost}G.`);
      return;
    }

    // Restriction: Only one Forge per player
    if (type === TileType.BLACKSMITH) {
      let forgeCount = 0;
      gameState.board.forEach(row => row.forEach(tile => {
        if (tile.type === TileType.BLACKSMITH && tile.building?.owner === gameState.turn) {
          forgeCount++;
        }
      }));
      if (forgeCount >= 1) {
        addLog("You already have a Forge!");
        return;
      }
    }

    // Find empty spot near tower
    const towerPos = gameState.turn === PlayerId.PLAYER_1 ? { x: 0, y: 2 } : { x: GRID_WIDTH - 1, y: 2 };
    let spot: {x: number, y: number} | null = null;
    
    // Search spiral/diamond around tower
    const searchOrder = [
      {dx: 0, dy: -1}, {dx: 0, dy: 1}, {dx: 1, dy: 0}, {dx: -1, dy: 0},
      {dx: 1, dy: -1}, {dx: 1, dy: 1}, {dx: -1, dy: -1}, {dx: -1, dy: 1},
      {dx: 0, dy: -2}, {dx: 0, dy: 2}, {dx: 2, dy: 0}, {dx: -2, dy: 0},
    ];

    for (const offset of searchOrder) {
      const nx = towerPos.x + offset.dx;
      const ny = towerPos.y + offset.dy;
      if (nx >= 0 && nx < GRID_WIDTH && ny >= 0 && ny < GRID_HEIGHT) {
        if (gameState.board[ny][nx].type === TileType.EMPTY && !gameState.board[ny][nx].monster) {
          spot = { x: nx, y: ny };
          break;
        }
      }
    }

    if (!spot) {
      addLog("No space left near your tower!");
      return;
    }

    const { x, y } = spot;

    setGameState(prev => {
      const newBoard = prev.board.map(row => row.map(tile => ({ ...tile })));
      newBoard[y][x] = {
        ...newBoard[y][x],
        type,
        building: { type, level: 1, owner: prev.turn }
      };
      
      const p = prev.players[prev.turn];
      const nextPlayer = prev.turn === PlayerId.PLAYER_1 ? PlayerId.PLAYER_2 : PlayerId.PLAYER_1;
      return {
        ...prev,
        board: newBoard,
        players: {
          ...prev.players,
          [prev.turn]: {
            ...p,
            stats: { ...p.stats, gold: p.stats.gold - cost }
          }
        },
        turn: nextPlayer
      };
    });
    addLog(`Built ${type.replace('_', ' ')} at (${x}, ${y})!`);
  };

  const upgradeBuilding = (x: number, y: number) => {
    const tile = gameState.board[y][x];
    const player = gameState.players[gameState.turn];
    
    let currentLevel = 0;
    let isTower = false;

    if (tile.type === TileType.TOWER && tile.owner === gameState.turn) {
      currentLevel = player.towerLevel;
      isTower = true;
    } else if (tile.building && tile.building.owner === gameState.turn) {
      currentLevel = tile.building.level;
    } else {
      addLog("Cannot upgrade this!");
      return;
    }

    if (currentLevel >= 4) {
      addLog("Already at max level!");
      return;
    }

    const nextLevel = currentLevel + 1;
    const coinCost = UPGRADE_COIN_COSTS[nextLevel];

    if (player.stats.upgradeCoins < coinCost) {
      addLog(`Need ${coinCost} upgrade coins!`);
      return;
    }

    setGameState(prev => {
      const p = prev.players[prev.turn];
      const newBoard = prev.board.map(row => row.map(t => ({ ...t })));
      
      const updatedPlayer = {
        ...p,
        stats: { ...p.stats, upgradeCoins: p.stats.upgradeCoins - coinCost }
      };

      if (isTower) {
        updatedPlayer.towerLevel = nextLevel;
        updatedPlayer.towerHealth = TOWER_HEALTH_BY_LEVEL[nextLevel];
      } else {
        const target = newBoard[y][x];
        if (target.building) {
          target.building = { ...target.building, level: nextLevel };
        }
      }

      const nextPlayer = prev.turn === PlayerId.PLAYER_1 ? PlayerId.PLAYER_2 : PlayerId.PLAYER_1;
      return {
        ...prev,
        board: newBoard,
        players: { ...prev.players, [prev.turn]: updatedPlayer },
        turn: nextPlayer
      };
    });
    addLog(`Upgraded ${isTower ? 'Tower' : tile.type.replace('_', ' ')} to level ${nextLevel}!`);
    setUpgradeMode(false);
  };

  const buyWeapon = (weapon: Weapon) => {
    const player = gameState.players[gameState.turn];
    
    // Find forge level
    let forgeLevel = 0;
    gameState.board.forEach(row => row.forEach(tile => {
      if (tile.type === TileType.BLACKSMITH && tile.building?.owner === gameState.turn) {
        forgeLevel = tile.building.level;
      }
    }));

    if (weapon.tier > forgeLevel) {
      addLog(`Need level ${weapon.tier} Forge!`);
      return;
    }

    if (player.inventory.some(w => w.name === weapon.name)) {
      addLog(`You already own ${weapon.name}!`);
      return;
    }

    if (player.stats.gold < weapon.cost) {
      addLog("Not enough gold!");
      return;
    }

    setGameState(prev => {
      const p = prev.players[prev.turn];
      const nextPlayer = prev.turn === PlayerId.PLAYER_1 ? PlayerId.PLAYER_2 : PlayerId.PLAYER_1;
      const newWeapon = { ...weapon, id: `${weapon.id}-${Date.now()}` };
      
      let newEquipped = [...p.equippedWeapons];
      if (newEquipped.length < 4) {
        newEquipped.push(newWeapon);
      }

      return {
        ...prev,
        players: {
          ...prev.players,
          [prev.turn]: {
            ...p,
            stats: {
              ...p.stats,
              gold: p.stats.gold - weapon.cost
            },
            inventory: [...p.inventory, newWeapon],
            equippedWeapons: newEquipped
          }
        },
        turn: nextPlayer
      };
    });
    addLog(`Bought ${weapon.name}!`);
    setWeaponShopOpen(false);
  };

  const toggleWeapon = (weapon: Weapon) => {
    setGameState(prev => {
      const p = prev.players[prev.turn];
      const isEquipped = p.equippedWeapons.some(w => w.id === weapon.id);
      
      let newEquipped = [...p.equippedWeapons];
      if (isEquipped) {
        newEquipped = newEquipped.filter(w => w.id !== weapon.id);
        addLog(`Unequipped ${weapon.name}.`);
      } else {
        if (newEquipped.length >= 4) {
          addLog("Maximum 4 weapons equipped!");
          return prev;
        }
        newEquipped.push(weapon);
        addLog(`Equipped ${weapon.name}.`);
      }

      return {
        ...prev,
        players: {
          ...prev.players,
          [prev.turn]: { ...p, equippedWeapons: newEquipped }
        }
      };
    });
  };

  const adminAction = (playerId: PlayerId, type: 'power' | 'gold' | 'coins', amount: number) => {
    setGameState(prev => ({
      ...prev,
      players: {
        ...prev.players,
        [playerId]: {
          ...prev.players[playerId],
          stats: {
            ...prev.players[playerId].stats,
            [type === 'coins' ? 'upgradeCoins' : type]: prev.players[playerId].stats[type === 'coins' ? 'upgradeCoins' : type as keyof Stats] + amount
          }
        }
      }
    }));
    addLog(`Admin: Gave ${amount} ${type} to ${playerId}.`);
  };

  if (gameState.winner && isVictoryAnimating) {
    const winner = gameState.players[gameState.winner];
    const isP1Winner = gameState.winner === PlayerId.PLAYER_1;
    const winnerColor = isP1Winner ? gameState.players[PlayerId.PLAYER_1].color : gameState.players[PlayerId.PLAYER_2].color;
    
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-0 pointer-events-none"
        >
          {/* Fading background effect */}
          <div 
            className="absolute inset-0 transition-opacity duration-3000 opacity-20" 
            style={{ backgroundColor: winnerColor }}
          />
        </motion.div>

        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-zinc-900 border-2 border-emerald-500/50 p-12 rounded-3xl text-center shadow-2xl z-10 relative"
        >
          <motion.div
            animate={{ 
              rotate: [0, -10, 10, -10, 10, 0],
              scale: [1, 1.1, 1, 1.1, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Trophy className="w-24 h-24 text-emerald-400 mx-auto mb-6" />
          </motion.div>
          <h1 className="text-5xl font-bold text-white mb-4">VICTORY</h1>
          <p className="text-2xl text-zinc-400 mb-8">{winner.name} has conquered the realm!</p>
          
          <div className="grid grid-cols-10 gap-2 mb-8 opacity-50 scale-75">
            {gameState.board.map((row, y) => row.map((tile, x) => {
              const isWinnerSide = isP1Winner ? x < GRID_WIDTH / 2 : x >= GRID_WIDTH / 2;
              return (
                <motion.div
                  key={`${x}-${y}`}
                  initial={{ opacity: 1 }}
                  animate={{ 
                    opacity: isWinnerSide ? 1 : [1, 0.5, 0],
                    scale: isWinnerSide ? 1 : [1, 1.2, 0],
                    rotate: isWinnerSide ? 0 : [0, 45, 90],
                    backgroundColor: isWinnerSide ? (isP1Winner ? gameState.players[PlayerId.PLAYER_1].color : gameState.players[PlayerId.PLAYER_2].color) : '#18181b'
                  }}
                  transition={{ 
                    duration: 2, 
                    delay: (isP1Winner ? x : (GRID_WIDTH - x)) * 0.1 
                  }}
                  className="w-6 h-6 rounded border border-white/10"
                />
              );
            }))}
          </div>

          <button 
            onClick={() => window.location.reload()}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold transition-colors"
          >
            Play Again
          </button>
        </motion.div>
      </div>
    );
  }

  if (!gameStarted) {
    return <GameSetup onStart={startGame} />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="border-b border-white/5 p-4 flex justify-between items-center bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-900/20">
            <Shield className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">TOWER SIEGE</h1>
        </div>
        <div className="flex items-center gap-6">
          <div 
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${gameState.turn === PlayerId.PLAYER_1 ? 'text-white shadow-lg' : 'bg-zinc-800 text-zinc-500'}`}
            style={{ 
              backgroundColor: gameState.turn === PlayerId.PLAYER_1 ? gameState.players[PlayerId.PLAYER_1].color : undefined,
              boxShadow: gameState.turn === PlayerId.PLAYER_1 ? `0 10px 15px -3px ${gameState.players[PlayerId.PLAYER_1].color}40` : undefined
            }}
          >
            {gameState.players[PlayerId.PLAYER_1].name.toUpperCase()}
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div 
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${gameState.turn === PlayerId.PLAYER_2 ? 'text-white shadow-lg' : 'bg-zinc-800 text-zinc-500'}`}
            style={{ 
              backgroundColor: gameState.turn === PlayerId.PLAYER_2 ? gameState.players[PlayerId.PLAYER_2].color : undefined,
              boxShadow: gameState.turn === PlayerId.PLAYER_2 ? `0 10px 15px -3px ${gameState.players[PlayerId.PLAYER_2].color}40` : undefined
            }}
          >
            {gameState.players[PlayerId.PLAYER_2].name.toUpperCase()}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar: Stats */}
        <div className="lg:col-span-3 space-y-6">
          <PlayerCard 
            player={gameState.players[PlayerId.PLAYER_1]} 
            active={gameState.turn === PlayerId.PLAYER_1} 
            onInventory={() => setInventoryOpen(true)}
            power={getPlayerPower(gameState.players[PlayerId.PLAYER_1])}
          />
          <PlayerCard 
            player={gameState.players[PlayerId.PLAYER_2]} 
            active={gameState.turn === PlayerId.PLAYER_2} 
            onInventory={() => setInventoryOpen(true)}
            power={getPlayerPower(gameState.players[PlayerId.PLAYER_2])}
          />
        </div>

        {/* Center: Board */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden relative">
            <div className="grid grid-cols-10 gap-2">
              {gameState.board.map((row, y) => (
                row.map((tile, x) => (
                    <Tile 
                      key={`${x}-${y}`} 
                      tile={tile} 
                      player1={gameState.players[PlayerId.PLAYER_1]}
                      player2={gameState.players[PlayerId.PLAYER_2]}
                      isSelected={selectedTile?.x === x && selectedTile?.y === y}
                      isVictoryAnimating={isVictoryAnimating}
                      winnerId={gameState.winner}
                      onSelect={() => {
                        if (upgradeMode) {
                          upgradeBuilding(x, y);
                        } else {
                          setSelectedTile({ x, y });
                        }
                      }}
                      onMove={() => {
                        if (!upgradeMode) movePlayer(x, y);
                      }}
                      canMove={!upgradeMode && !isVictoryAnimating && Math.abs(x - gameState.players[gameState.turn].pos.x) + Math.abs(y - gameState.players[gameState.turn].pos.y) === 1}
                    />
                ))
              ))}
            </div>
          </div>

          {/* Action Panel */}
          <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Actions</h2>
              {selectedTile && (
                <span className="text-xs text-zinc-500 font-mono">TILE: {selectedTile.x}, {selectedTile.y}</span>
              )}
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <ActionButton 
                icon={<Pickaxe />} 
                label="Build Mine" 
                sub={`${(gameState.board.flat().filter(t => t.type === TileType.GOLD_MINE && t.building?.owner === gameState.turn).length + 1) * 10}G`}
                onClick={() => buildStructure(TileType.GOLD_MINE)}
                disabled={upgradeMode}
              />
              <ActionButton 
                icon={<Hammer />} 
                label="Build Forge" 
                sub={`-${INITIAL_BUILD_COSTS.BLACKSMITH}G`}
                onClick={() => buildStructure(TileType.BLACKSMITH)}
                disabled={upgradeMode || gameState.board.flat().some(t => t.type === TileType.BLACKSMITH && t.building?.owner === gameState.turn)}
              />
              <ActionButton 
                icon={<TrendingUp />} 
                label={upgradeMode ? "Select Target..." : "Upgrade"} 
                onClick={() => setUpgradeMode(!upgradeMode)}
                active={upgradeMode}
              />
              <ActionButton 
                icon={<Sword />} 
                label="Buy Weapon" 
                onClick={() => setWeaponShopOpen(true)}
                disabled={upgradeMode || !gameState.board.flat().some(t => t.type === TileType.BLACKSMITH && t.building?.owner === gameState.turn)}
              />
            </div>
            
            <button 
              onClick={endTurn}
              className="w-full mt-6 bg-zinc-800 hover:bg-zinc-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all group"
            >
              Skip Turn <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right Sidebar: Context Info */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-emerald-400" /> Selection Info
            </h3>
            {selectedTile ? (
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="text-xs text-zinc-500 uppercase font-bold mb-1">Type</div>
                  <div className="text-lg font-bold">{gameState.board[selectedTile.y][selectedTile.x].type.replace('_', ' ')}</div>
                </div>
                {selectedTile && gameState.board[selectedTile.y][selectedTile.x].monster && (
                  <div className="p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-red-400 font-bold uppercase">Monster</span>
                      <Skull className="w-4 h-4 text-red-400" />
                    </div>
                    <div className="text-xl font-bold text-red-100">{gameState.board[selectedTile.y][selectedTile.x].monster?.type}</div>
                    <div className="mt-2 flex items-center gap-4">
                      <div className="text-xs"><span className="text-zinc-500">Power:</span> {gameState.board[selectedTile.y][selectedTile.x].monster?.power}</div>
                      <div className="text-xs"><span className="text-zinc-500">Reward:</span> {gameState.board[selectedTile.y][selectedTile.x].monster?.rewardGold}G</div>
                    </div>
                  </div>
                )}
                {gameState.board[selectedTile.y][selectedTile.x].building && (
                  <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-emerald-400 font-bold uppercase">Building</span>
                      <Home className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-xl font-bold text-emerald-100">Level {gameState.board[selectedTile.y][selectedTile.x].building?.level}</div>
                    <div className="mt-2 text-xs text-zinc-400">
                      Owner: {gameState.board[selectedTile.y][selectedTile.x].building?.owner === PlayerId.PLAYER_1 ? 'Player 1' : 'Player 2'}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-zinc-500 italic">Select a tile on the board to see details.</p>
            )}
          </div>

          <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-4">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <AlertCircle className="w-3 h-3" /> Battle Logs
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {gameState.logs.map((log, i) => (
                <div key={i} className="text-xs text-zinc-400 border-l-2 border-emerald-500/30 pl-3 py-1 bg-white/5 rounded-r-lg">
                  {log}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6">
            <h3 className="text-sm font-bold mb-4">How to Play</h3>
            <ul className="text-xs text-zinc-400 space-y-3">
              <li className="flex gap-2"><span className="text-emerald-400 font-bold">1.</span> Move to adjacent tiles to explore or fight monsters.</li>
              <li className="flex gap-2"><span className="text-emerald-400 font-bold">2.</span> Build Mines near your tower to generate Gold.</li>
              <li className="flex gap-2"><span className="text-emerald-400 font-bold">3.</span> Build a Forge and buy weapons to increase Power.</li>
              <li className="flex gap-2"><span className="text-emerald-400 font-bold">4.</span> Higher Power increases your chance to kill monsters.</li>
              <li className="flex gap-2"><span className="text-emerald-400 font-bold">5.</span> Reach the enemy tower and attack it to win!</li>
            </ul>
          </div>
        </div>
      </main>

      {/* Weapon Shop Modal */}
      <AnimatePresence>
        {weaponShopOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 border border-white/10 rounded-3xl p-8 max-w-2xl w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold">Weapon Shop</h2>
                  <p className="text-zinc-500 text-sm">Upgrade your Forge to unlock higher tiers.</p>
                </div>
                <button 
                  onClick={() => setWeaponShopOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                  <AlertCircle className="w-6 h-6 rotate-45" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {WEAPONS.map((weapon) => {
                  const forgeLevel = gameState.board.flat().find(t => t.type === TileType.BLACKSMITH && t.building?.owner === gameState.turn)?.building?.level || 0;
                  const unlocked = weapon.tier <= forgeLevel;
                  const canAfford = gameState.players[gameState.turn].stats.gold >= weapon.cost;

                  return (
                    <div 
                      key={weapon.id}
                      className={`p-4 rounded-2xl border transition-all ${unlocked ? 'border-white/10 bg-zinc-800/50' : 'border-white/5 bg-zinc-900 opacity-50'}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <WeaponIcon type={weapon.iconType} color={weapon.color} className="w-5 h-5" />
                          <div className="font-bold text-lg">{weapon.name}</div>
                        </div>
                        <div className="text-xs font-bold px-2 py-1 bg-zinc-700 rounded-lg">TIER {weapon.tier}</div>
                      </div>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-1 text-emerald-400 text-sm font-bold">
                          <Sword className="w-4 h-4" /> +{weapon.power}
                        </div>
                        <div className="flex items-center gap-1 text-amber-400 text-sm font-bold">
                          <Coins className="w-4 h-4" /> {weapon.cost}G
                        </div>
                      </div>
                      <button 
                        onClick={() => buyWeapon(weapon)}
                        disabled={!unlocked || !canAfford || gameState.players[gameState.turn].inventory.some(w => w.name === weapon.name)}
                        className={`w-full py-2 rounded-xl font-bold transition-all ${unlocked && canAfford && !gameState.players[gameState.turn].inventory.some(w => w.name === weapon.name) ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'}`}
                      >
                        {gameState.players[gameState.turn].inventory.some(w => w.name === weapon.name) ? 'Owned' : (unlocked ? (canAfford ? 'Purchase' : 'Too Expensive') : `Forge Lvl ${weapon.tier} Required`)}
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Inventory Modal */}
      <AnimatePresence>
        {inventoryOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 border border-white/10 rounded-3xl p-8 max-w-2xl w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold">Inventory</h2>
                  <p className="text-zinc-500 text-sm">Equip up to 4 weapons to increase your Power.</p>
                </div>
                <button 
                  onClick={() => setInventoryOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {gameState.players[gameState.turn].inventory.map((weapon, idx) => {
                  const isEquipped = gameState.players[gameState.turn].equippedWeapons.some(w => w.id === weapon.id);
                  return (
                    <div 
                      key={weapon.id}
                      className={`p-4 rounded-2xl border transition-all ${isEquipped ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 bg-zinc-800/50'}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <WeaponIcon type={weapon.iconType} className="w-5 h-5 text-emerald-400" />
                          <div className="font-bold text-lg">{weapon.name}</div>
                        </div>
                        {isEquipped && <div className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500 text-white rounded-full">EQUIPPED</div>}
                      </div>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-1 text-emerald-400 text-sm font-bold">
                          <Sword className="w-4 h-4" /> +{weapon.power}
                        </div>
                      </div>
                      <button 
                        onClick={() => toggleWeapon(weapon)}
                        className={`w-full py-2 rounded-xl font-bold transition-all ${isEquipped ? 'bg-zinc-700 hover:bg-red-600 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}
                      >
                        {isEquipped ? 'Unequip' : 'Equip'}
                      </button>
                    </div>
                  );
                })}
                {gameState.players[gameState.turn].inventory.length === 0 && (
                  <div className="col-span-2 text-center py-12 text-zinc-500 italic">
                    Your inventory is empty. Buy weapons at the Forge!
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Button */}
      <button 
        onClick={() => setAdminOpen(true)}
        className="fixed bottom-4 right-4 w-8 h-8 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg z-50 transition-colors"
      >
        <Settings className="w-4 h-4" />
      </button>

      {/* Admin Panel Modal */}
      <AnimatePresence>
        {adminOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-sm">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-zinc-900 border border-red-500/30 rounded-3xl p-8 max-w-md w-full shadow-2xl shadow-red-900/20"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-red-500 flex items-center gap-2">
                  <Lock className="w-5 h-5" /> Admin Panel
                </h2>
                <button onClick={() => setAdminOpen(false)}><X className="w-6 h-6" /></button>
              </div>

              {!isAdmin ? (
                <div className="space-y-4">
                  <p className="text-zinc-400 text-sm">Enter password to access developer tools.</p>
                  <input 
                    type="password" 
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500"
                    placeholder="Password..."
                  />
                  <button 
                    onClick={() => {
                      if (adminPass === 'gamll') setIsAdmin(true);
                      else addLog("Wrong admin password!");
                    }}
                    className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-bold transition-colors"
                  >
                    Login
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {[PlayerId.PLAYER_1, PlayerId.PLAYER_2].map(pid => (
                    <div key={pid} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className="text-sm font-bold mb-3 text-zinc-300">{pid === PlayerId.PLAYER_1 ? 'Player 1' : 'Player 2'}</div>
                      <div className="grid grid-cols-3 gap-2">
                        <button onClick={() => adminAction(pid, 'power', 10)} className="text-[10px] bg-zinc-800 p-2 rounded hover:bg-zinc-700">+10 Pow</button>
                        <button onClick={() => adminAction(pid, 'gold', 100)} className="text-[10px] bg-zinc-800 p-2 rounded hover:bg-zinc-700">+100 Gold</button>
                        <button onClick={() => adminAction(pid, 'coins', 5)} className="text-[10px] bg-zinc-800 p-2 rounded hover:bg-zinc-700">+5 Coins</button>
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => setIsAdmin(false)}
                    className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 py-2 rounded-xl text-xs font-bold"
                  >
                    Logout
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PlayerCard({ player, active, onInventory, power }: { player: PlayerState, active: boolean, onInventory: () => void, power: number }) {
  const maxHealth = TOWER_HEALTH_BY_LEVEL[player.towerLevel];
  const healthPercent = (player.towerHealth / maxHealth) * 100;
  
  return (
    <motion.div 
      animate={{ scale: active ? 1.02 : 1, opacity: active ? 1 : 0.7 }}
      className="p-5 rounded-3xl border transition-all"
      style={{ 
        borderColor: active ? player.color : 'rgba(255,255,255,0.05)',
        backgroundColor: active ? `${player.color}0D` : 'rgba(24,24,27,0.5)',
        boxShadow: active ? `0 10px 15px -3px ${player.color}1A` : undefined
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: player.color }}>
            <Sword className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-tighter">{player.name}</div>
            <div className="text-lg font-bold">Lvl {player.towerLevel} Knight</div>
          </div>
        </div>
        {active && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <Sword className="w-4 h-4" /> Power
          </div>
          <div className="font-bold text-white">{power} <span className="text-[10px] text-zinc-500 font-normal">({player.stats.power}+{power - player.stats.power})</span></div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <Coins className="w-4 h-4" /> Gold
          </div>
          <div className="font-bold text-amber-400">{player.stats.gold}</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <TrendingUp className="w-4 h-4" /> Coins
          </div>
          <div className="font-bold text-emerald-400">{player.stats.upgradeCoins}</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-bold text-zinc-500 uppercase">Equipped ({player.equippedWeapons.length}/4)</div>
          <button 
            onClick={onInventory}
            className="text-[10px] bg-white/5 hover:bg-white/10 px-2 py-1 rounded border border-white/5 transition-colors"
          >
            Inventory
          </button>
        </div>
        <div className="flex gap-1 overflow-x-auto pb-1 custom-scrollbar">
          {player.equippedWeapons.map((w, i) => (
            <div key={w.id} className="w-8 h-8 bg-zinc-800 rounded border border-white/10 flex items-center justify-center flex-shrink-0" title={w.name}>
              <WeaponIcon type={w.iconType} color={w.color} className="w-3 h-3" />
            </div>
          ))}
          {Array.from({ length: 4 - player.equippedWeapons.length }).map((_, i) => (
            <div key={i} className="w-8 h-8 bg-zinc-900/50 rounded border border-dashed border-white/5 flex-shrink-0" />
          ))}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between text-xs font-bold mb-2">
          <span className="text-zinc-500 uppercase">Tower Integrity</span>
          <span className={healthPercent < 30 ? 'text-red-400' : 'text-zinc-300'}>{player.towerHealth} HP</span>
        </div>
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${healthPercent}%` }}
            className="h-full rounded-full"
            style={{ backgroundColor: healthPercent < 30 ? '#ef4444' : player.color }}
          />
        </div>
      </div>
    </motion.div>
  );
}

function Tile({ tile, player1, player2, isSelected, onSelect, onMove, canMove, isVictoryAnimating, winnerId }: any) {
  const isP1 = player1.pos.x === tile.x && player1.pos.y === tile.y;
  const isP2 = player2.pos.x === tile.x && player2.pos.y === tile.y;

  const isWinnerSide = winnerId === PlayerId.PLAYER_1 ? tile.x < GRID_WIDTH / 2 : tile.x >= GRID_WIDTH / 2;
  const isLoserSide = winnerId && !isWinnerSide;

  return (
    <motion.div 
      animate={isVictoryAnimating && isLoserSide ? {
        scale: [1, 1.1, 0],
        rotate: [0, 10, -10, 45],
        opacity: [1, 1, 0],
        backgroundColor: ['#18181b', '#18181b', '#000']
      } : {}}
      transition={{ duration: 1.5, delay: (winnerId === PlayerId.PLAYER_1 ? tile.x : (GRID_WIDTH - tile.x)) * 0.1 }}
      onClick={() => {
        if (canMove) onMove();
        onSelect();
      }}
      className={`
        aspect-square rounded-xl relative cursor-pointer transition-all duration-200
        flex items-center justify-center border-2
        ${isSelected ? 'border-emerald-500 bg-emerald-500/10 scale-105 z-10 shadow-lg shadow-emerald-500/20' : 'border-white/5 bg-zinc-800/50 hover:bg-zinc-800 hover:border-white/10'}
        ${canMove ? 'ring-2 ring-emerald-500/30 ring-offset-2 ring-offset-zinc-950' : ''}
        ${isVictoryAnimating && isWinnerSide ? (winnerId === PlayerId.PLAYER_1 ? 'bg-blue-900/40 border-blue-500/50' : 'bg-red-900/40 border-red-500/50') : ''}
      `}
    >
      <AnimatePresence mode="wait">
        {isP1 && (
          <motion.div 
            key="p1"
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            className="absolute inset-0 flex items-center justify-center p-1"
          >
            <div className="w-full h-full rounded-lg flex items-center justify-center shadow-lg" style={{ backgroundColor: player1.color, boxShadow: `0 10px 15px -3px ${player1.color}40` }}>
              <Sword className="w-4 h-4 text-white" />
            </div>
          </motion.div>
        )}
        {isP2 && (
          <motion.div 
            key="p2"
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            className="absolute inset-0 flex items-center justify-center p-1"
          >
            <div className="w-full h-full rounded-lg flex items-center justify-center shadow-lg" style={{ backgroundColor: player2.color, boxShadow: `0 10px 15px -3px ${player2.color}40` }}>
              <Sword className="w-4 h-4 text-white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isP1 && !isP2 && (
        <div className="opacity-40">
          {tile.type === TileType.TOWER && (
            <div className="relative">
              <Shield className="w-6 h-6" style={{ color: tile.owner === PlayerId.PLAYER_1 ? player1.color : player2.color }} />
              <div className="absolute -bottom-2 -right-2 text-[8px] font-bold bg-zinc-900 px-1 rounded border border-white/10">
                L{tile.owner === PlayerId.PLAYER_1 ? player1.towerLevel : player2.towerLevel}
              </div>
            </div>
          )}
          {tile.type === TileType.GOLD_MINE && <Pickaxe className="w-5 h-5 text-amber-400" />}
          {tile.type === TileType.BLACKSMITH && <Hammer className="w-5 h-5 text-zinc-400" />}
          {tile.monster && (
            tile.monster.type === 'Zombie' ? <Ghost className="w-5 h-5 text-emerald-400 animate-pulse" /> :
            tile.monster.type === 'Skeleton' ? <Skull className="w-5 h-5 text-zinc-400 animate-pulse" /> :
            tile.monster.type === 'Orc' ? <Bug className="w-5 h-5 text-orange-400 animate-pulse" /> :
            tile.monster.type === 'Dragon' ? <Flame className="w-5 h-5 text-red-500 animate-pulse" /> :
            <Skull className="w-5 h-5 text-red-500 animate-pulse" />
          )}
        </div>
      )}

      {tile.building && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-[8px] font-bold text-white border border-zinc-950">
          {tile.building.level}
        </div>
      )}
    </motion.div>
  );
}

function ActionButton({ icon, label, sub, onClick, disabled, active }: any) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`
        flex flex-col items-center justify-center p-4 rounded-2xl border transition-all
        ${active ? 'border-emerald-500 bg-emerald-500/20 scale-105' : ''}
        ${disabled ? 'opacity-30 cursor-not-allowed border-white/5 bg-zinc-900' : 'border-white/10 bg-zinc-800/50 hover:bg-zinc-800 hover:border-emerald-500/50 hover:scale-[1.02] active:scale-95'}
      `}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${active ? 'bg-emerald-500 text-white' : (disabled ? 'bg-zinc-800' : 'bg-emerald-500/10 text-emerald-400')}`}>
        {React.cloneElement(icon, { className: 'w-5 h-5' })}
      </div>
      <span className="text-xs font-bold">{label}</span>
      {sub && <span className="text-[10px] text-zinc-500 mt-1">{sub}</span>}
    </button>
  );
}

function WeaponIcon({ type, color, className }: { type: string, color?: string, className?: string }) {
  const iconProps = { className, style: { color } };
  switch (type) {
    case 'dagger': return <Sword {...iconProps} />;
    case 'sword': return <Sword {...iconProps} />;
    case 'mace': return <Zap {...iconProps} />;
    case 'hammer': return <Hammer {...iconProps} />;
    case 'axe': return <Axe {...iconProps} />;
    case 'spear': return <ChevronRight {...iconProps} />;
    case 'wand': return <Wand2 {...iconProps} />;
    case 'bow': return <Target {...iconProps} />;
    default: return <Sword {...iconProps} />;
  }
}
