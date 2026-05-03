import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
  color: string;
  type: "ember" | "ash" | "lotus";
}

interface ParticleCanvasProps {
  intensity?: "hell" | "ceremony" | "liberation" | "ambient";
  className?: string;
}

function makeParticle(w: number, h: number, type: ParticleCanvasProps["intensity"]): Particle {
  const isLotus = type === "liberation";
  const isAsh = type === "ceremony";
  const life = 60 + Math.random() * 180;
  const colors = isLotus
    ? ["rgba(255,220,100,", "rgba(180,220,255,", "rgba(255,255,200,"]
    : isAsh
    ? ["rgba(200,160,80,", "rgba(180,130,60,", "rgba(160,120,50,"]
    : ["rgba(255,100,20,", "rgba(255,60,10,", "rgba(255,140,30,", "rgba(200,40,10,"];
  return {
    x: Math.random() * w,
    y: isLotus ? h + 10 : h * 0.4 + Math.random() * h * 0.6,
    vx: (Math.random() - 0.5) * (isLotus ? 0.6 : 0.8),
    vy: isLotus ? -(0.5 + Math.random() * 1.2) : -(0.4 + Math.random() * 1.0),
    size: isLotus ? 2 + Math.random() * 3 : 1 + Math.random() * 2.5,
    opacity: 0,
    life: 0,
    maxLife: life,
    color: colors[Math.floor(Math.random() * colors.length)],
    type: isLotus ? "lotus" : isAsh ? "ash" : "ember",
  };
}

export function ParticleCanvas({ intensity = "ambient", className = "" }: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const count = intensity === "hell" ? 60 : intensity === "liberation" ? 50 : intensity === "ceremony" ? 35 : 25;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    particlesRef.current = Array.from({ length: count }, () =>
      makeParticle(canvas.width, canvas.height, intensity)
    );
    particlesRef.current.forEach(p => { p.life = Math.random() * p.maxLife; });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach((p, i) => {
        p.life++;
        if (p.life >= p.maxLife) {
          particlesRef.current[i] = makeParticle(canvas.width, canvas.height, intensity);
          return;
        }
        const t = p.life / p.maxLife;
        p.opacity = t < 0.15 ? t / 0.15 : t > 0.75 ? (1 - t) / 0.25 : 1;
        p.x += p.vx + Math.sin(p.life * 0.04) * 0.3;
        p.y += p.vy;
        p.vy *= 0.999;

        ctx.save();
        ctx.globalAlpha = p.opacity * (intensity === "ambient" ? 0.45 : 0.7);

        if (p.type === "lotus") {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
          grad.addColorStop(0, p.color + "0.9)");
          grad.addColorStop(1, p.color + "0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fill();
        } else {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
          grad.addColorStop(0, p.color + "1)");
          grad.addColorStop(0.5, p.color + "0.6)");
          grad.addColorStop(1, p.color + "0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "rgba(255,255,255,0.8)";
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.3, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ zIndex: 2 }}
    />
  );
}
