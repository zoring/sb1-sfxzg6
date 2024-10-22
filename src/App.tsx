import React, { useState } from 'react';
import Game from './components/Game';
import LevelSelector from './components/LevelSelector';

function App() {
  const [currentLevel, setCurrentLevel] = useState(1);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8">多变迷宫探险</h1>
      <LevelSelector currentLevel={currentLevel} onLevelSelect={setCurrentLevel} />
      <Game level={currentLevel} />
    </div>
  );
}

export default App;