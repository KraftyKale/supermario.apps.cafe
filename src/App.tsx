/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';
import { Game } from './game';
import { LOGICAL_WIDTH, LOGICAL_HEIGHT } from './input';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // disable image smoothing
    ctx.imageSmoothingEnabled = false;

    const game = new Game();
    let lastTime = performance.now();
    let frameId: number;

    function loop(time: number) {
      // Delta time in 60fps frames (approx)
      let dt = (time - lastTime) / (1000 / 60);
      if (dt < 0 || isNaN(dt)) dt = 0;
      lastTime = time;

      // Cap at reasonable dt to avoid physics exploding during lag
      game.update(Math.min(dt, 2));
      game.draw(ctx!);

      frameId = requestAnimationFrame(loop);
    }

    frameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div
      className="min-h-screen bg-[#5C94FC] flex flex-col items-center justify-center p-4 overflow-hidden"
      style={{ fontFamily: "'Courier New', Courier, monospace" }}
    >
      <div className="bg-[rgba(0,0,0,0.8)] border-[10px] border-white px-[80px] py-[40px] text-center text-white z-50 flex flex-col items-center shadow-[16px_16px_0_rgba(0,0,0,0.3)]">
        <h1 className="text-[48px] mb-[30px] tracking-[4px] uppercase font-bold drop-shadow-[4px_4px_0_#000]">
          Super Retro Bros
        </h1>
        <div className="relative border-8 border-[#000] bg-black shadow-[8px_8px_0_rgba(0,0,0,0.5)] overflow-hidden">
          <canvas
            ref={canvasRef}
            width={LOGICAL_WIDTH}
            height={LOGICAL_HEIGHT}
            className="block"
            style={{
              width: `${LOGICAL_WIDTH * 2}px`,
              height: `${LOGICAL_HEIGHT * 2}px`,
              imageRendering: 'pixelated',
            }}
          />
        </div>
        <p className="text-[#F8B800] mt-[30px] text-[20px] uppercase before:content-['▶_'] cursor-pointer hover:opacity-90 transition-opacity drop-shadow-[2px_2px_0_#000]">
          Click the game to focus. Use Arrow Keys/WASD to move, Space/Z to jump.
        </p>
      </div>
    </div>
  );
}
