import React from 'react';
import { CellType, PlayerPosition } from '../types';

interface MazeProps {
  maze: CellType[][];
  playerPosition: PlayerPosition;
  fogOfWar: boolean;
}

const cellColors: Record<CellType, string> = {
  wall: 'bg-gray-800',
  path: 'bg-gray-200',
  exit: 'bg-green-500',
  item: 'bg-yellow-300',
  trap: 'bg-red-500',
  monster: 'bg-purple-600',
  portal: 'bg-blue-400',
  fog: 'bg-gray-400',
};

const Maze: React.FC<MazeProps> = ({ maze, playerPosition, fogOfWar }) => {
  if (!maze || maze.length === 0 || maze[0].length === 0) {
    return <div>Loading maze...</div>;
  }

  const [playerY, playerX] = playerPosition;

  return (
    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${maze[0].length}, 1fr)` }}>
      {maze.map((row, y) =>
        row.map((cell, x) => {
          const isVisible = !fogOfWar || Math.abs(y - playerY) <= 2 && Math.abs(x - playerX) <= 2;
          const isPlayer = y === playerY && x === playerX;

          return (
            <div
              key={`${y}-${x}`}
              className={`w-8 h-8 ${
                isVisible
                  ? isPlayer
                    ? 'bg-blue-500'
                    : cellColors[cell]
                  : 'bg-gray-900'
              }`}
            />
          );
        })
      )}
    </div>
  );
};

export default Maze;