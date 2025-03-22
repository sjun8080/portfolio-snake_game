import { useState, useCallback, useEffect } from 'react';
import { useAudio } from '@/lib/stores/useAudio';

interface SnakeGameOptions {
  width: number;
  height: number;
  blockSize: number;
  initialSpeed: number;
}

interface Direction {
  x: number;
  y: number;
}

type Position = [number, number];

export default function useSnakeGame({
  width,
  height,
  blockSize,
  initialSpeed
}: SnakeGameOptions) {
  // Game state
  const [snake, setSnake] = useState<Position[]>([
    [300, 300], 
    [280, 300], 
    [260, 300]
  ]);
  const [direction, setDirection] = useState<Direction>({ x: blockSize, y: 0 });
  const [food, setFood] = useState<Position>([
    Math.floor(Math.random() * (width / blockSize)) * blockSize,
    Math.floor(Math.random() * (height / blockSize)) * blockSize
  ]);
  const [gameIsOn, setGameIsOn] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [speed, setSpeed] = useState(initialSpeed);
  const [score, setScore] = useState(0);
  const [lastUpdateTime, setLastUpdateTime] = useState(0);
  
  const { playHit } = useAudio();

  // Generate a new random food position
  const generateFood = useCallback((): Position => {
    const newX = Math.floor(Math.random() * (width / blockSize)) * blockSize;
    const newY = Math.floor(Math.random() * (height / blockSize)) * blockSize;
    
    // Ensure food doesn't spawn on the snake
    if (snake.some(segment => segment[0] === newX && segment[1] === newY)) {
      return generateFood();
    }
    
    return [newX, newY];
  }, [snake, width, height, blockSize]);

  // Handle keyboard input
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Start the game when space is pressed
    if (event.code === 'Space') {
      if (gameOver) {
        setGameOver(false);
        setSnake([
          [300, 300],
          [280, 300],
          [260, 300]
        ]);
        setDirection({ x: blockSize, y: 0 });
        setFood(generateFood());
        setScore(0);
        setGameIsOn(true);
      } else {
        setGameIsOn(true);
      }
      return;
    }

    // Change direction based on arrow keys
    if (gameIsOn) {
      switch (event.code) {
        case 'ArrowUp':
          if (direction.y !== blockSize) { // Not moving down
            setDirection({ x: 0, y: -blockSize });
          }
          break;
        case 'ArrowDown':
          if (direction.y !== -blockSize) { // Not moving up
            setDirection({ x: 0, y: blockSize });
          }
          break;
        case 'ArrowLeft':
          if (direction.x !== blockSize) { // Not moving right
            setDirection({ x: -blockSize, y: 0 });
          }
          break;
        case 'ArrowRight':
          if (direction.x !== -blockSize) { // Not moving left
            setDirection({ x: blockSize, y: 0 });
          }
          break;
      }
    }
  }, [blockSize, direction, gameIsOn, gameOver, generateFood]);

  // Start game function
  const startGame = useCallback(() => {
    if (gameOver) {
      setGameOver(false);
      setSnake([
        [300, 300],
        [280, 300],
        [260, 300]
      ]);
      setDirection({ x: blockSize, y: 0 });
      setFood(generateFood());
      setScore(0);
    }
    setGameIsOn(true);
  }, [blockSize, gameOver, generateFood]);

  // Game update function - called on each frame
  const updateGame = useCallback(() => {
    if (!gameIsOn) return;
    
    const now = performance.now();
    if (now - lastUpdateTime < 1000 / speed) return;
    setLastUpdateTime(now);
    
    // Calculate new head position
    const head = snake[0];
    const newHead: Position = [
      head[0] + direction.x,
      head[1] + direction.y
    ];
    
    // Check for collisions with walls
    if (
      newHead[0] < 0 || 
      newHead[0] >= width || 
      newHead[1] < 0 || 
      newHead[1] >= height
    ) {
      setGameIsOn(false);
      setGameOver(true);
      return;
    }
    
    // Check for collisions with self
    if (snake.slice(1).some(segment => segment[0] === newHead[0] && segment[1] === newHead[1])) {
      setGameIsOn(false);
      setGameOver(true);
      return;
    }
    
    // Create new snake array
    const newSnake = [newHead, ...snake.slice(0, -1)];
    
    // Check if snake ate the food
    if (newHead[0] === food[0] && newHead[1] === food[1]) {
      // Add segment to snake (don't remove the last segment)
      newSnake.push(snake[snake.length - 1]);
      
      // Generate new food
      setFood(generateFood());
      
      // Increment score
      setScore(prevScore => prevScore + 1);
      
      // Play sound
      playHit();
      
      // Increase speed slightly for difficulty
      if (speed < 20) {
        setSpeed(prevSpeed => prevSpeed + 0.2);
      }
    }
    
    // Update snake position
    setSnake(newSnake);
  }, [
    gameIsOn, 
    snake, 
    direction, 
    food, 
    width, 
    height, 
    speed, 
    lastUpdateTime, 
    generateFood,
    playHit
  ]);
  
  // Set up game update loop
  useEffect(() => {
    const gameLoop = setInterval(updateGame, 1000 / speed);
    return () => clearInterval(gameLoop);
  }, [updateGame, speed]);

  return {
    snake,
    food,
    gameIsOn,
    gameOver,
    score,
    handleKeyDown,
    startGame
  };
}
