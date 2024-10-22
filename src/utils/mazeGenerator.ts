import { CellType, LevelConfig, PlayerPosition } from '../types';

export function generateMaze(config: LevelConfig): CellType[][] {
  const { width, height, itemsRequired, monsters, traps, portals, fogPercentage } = config;
  const maze: CellType[][] = Array(height).fill(null).map(() => Array(width).fill('wall'));

  function carve(x: number, y: number) {
    const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    directions.sort(() => Math.random() - 0.5);

    for (const [dx, dy] of directions) {
      const nx = x + dx * 2;
      const ny = y + dy * 2;

      if (nx >= 0 && nx < width && ny >= 0 && ny < height && maze[ny][nx] === 'wall') {
        maze[y + dy][x + dx] = 'path';
        maze[ny][nx] = 'path';
        carve(nx, ny);
      }
    }
  }

  maze[1][1] = 'path';
  carve(1, 1);

  // Set exit
  maze[height - 2][width - 2] = 'exit';

  // Add items
  addRandomElements(maze, 'item', itemsRequired);

  // Add monsters
  addRandomElements(maze, 'monster', monsters);

  // Add traps
  addRandomElements(maze, 'trap', traps);

  // Add portals
  addRandomElements(maze, 'portal', portals);

  // Add fog
  const fogCells = Math.floor((width * height * fogPercentage) / 100);
  addRandomElements(maze, 'fog', fogCells);

  return maze;
}

function addRandomElements(maze: CellType[][], elementType: CellType, count: number) {
  const height = maze.length;
  const width = maze[0].length;

  for (let i = 0; i < count; i++) {
    let x, y;
    do {
      x = Math.floor(Math.random() * width);
      y = Math.floor(Math.random() * height);
    } while (maze[y][x] !== 'path');
    maze[y][x] = elementType;
  }
}

export function getRandomPosition(maze: CellType[][]): PlayerPosition {
  const height = maze.length;
  const width = maze[0].length;
  let x, y;
  do {
    x = Math.floor(Math.random() * width);
    y = Math.floor(Math.random() * height);
  } while (maze[y][x] !== 'path');
  return [y, x];
}