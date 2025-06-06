import React, { useState, useEffect, useCallback } from 'react';
import { GameState } from './types';
import type { Player, Obstacle } from './types';
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  PLAYER_SPEED,
  PLAYER_INITIAL_Y,
  OBSTACLE_MIN_WIDTH,
  OBSTACLE_MAX_WIDTH,
  OBSTACLE_HEIGHT,
  OBSTACLE_COLORS,
  OBSTACLE_INITIAL_SPEED,
  OBSTACLE_SPEED_INCREMENT,
  OBSTACLE_SPAWN_INTERVAL,
  MIN_OBSTACLE_SPAWN_INTERVAL,
  MAX_OBSTACLE_SPEED,
  SCORE_INCREMENT
} from './constants';
import StartScreen from './components/StartScreen';
import GameOverScreen from './components/GameOverScreen';
import GameArea from './components/GameArea';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const [score, setScore] = useState<number>(0);
  const [player, setPlayer] = useState<Player>({
    x: (GAME_WIDTH - PLAYER_WIDTH) / 2,
    y: PLAYER_INITIAL_Y,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
  });
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [obstacleSpeed, setObstacleSpeed] = useState<number>(OBSTACLE_INITIAL_SPEED);
  const [currentSpawnInterval, setCurrentSpawnInterval] = useState<number>(OBSTACLE_SPAWN_INTERVAL);
  const [gameTime, setGameTime] = useState<number>(0);

  const resetGame = useCallback(() => {
    setPlayer({
      x: (GAME_WIDTH - PLAYER_WIDTH) / 2,
      y: PLAYER_INITIAL_Y,
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
    });
    setObstacles([]);
    setScore(0);
    setObstacleSpeed(OBSTACLE_INITIAL_SPEED);
    setCurrentSpawnInterval(OBSTACLE_SPAWN_INTERVAL);
    setGameTime(0);
  }, []);

  const startGame = () => {
    resetGame();
    setGameState(GameState.PLAYING);
  };

  const gameOver = useCallback(() => {
    setGameState(GameState.GAME_OVER);
  }, []);

  const movePlayerLeft = useCallback(() => {
    if (gameState !== GameState.PLAYING) return;
    setPlayer((prevPlayer) => ({
      ...prevPlayer,
      x: Math.max(0, prevPlayer.x - PLAYER_SPEED),
    }));
  }, [gameState]);

  const movePlayerRight = useCallback(() => {
    if (gameState !== GameState.PLAYING) return;
    setPlayer((prevPlayer) => ({
      ...prevPlayer,
      x: Math.min(GAME_WIDTH - PLAYER_WIDTH, prevPlayer.x + PLAYER_SPEED),
    }));
  }, [gameState]);


  // Player Movement Handler (Keyboard)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== GameState.PLAYING) return;

      if (e.key === 'ArrowLeft') {
        movePlayerLeft();
      } else if (e.key === 'ArrowRight') {
        movePlayerRight();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState, movePlayerLeft, movePlayerRight]);

  // Game Loop
  useEffect(() => {
    if (gameState !== GameState.PLAYING) return;

    const gameInterval = setInterval(() => {
      // Update game time
      setGameTime(prevTime => {
        const newTime = prevTime + 50;

        // Update spawn interval based on new time
        const timeBasedReduction = Math.floor(newTime / 5000) * 50; // Reduce by 50ms every 5 seconds
        const newSpawnInterval = Math.max(MIN_OBSTACLE_SPAWN_INTERVAL, OBSTACLE_SPAWN_INTERVAL - timeBasedReduction);
        setCurrentSpawnInterval(newSpawnInterval);

        return newTime;
      });

      // Move obstacles
      setObstacles((prevObstacles) =>
        prevObstacles
          .map((obs) => ({ ...obs, y: obs.y + obstacleSpeed }))
          .filter((obs) => obs.y < GAME_HEIGHT) // Remove off-screen obstacles
      );

      // Check collisions
      obstacles.forEach((obs) => {
        if (
          player.x < obs.x + obs.width &&
          player.x + player.width > obs.x &&
          player.y < obs.y + obs.height &&
          player.y + player.height > obs.y
        ) {
          gameOver();
        }
      });

      // Increase score
      setScore((prevScore) => prevScore + 1); // Simple time-based score part

      // Increase difficulty (obstacle speed)
      setObstacleSpeed(prevSpeed => Math.min(MAX_OBSTACLE_SPEED, prevSpeed + OBSTACLE_SPEED_INCREMENT / 100));

    }, 50); // Approx 20 FPS for smoother movement

    return () => clearInterval(gameInterval);
  }, [gameState, player, obstacles, obstacleSpeed, gameOver]);


  // Obstacle Spawner
  useEffect(() => {
    if (gameState !== GameState.PLAYING) return;

    const spawnInterval = setInterval(() => {
      console.log('Spawning obstacles at interval:', currentSpawnInterval, 'gameTime:', gameTime);

      // Calculate how many obstacles to spawn based on game time
      const baseSpawnCount = 1;
      const bonusSpawnChance = Math.floor(gameTime / 10000); // Every 10 seconds, increase chance of multiple spawns
      const spawnCount = Math.random() < (bonusSpawnChance * 0.1) ? baseSpawnCount + 1 : baseSpawnCount;

      console.log('Spawning', spawnCount, 'obstacles');

      for (let i = 0; i < spawnCount; i++) {
        const newObstacleWidth = Math.random() * (OBSTACLE_MAX_WIDTH - OBSTACLE_MIN_WIDTH) + OBSTACLE_MIN_WIDTH;
        const newObstacle: Obstacle = {
          id: Date.now().toString() + Math.random().toString() + i,
          x: Math.random() * (GAME_WIDTH - newObstacleWidth),
          y: -OBSTACLE_HEIGHT - (i * OBSTACLE_HEIGHT * 1.5), // Spread vertically if multiple
          width: newObstacleWidth,
          height: OBSTACLE_HEIGHT,
          color: OBSTACLE_COLORS[Math.floor(Math.random() * OBSTACLE_COLORS.length)],
        };
        setObstacles((prevObstacles) => [...prevObstacles, newObstacle]);
        setScore((prevScore) => prevScore + SCORE_INCREMENT); // Score for new obstacle appearing / surviving
      }
    }, currentSpawnInterval);

    return () => clearInterval(spawnInterval);
  }, [gameState, currentSpawnInterval]);


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-slate-100 p-4 pb-10">
      <div className="flex flex-col items-center justify-center flex-grow w-full">
        {gameState === GameState.IDLE && <StartScreen onStartGame={startGame} />}
        {gameState === GameState.PLAYING && (
          <>
            <div className="mb-2 text-2xl sm:text-3xl font-bold text-yellow-400" aria-live="polite">スコア: {score}</div>
            <div className="mb-2 text-sm text-cyan-400">
              レベル: {Math.floor(gameTime / 5000) + 1} |
              障害物スピード: {obstacleSpeed.toFixed(1)} |
              生成間隔: {currentSpawnInterval}ms
            </div>
            <GameArea player={player} obstacles={obstacles} />
            <div className="mt-4 flex justify-center space-x-4" role="group" aria-label="ゲーム操作">
              <button
                onClick={movePlayerLeft}
                className="px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg text-2xl transition-colors duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75"
                aria-label="左へ移動"
              >
                ←
              </button>
              <button
                onClick={movePlayerRight}
                className="px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg text-2xl transition-colors duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75"
                aria-label="右へ移動"
              >
                →
              </button>
            </div>
            <p className="mt-3 text-xs sm:text-sm text-slate-400">
              画面のボタンまたは <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">←</kbd> <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">→</kbd> キーで移動
            </p>
          </>
        )}
        {gameState === GameState.GAME_OVER && (
          <GameOverScreen
            score={score}
            onPlayAgain={startGame}
          />
        )}
      </div>
      <footer className="w-full text-center mt-auto pt-4 text-xs text-slate-500">
        Yuki Lab
      </footer>
    </div>
  );
};

export default App;
