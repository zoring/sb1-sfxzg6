export type CellType = 'wall' | 'path' | 'exit' | 'item' | 'trap' | 'monster' | 'portal' | 'fog';

export type PlayerPosition = [number, number];

export interface GameState {
  maze: CellType[][];
  playerPosition: PlayerPosition;
  timeLeft: number;
  items: number;
  monsters: PlayerPosition[];
  portals: PlayerPosition[];
  fogAreas: PlayerPosition[];
  gameStatus: 'playing' | 'won' | 'lost';
}

export interface LevelConfig {
  width: number;
  height: number;
  timeLimit: number;
  itemsRequired: number;
  monsters: number;
  traps: number;
  portals: number;
  fogPercentage: number;
}