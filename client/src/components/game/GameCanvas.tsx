import { useRef, useEffect } from "react";
import useGameLoop from "./useGameLoop";

// Color constants
const WHITE = "#FFFFFF";
const GREEN = "#00FF00";
const RED = "#FF0000";
const BLACK = "#000000";

interface GameCanvasProps {
  width: number;
  height: number;
  blockSize: number;
  snake: [number, number][];
  food: [number, number];
  gameIsOn: boolean;
}

const GameCanvas = ({ width, height, blockSize, snake, food, gameIsOn }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Render loop
  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = WHITE;
    ctx.fillRect(0, 0, width, height);

    // Only draw game elements if the game is running
    if (gameIsOn) {
      // Draw snake
      ctx.fillStyle = GREEN;
      for (const segment of snake) {
        ctx.fillRect(segment[0], segment[1], blockSize, blockSize);
      }

      // Draw food
      ctx.fillStyle = RED;
      ctx.fillRect(food[0], food[1], blockSize, blockSize);
    }
  };

  // Set up game loop
  useGameLoop(render);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Initial canvas setup
    ctx.fillStyle = WHITE;
    ctx.fillRect(0, 0, width, height);
    
    if (!gameIsOn) {
      // Draw "Press Space to Start" message
      ctx.fillStyle = BLACK;
      ctx.font = "24px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Press SPACE to Start", width / 2, height / 2);
    }
  }, [width, height, gameIsOn]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="block"
    />
  );
};

export default GameCanvas;
