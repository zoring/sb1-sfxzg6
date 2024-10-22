import React from 'react';

interface LevelSelectorProps {
  currentLevel: number;
  onLevelSelect: (level: number) => void;
}

const LevelSelector: React.FC<LevelSelectorProps> = ({ currentLevel, onLevelSelect }) => {
  const levels = [1, 2, 3, 4, 5];

  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold mb-2">Select Level:</h2>
      <div className="flex space-x-2">
        {levels.map((level) => (
          <button
            key={level}
            onClick={() => onLevelSelect(level)}
            className={`px-4 py-2 rounded ${
              currentLevel === level ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'
            }`}
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LevelSelector;