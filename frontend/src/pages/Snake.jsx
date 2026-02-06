import { useEffect, useRef, useState } from "react";

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIR = { x: 1, y: 0 };

export default function CyberSnake() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(randomFood());
  const [dir, setDir] = useState(INITIAL_DIR);
  const [running, setRunning] = useState(true);
  const [score, setScore] = useState(0);

  const boardRef = useRef(null);
  const dirRef = useRef(dir);

  dirRef.current = dir;

  function randomFood() {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  }

  // 🎮 Movimiento principal
  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setSnake((prev) => {
        const head = prev[0];
        const newHead = {
          x: (head.x + dirRef.current.x + GRID_SIZE) % GRID_SIZE,
          y: (head.y + dirRef.current.y + GRID_SIZE) % GRID_SIZE,
        };

        // 💥 Colisión con cuerpo
        if (prev.some((s) => s.x === newHead.x && s.y === newHead.y)) {
          setRunning(false);
          return prev;
        }

        let newSnake = [newHead, ...prev];

        // 🍎 Comer
        if (newHead.x === food.x && newHead.y === food.y) {
          setFood(randomFood());
          setScore((s) => s + 1);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [running, food]);

  // ⌨️ Teclado
  useEffect(() => {
    const handleKey = (e) => {
      const map = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        w: { x: 0, y: -1 },
        s: { x: 0, y: 1 },
        a: { x: -1, y: 0 },
        d: { x: 1, y: 0 },
      };

      if (map[e.key]) setDir(map[e.key]);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // 🖱️ Mouse (dirección según posición)
  const handleMouseMove = (e) => {
    const rect = boardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    if (Math.abs(dx) > Math.abs(dy)) {
      setDir(dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 });
    } else {
      setDir(dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-cyan-400">
      <h1 className="text-3xl font-bold mb-4 neon-text">
        CYBER SNAKE
      </h1>

      <p className="mb-2 text-sm">Score: {score}</p>

      <div
        ref={boardRef}
        onMouseMove={handleMouseMove}
        onClick={() => setRunning((r) => !r)}
        className="relative border border-cyan-500 shadow-[0_0_20px_#22d3ee]"
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
        }}
      >
        {/* 🐍 Snake */}
        {snake.map((s, i) => (
          <div
            key={i}
            className="absolute bg-cyan-400 shadow-[0_0_10px_#22d3ee]"
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              left: s.x * CELL_SIZE,
              top: s.y * CELL_SIZE,
            }}
          />
        ))}

        {/* 🍎 Food */}
        <div
          className="absolute bg-pink-500 animate-pulse shadow-[0_0_15px_#ec4899]"
          style={{
            width: CELL_SIZE,
            height: CELL_SIZE,
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
          }}
        />
      </div>

      {!running && (
        <p className="mt-4 text-red-400 animate-pulse">
          GAME OVER – Click para reanudar
        </p>
      )}
    </div>
  );
}
