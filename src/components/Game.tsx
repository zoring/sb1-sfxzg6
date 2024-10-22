import React, { useState, useEffect } from 'react';
import { Clock, Package, Ghost } from 'lucide-react';
import Maze from './Maze';
import { generateMaze, getRandomPosition } from '../utils/mazeGenerator';
import { GameState, LevelConfig, PlayerPosition } from '../types';

const levelConfigs: Record<number, LevelConfig> = {
  1: { width: 15, height: 15, timeLimit: 60, itemsRequired: 0, monsters: 0, traps: 5, portals: 0, fogPercentage: 0 },
  2: { width: 20, height: 20, timeLimit: 120, itemsRequired: 5, monsters: 0, traps: 10, portals: 2, fogPercentage: 0 },
  3: { width: 25, height: 25, timeLimit: 180, itemsRequired: 0, monsters: 3, traps: 15, portals: 3, fogPercentage: 0 },
  4: { width: 30, height: 30, timeLimit: 300, itemsRequired: 0, monsters: 0, traps: 0, portals: 0, fogPercentage: 0 },
  5: { width: 35, height: 35, timeLimit: 360, itemsRequired: 10, monsters: 5, traps: 20, portals: 5, fogPercentage: 30 },
};

interface GameProps {
  level: number;
}

const Game: React.FC<GameProps> = ({ level }) => {
  const [gameState, setGameState] = useState<GameState>({
    maze: [],
    playerPosition: [1, 1],
    timeLeft: 60,
    items: 0,
    monsters: [],
    portals: [],
    fogAreas: [],
    gameStatus: 'playing',
  });

  useEffect(() => {
    const config = levelConfigs[level];
    const newMaze = generateMaze(config);
    const playerPosition = getRandomPosition(newMaze);
    const monsters = Array(config.monsters).fill(null).map(() => getRandomPosition(newMaze));
    const portals = Array(config.portals).fill(null).map(() => getRandomPosition(newMaze));

    setGameState({
      maze: newMaze,
      playerPosition,
      timeLeft: config.timeLimit,
      items: 0,
      monsters,
      portals,
      fogAreas: [],
      gameStatus: 'playing',
    });
  }, [level]);

  useEffect(() => {
    if (gameState.gameStatus !== 'playing') return;

    const timer = setInterval(() => {
      setGameState((prevState) => ({
        ...prevState,
        timeLeft: prevState.timeLeft - 1,
        gameStatus: prevState.timeLeft <= 1 ? 'lost' : prevState.gameStatus,
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.gameStatus]);

  const handleMove = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameState.gameStatus !== 'playing') return;

    setGameState((prevState) => {
      const [y, x] = prevState.playerPosition;
      let newY = y;
      let newX = x;

      switch (direction) {
        case 'up': newY--; break;
        case 'down': newY++; break;
        case 'left': newX--; break;
        case 'right': newX++; break;
      }

      if (newY < 0 || newY >= prevState.maze.length || newX < 0 || newX >= prevState.maze[0].length) {
        return prevState;
      }

      const cell = prevState.maze[newY][newX];
      if (cell === 'wall') return prevState;

      let newState = { ...prevState, playerPosition: [newY, newX] as PlayerPosition };

      switch (cell) {
        case 'exit':
          if (level === 2 && prevState.items < levelConfigs[2].itemsRequired) {
            return prevState;
          }
          newState.gameStatus = 'won';
          break;
        case 'item':
          newState.items++;
          newState.maze[newY][newX] = 'path';
          break;
        case 'trap':
          newState.gameStatus = 'lost';
          break;
        case 'monster':
          newState.gameStatus = 'lost';
          break;
        case 'portal':
          const otherPortal = newState.portals.find(p => p[0] !== newY || p[1] !== newX);
          if (otherPortal) {
            newState.playerPosition = otherPortal;
          }
          break;
      }

      // Move monsters
      if (level === 3) {
        newState.monsters = newState.monsters.map(([my, mx]) => {
          const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
          const validMoves = directions
            .map(([dy, dx]) => [my + dy, mx + dx] as PlayerPosition)
            .filter(([y, x]) => newState.maze[y][x] !== 'wall');
          return validMoves[Math.floor(Math.random() * validMoves.length)];
        });

        if (newState.monsters.some(([my, mx]) => my === newY && mx === newX)) {
          newState.gameStatus = 'lost';
        }
      }

      return newState;
    });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 flex items-center space-x-4">
        <div className="flex items-center">
          <Clock className="mr-2" />
          <span className="text-xl font-bold">{gameState.timeLeft}s</span>
        </div>
        {level === 2 && (
          <div className="flex items-center">
            <Package className="mr-2" />
            <span className="text-xl font-bold">{gameState.items}/{levelConfigs[2].itemsRequired}</span>
          </div>
        )}
        {level === 3 && (
          <div className="flex items-center">
            <Ghost className="mr-2" />
            <span className="text-xl font-bold">{gameState.monsters.length}</span>
          </div>
        )}
      </div>
      <Maze maze={gameState.maze} playerPosition={gameState.playerPosition} fogOfWar={level === 5} />
      <div className="mt-4 grid grid-cols-3 gap-2">
        <button onClick={() => handleMove('up')} className="px-4 py-2 bg-blue-500 rounded">Up</button>
        <button onClick={() => handleMove('left')} className="px-4 py-2 bg-blue-500 rounded">Left</button>
        <button onClick={() => handleMove('right')} className="px-4 py-2 bg-blue-500 rounded">Right</button>
        <button onClick={() => handleMove('down')} className="px-4 py-2 bg-blue-500 rounded">Down</button>
      </div>
      {gameState.gameStatus === 'won' && (
        <div className="mt-4 text-2xl font-bold text-green-500">You won!</div>
      )}
      {gameState.gameStatus === 'lost' && (
        <div className="mt-4 text-2xl font-bold text-red-500">Game Over!</div>
      )}
    </div>
  );
};

export default Game;