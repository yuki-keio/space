
import React from 'react';
import type { Player, Obstacle } from '../types';
import { GAME_WIDTH, GAME_HEIGHT, PLAYER_COLOR } from '../constants';

interface GameAreaProps {
  player: Player;
  obstacles: Obstacle[];
}

const GameArea: React.FC<GameAreaProps> = ({ player, obstacles }) => {
  return (
    <div
      className="relative border-2 border-slate-700 bg-gradient-to-b from-slate-800 to-slate-900 overflow-hidden shadow-2xl rounded-lg"
      style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
    >
      {/* Player */}
      <div
        className={`absolute ${PLAYER_COLOR} rounded transition-all duration-50 ease-linear`}
        style={{
          left: player.x,
          top: player.y,
          width: player.width,
          height: player.height,
          boxShadow: '0 0 10px #06b6d4, 0 0 20px #06b6d4' // cyan-400 glow
        }}
      />

      {/* Obstacles */}
      {obstacles.map((obstacle) => (
        <div
          key={obstacle.id}
          className={`absolute ${obstacle.color} rounded`}
          style={{
            left: obstacle.x,
            top: obstacle.y,
            width: obstacle.width,
            height: obstacle.height,
            boxShadow: `0 0 8px ${obstacle.color.replace('bg-', '').split('-')[0]}-300`
          }}
        />
      ))}
    </div>
  );
};

export default GameArea;
