
export const GAME_WIDTH = 300;
export const GAME_HEIGHT = 360; // Reduced height to better fit common screens

export const PLAYER_WIDTH = 40;
export const PLAYER_HEIGHT = 20;
export const PLAYER_COLOR = 'bg-cyan-400'; // Tailwind class
export const PLAYER_SPEED = 25; // Pixels per key press
export const PLAYER_INITIAL_Y = GAME_HEIGHT - PLAYER_HEIGHT - 20; // Positioned near the bottom (360 - 20 - 20 = 320)

export const OBSTACLE_MIN_WIDTH = 30;
export const OBSTACLE_MAX_WIDTH = 50;
export const OBSTACLE_HEIGHT = 20;
export const OBSTACLE_COLORS = ['bg-pink-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-600']; // Tailwind classes
export const OBSTACLE_INITIAL_SPEED = 5;
export const OBSTACLE_SPEED_INCREMENT = 0.8; // Speed increases more aggressively over time
export const OBSTACLE_SPAWN_INTERVAL = 1200; // Milliseconds (starting interval)
export const MIN_OBSTACLE_SPAWN_INTERVAL = 150; // Minimum spawn interval (maximum difficulty)
export const MAX_OBSTACLE_SPEED = 15; // Increased max speed

export const SCORE_INCREMENT = 10; // Score per obstacle dodged / per time unit