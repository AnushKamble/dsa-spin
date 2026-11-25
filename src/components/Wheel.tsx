import { useCallback, useEffect, useRef, useState } from "react";
import type { Difficulty, NumberedProblem } from "../types";
import { randomInt } from "../lib/random";
import { playResult, playSpinStart, playTick, primeAudio } from "../lib/sounds";

const SIZE = 560;
const TAU = Math.PI * 2;
const TICK_RADIANS = 0.5;
const TICK_MIN_INTERVAL_MS = 42;

const DIFFICULTY_COLORS: Record<Difficulty, [string, string]> = {
  Easy: ["#1f9d63", "#178a55"],
  Medium: ["#f0a726", "#d9921c"],
  Hard: ["#ef4a5b", "#d63e4e"],
};

const PALETTE_FALLBACK: [string, string] = ["#4f6cff", "#3b53e6"];

interface WheelProps {
  problems: NumberedProblem[];
  onResult: (problem: NumberedProblem) => void;
}

export function Wheel({ problems, onResult }: WheelProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rotationRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [spinning, setSpinning] = useState(false);

  const draw = useCallback(
    (rotation: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      if (canvas.width !== SIZE * dpr) {
        canvas.width = SIZE * dpr;
        canvas.height = SIZE * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, SIZE, SIZE);

      const cx = SIZE / 2;
      const cy = SIZE / 2;
      const radius = SIZE / 2 - 22;
      const count = problems.length;
      const seg = count > 0 ? TAU / count : TAU;
      const showLabels = count >= 1 && count <= 48;

      ctx.save();
      ctx.translate(cx, cy);

      // outer glow ring
      ctx.beginPath();
      ctx.arc(0, 0, radius + 8, 0, TAU);
      ctx.strokeStyle = "rgba(109,139,255,0.35)";
      ctx.lineWidth = 6;
      ctx.stroke();

      ctx.save();
      ctx.rotate(rotation);

      for (let i = 0; i < count; i++) {
        const start = i * seg;
        const end = start + seg;
        const difficulty = problems[i].difficulty;
        const pair = DIFFICULTY_COLORS[difficulty] ?? PALETTE_FALLBACK;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, start, end);
        ctx.closePath();
        ctx.fillStyle = pair[i % 2];
        ctx.fill();
        if (count <= 80) {
          ctx.strokeStyle = "rgba(7,10,19,0.55)";
          ctx.lineWidth = Math.max(0.5, 2 - count / 60);
          ctx.stroke();
        }
      }

      if (showLabels) {
        ctx.fillStyle = "#fff";
        ctx.font = `600 ${count > 32 ? 11 : 13}px ui-sans-serif, system-ui, sans-serif`;
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "rgba(0,0,0,0.55)";
        ctx.shadowBlur = 3;
        for (let i = 0; i < count; i++) {
          const mid = i * seg + seg / 2;
          ctx.save();
          ctx.rotate(mid);
          ctx.fillText(String(problems[i].number), radius - 10, 0);
          ctx.restore();
        }
        ctx.shadowBlur = 0;
      }

      ctx.restore();

      // hub
      ctx.beginPath();
      ctx.arc(0, 0, 44, 0, TAU);
      ctx.fillStyle = "#0b1020";
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(109,139,255,0.6)";
      ctx.stroke();

      ctx.fillStyle = "#aab8ff";
      ctx.font = "700 12px ui-sans-serif, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(count === 0 ? "ALL DONE" : "SPIN", 0, -6);
      ctx.fillStyle = "#5f6ea8";
      ctx.font = "600 10px ui-sans-serif, system-ui, sans-serif";
      ctx.fillText(count === 0 ? "0 left" : `${count} left`, 0, 12);

      // pointer at top
      const pointerY = -radius - 6;
      ctx.beginPath();
      ctx.moveTo(-14, pointerY - 16);
      ctx.lineTo(14, pointerY - 16);
      ctx.lineTo(0, pointerY + 14);
      ctx.closePath();
      ctx.fillStyle = "#e6ebff";
      ctx.shadowColor = "rgba(230,235,255,0.7)";
      ctx.shadowBlur = 14;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.restore();
    },
    [problems],
  );

  useEffect(() => {
    draw(rotationRef.current);
  }, [draw]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const spin = useCallback(() => {
    const count = problems.length;
    if (spinning || count < 1) return;

    const index = randomInt(count);
    const seg = TAU / count;
    const base = -Math.PI / 2 - (index + 0.5) * seg;
    const current = rotationRef.current;
    const minSpins = 5 + randomInt(3);
    const target = base + TAU * Math.ceil((current + TAU * minSpins - base) / TAU);
    const duration = 4200 + Math.random() * 700;
    const start = current;
    const startTime = performance.now();
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    primeAudio();
    playSpinStart();
    setSpinning(true);

    let lastTickAngle = start;
    let lastTickTime = startTime;

    const tick = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      const angle = start + (target - start) * easeOutCubic(t);
      rotationRef.current = angle;

      if (
        angle - lastTickAngle >= TICK_RADIANS &&
        now - lastTickTime >= TICK_MIN_INTERVAL_MS
      ) {
        playTick();
        lastTickAngle = angle;
        lastTickTime = now;
      }

      draw(angle);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
        setSpinning(false);
        playResult();
        onResult(problems[index]);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [problems, spinning, draw, onResult]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative mx-auto w-full max-w-[min(430px,40vh)]">
        <canvas
          ref={canvasRef}
          className="block h-auto w-full select-none"
          style={{ aspectRatio: "1 / 1" }}
          aria-label="Question selection wheel"
        />
      </div>
      <button
        type="button"
        onClick={spin}
        disabled={spinning || problems.length === 0}
        className="mt-4 w-full max-w-[320px] cursor-pointer rounded-xl bg-gradient-to-b from-brand-500 to-brand-600 px-6 py-2.5 text-sm font-bold tracking-wide text-white shadow-[0_10px_30px_-8px_rgba(79,108,255,0.8)] transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {spinning
          ? "Spinning…"
          : problems.length === 0
            ? "All questions completed"
            : "Spin the wheel"}
      </button>
      <p className="mt-2 text-xs text-white/45">
        {problems.length === 0
          ? "Nothing left in this set — reset or undo to spin again."
          : `Picking from ${problems.length} remaining ${
              problems.length === 1 ? "question" : "questions"
            }`}
      </p>
    </div>
  );
}
