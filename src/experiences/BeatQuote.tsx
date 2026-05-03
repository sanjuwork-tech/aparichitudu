import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Beat } from "@/data/realms";

interface Props {
  beat: Beat;
  theme: { glow: string; color: string };
}

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export function BeatQuote({ beat, theme }: Props) {
  const isFinal = beat.quote === "OM TAT SAT";
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [reflectCount, setReflectCount] = useState(0);
  const [nextId, setNextId] = useState(0);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = nextId;
    setNextId((n) => n + 1);
    setRipples((r) => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setReflectCount((c) => c + 1);
    setTimeout(() => setRipples((r) => r.filter((rip) => rip.id !== id)), 2200);
  }, [nextId]);

  return (
    <div
      className="relative flex flex-col items-center justify-center h-full px-8 md:px-24 text-center overflow-hidden"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      {/* Ripples */}
      <AnimatePresence>
        {ripples.map((rip) => (
          <motion.div
            key={rip.id}
            className="absolute rounded-full pointer-events-none"
            initial={{ width: 0, height: 0, opacity: 0.5, left: rip.x, top: rip.y, translateX: "-50%", translateY: "-50%" }}
            animate={{ width: 500, height: 500, opacity: 0 }}
            exit={{}}
            transition={{ duration: 2.0, ease: "easeOut" }}
            style={{
              border: `1px solid ${theme.color}80`,
              boxShadow: `0 0 30px ${theme.glow}`,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Second inner ripple */}
      <AnimatePresence>
        {ripples.map((rip) => (
          <motion.div
            key={`inner-${rip.id}`}
            className="absolute rounded-full pointer-events-none"
            initial={{ width: 0, height: 0, opacity: 0.3, left: rip.x, top: rip.y, translateX: "-50%", translateY: "-50%" }}
            animate={{ width: 200, height: 200, opacity: 0 }}
            exit={{}}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
            style={{ border: `1px solid ${theme.color}`, }}
          />
        ))}
      </AnimatePresence>

      {/* Opening quote mark */}
      <motion.span
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.25, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="font-serif absolute top-1/4 left-1/2 -translate-x-1/2 select-none pointer-events-none"
        style={{ fontSize: "20rem", color: theme.color, lineHeight: 1, marginTop: "-6rem" }}
      >
        "
      </motion.span>

      {/* Quote text */}
      {isFinal ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 2.5, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center gap-6"
        >
          <motion.p
            className="font-serif font-bold tracking-[0.6em]"
            animate={{
              filter: reflectCount > 0
                ? [`drop-shadow(0 0 40px ${theme.glow}) drop-shadow(0 0 80px ${theme.glow})`,
                   `drop-shadow(0 0 70px ${theme.glow}) drop-shadow(0 0 140px ${theme.glow})`,
                   `drop-shadow(0 0 40px ${theme.glow}) drop-shadow(0 0 80px ${theme.glow})`]
                : `drop-shadow(0 0 40px ${theme.glow}) drop-shadow(0 0 80px ${theme.glow})`,
            }}
            key={reflectCount}
            transition={{ duration: 1.5 }}
            style={{
              fontSize: "clamp(3rem, 12vw, 10rem)",
              color: theme.color,
            }}
          >
            OM TAT SAT
          </motion.p>
          <p className="font-sans text-xs tracking-[0.5em] text-foreground/30">ॐ तत् सत्</p>
        </motion.div>
      ) : (
        <motion.blockquote
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            color: reflectCount > 0
              ? ["rgba(255,255,255,0.85)", "rgba(255,255,255,1)", "rgba(255,255,255,0.85)"]
              : "rgba(255,255,255,0.85)",
          }}
          key={reflectCount}
          transition={{ duration: 1.2, delay: reflectCount === 0 ? 0.2 : 0, ease: "easeOut" }}
          className="relative z-10 font-serif text-xl md:text-3xl lg:text-4xl leading-relaxed max-w-4xl"
          style={{ color: "rgba(255,255,255,0.85)" }}
        >
          {beat.quote}
        </motion.blockquote>
      )}

      {/* Attribution */}
      {beat.attribution && !isFinal && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.45 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="relative z-10 font-sans text-xs tracking-[0.4em] uppercase mt-10"
          style={{ color: theme.color }}
        >
          — {beat.attribution}
        </motion.p>
      )}

      {/* Tap hint */}
      <AnimatePresence>
        {reflectCount === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ delay: 2.2, duration: 0.8 }}
            className="absolute bottom-10 font-sans text-[9px] tracking-[0.45em] uppercase pointer-events-none"
            style={{ color: `${theme.color}25` }}
          >
            Tap to meditate
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
