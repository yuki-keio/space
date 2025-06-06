import React from 'react';

interface GameOverScreenProps {
  score: number;
  onPlayAgain: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, onPlayAgain }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-6 bg-slate-800 rounded-lg shadow-xl w-full max-w-md mx-auto">
      <h2 className="text-3xl sm:text-4xl font-bold text-red-500 mb-3">ゲームオーバー！</h2>
      <p className="text-slate-200 text-xl sm:text-2xl mb-4">
        あなたのスコア: <span className="font-bold text-yellow-400">{score}</span>
      </p>
      <button
        onClick={onPlayAgain}
        className="px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg text-xl sm:text-2xl transition-colors duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75"
        aria-label="もう一度プレイ"
      >
        もう一度プレイ
      </button>
    </div>
  );
};

export default GameOverScreen;