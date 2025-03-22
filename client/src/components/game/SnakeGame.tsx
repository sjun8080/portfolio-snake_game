import { useEffect, useState } from "react";
import GameCanvas from "./GameCanvas";
import useSnakeGame from "./useSnakeGame";
import { useAudio } from "@/lib/stores/useAudio";

const WIDTH = 600;
const HEIGHT = 600;
const BLOCK_SIZE = 20;

const SnakeGame = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { hitSound, setHitSound, toggleMute, isMuted } = useAudio();
  
  const {
    snake,
    food,
    gameIsOn,
    score,
    handleKeyDown,
    startGame,
    gameOver
  } = useSnakeGame({
    width: WIDTH,
    height: HEIGHT,
    blockSize: BLOCK_SIZE,
    initialSpeed: 10
  });

  // Initialize game components
  useEffect(() => {
    // Set up keyboard event listeners
    window.addEventListener("keydown", handleKeyDown);
    
    // Initialize sound effects
    if (!hitSound) {
      const sound = new Audio("/sounds/hit.mp3");
      setHitSound(sound);
    }
    
    setIsInitialized(true);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown, hitSound, setHitSound]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 text-center">
        <h1 className="text-2xl font-bold mb-2">Snake Game</h1>
        <p className="text-sm text-gray-600 mb-2">Use arrow keys to control the snake. Press space to start.</p>
        <div className="flex justify-between items-center">
          <div className="text-md font-semibold">Score: {score}</div>
          <button 
            onClick={toggleMute} 
            className="ml-4 px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
          >
            {isMuted ? "🔇 Unmute" : "🔊 Mute"}
          </button>
        </div>
      </div>
      
      <div className="border-4 border-gray-800 relative">
        <GameCanvas 
          width={WIDTH}
          height={HEIGHT}
          blockSize={BLOCK_SIZE}
          snake={snake}
          food={food}
          gameIsOn={gameIsOn}
        />
        
        {gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-white text-center">
              <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
              <p className="mb-4">Your score: {score}</p>
              <button
                onClick={startGame}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded font-semibold"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
        
        {!gameIsOn && !gameOver && isInitialized && (
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="text-white text-center">
              <h2 className="text-2xl font-bold mb-4">Snake Game</h2>
              <p className="mb-4">Press SPACE to Start</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SnakeGame;
