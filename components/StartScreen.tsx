import React from 'react';

interface StartScreenProps {
  onStartGame: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStartGame }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-6 bg-slate-800 rounded-lg shadow-xl w-full max-w-md mx-auto">
      <h1 className="text-4xl sm:text-5xl font-bold text-sky-400 mb-3">宇宙船ゲーム</h1>

      <p className="text-slate-300 mb-6 text-base sm:text-lg">
        降ってくる宇宙のデブリをできるだけ長くよけ続けよう！レベルは徐々に上がっていきます🚀
      </p>
      <button
        onClick={onStartGame}
        className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg text-xl sm:text-2xl transition-colors duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
        aria-label="ゲーム開始"
      >
        ゲーム開始
      </button>
    </div>
  );
};

export default StartScreen;