import { useState, useEffect, useCallback } from "react";

export function useMouseParallax() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = useCallback((e: MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5);
    const y = (e.clientY / window.innerHeight - 0.5);
    setPos({ x, y });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, [handleMove]);

  return pos;
}
