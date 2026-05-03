import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Beat } from "@/data/realms";

interface Props {
  beat: Beat;
  theme: { glow: string; color: string };
}

interface Pulse {
  id: number;
  x: number;
  y: number;
}

export function BeatScene({ beat, theme }: Props) {
  const [pulses, setPulses] = useState<Pulse[]>([]);
  const [breathCount, setBreathCount] = useState(0);
  const [nextId, setNextId] = useState(0);
  const words = beat.headline?.split(" ") ?? [];

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPulses((p) => [...p, { id: nextId, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setNextId((n) => n + 1);
    setBreathCount((c) => c + 1);
    setTimeout(() => setPulses((p) => p.filter((pulse) => pulse.id !== nextId)), 1800);
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center h-full px-8 md:px-20 text-center overflow-hidden"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      {/* Dark content scrim so text always reads against any background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 85% 65% at 50% 52%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 70%, transparent 100%)",
        }}
      />
      {/* Ripple pulses at click point */}
      <AnimatePresence>
        {pulses.map((pulse) => (
          <motion.div
            key={pulse.id}
            className="absolute rounded-full pointer-events-none"
            initial={{ width: 0, height: 0, opacity: 0.6, x: pulse.x, y: pulse.y, translateX: "-50%", translateY: "-50%" }}
            animate={{ width: 340, height: 340, opacity: 0 }}
            exit={{}}
            transition={{ duration: 1.6, ease: "easeOut" }}
            style={{
              border: `1px solid ${theme.color}`,
              boxShadow: `0 0 20px ${theme.glow}`,
              left: 0,
              top: 0,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Background symbol — brightens on breathe */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
        aria-hidden
      >
        <motion.div
          className="font-serif font-bold select-none"
          style={{ fontSize: "40vw", color: theme.color, lineHeight: 1 }}
          animate={{
            opacity: breathCount > 0 ? [0.025, 0.08, 0.025] : 0.025,
            scale: breathCount > 0 ? [1, 1.04, 1] : 1,
          }}
          key={breathCount}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          ✦
        </motion.div>
      </motion.div>

      {/* Horizontal line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="h-px w-32 mb-10 relative z-10"
        style={{ background: `linear-gradient(to right, transparent, ${theme.color}50, transparent)` }}
      />

      {/* Headline — word by word, re-pulses on breath */}
      <h3
        className="font-serif font-bold mb-8 flex flex-wrap justify-center gap-x-4 relative z-10"
        style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)" }}
      >
        {words.map((word, i) => (
          <span key={i} className="overflow-hidden inline-block">
            <motion.span
              className="inline-block"
              initial={{ y: "110%", opacity: 0 }}
              animate={{
                y: 0,
                opacity: 1,
                filter: breathCount > 0
                  ? [
                      `drop-shadow(0 0 0px ${theme.glow}) drop-shadow(0 2px 6px rgba(0,0,0,0.95))`,
                      `drop-shadow(0 0 28px ${theme.glow}) drop-shadow(0 2px 6px rgba(0,0,0,0.95))`,
                      `drop-shadow(0 0 0px ${theme.glow}) drop-shadow(0 2px 6px rgba(0,0,0,0.95))`,
                    ]
                  : `drop-shadow(0 0 22px ${theme.glow}) drop-shadow(0 2px 6px rgba(0,0,0,0.95))`,
              }}
              key={`${word}-${breathCount}`}
              transition={{
                y: { duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.7, delay: i * 0.12 },
                filter: { duration: 1.2, delay: i * 0.05 },
              }}
              style={{ color: theme.color }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </h3>

      {/* Sub text */}
      {beat.sub && beat.sub.split(". ").map((sentence, i) => (
        <motion.p
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6 + i * 0.2, ease: "easeOut" }}
          className="relative z-10 font-sans font-light text-base md:text-xl max-w-2xl leading-relaxed"
          style={{
            color: "rgba(238, 222, 206, 0.90)",
            textShadow: "0 1px 8px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.7)",
          }}
        >
          {sentence}{i < beat.sub!.split(". ").length - 1 ? "." : ""}
        </motion.p>
      ))}

      {/* Tap hint — fades after first interaction */}
      <AnimatePresence>
        {breathCount === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ delay: 2.5, duration: 0.8 }}
            className="absolute bottom-10 font-sans text-[9px] tracking-[0.45em] uppercase pointer-events-none"
            style={{ color: `${theme.color}30` }}
          >
            Tap to reflect
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
