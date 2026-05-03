import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Beat } from "@/data/realms";
import { useSoulStore } from "@/state/SoulStore";

interface Props {
  beat: Beat;
  theme: { glow: string; color: string };
}

type Phase = "writing" | "releasing" | "released";

interface FloatingWord {
  word: string;
  id: number;
  driftX: number;
  driftY: number;
  delay: number;
  scale: number;
}

export function BeatFinalQuestion({ beat }: Props) {
  const [phase, setPhase] = useState<Phase>("writing");
  const [text, setText] = useState("");
  const [floatingWords, setFloatingWords] = useState<FloatingWord[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { update } = useSoulStore();

  const handleSubmit = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed) return;
    update({ finalAnswer: trimmed });

    const split = trimmed.split(/\s+/);
    const words: FloatingWord[] = split.map((word, i) => ({
      word,
      id: i,
      driftX: (Math.random() - 0.5) * 280,
      driftY: -(80 + Math.random() * 160),
      delay: i * 0.12,
      scale: 0.9 + Math.random() * 0.4,
    }));

    setFloatingWords(words);
    setPhase("releasing");
    const releaseDuration = split.length * 120 + 3000;
    setTimeout(() => setPhase("released"), releaseDuration);
  }, [text]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const reset = () => {
    setPhase("writing");
    setText("");
    setFloatingWords([]);
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  return (
    <div className="relative flex flex-col h-full overflow-hidden">
      {/* Background — deepens toward gold as phase advances */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background:
            phase === "writing"
              ? "radial-gradient(ellipse 70% 65% at 50% 40%, rgba(15,10,40,0.7) 0%, rgba(4,3,2,0.97) 80%)"
              : phase === "releasing"
              ? "radial-gradient(ellipse 80% 75% at 50% 40%, rgba(40,30,8,0.7) 0%, rgba(4,3,2,0.97) 80%)"
              : "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(100,70,10,0.35) 0%, rgba(4,3,2,0.97) 75%)",
        }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
      />

      {/* Floating released words */}
      <AnimatePresence>
        {phase === "releasing" &&
          floatingWords.map((w) => (
            <motion.span
              key={w.id}
              initial={{
                opacity: 1,
                x: "50%",
                y: "50%",
                filter: "blur(0px)",
                scale: w.scale,
              }}
              animate={{
                opacity: 0,
                x: `calc(50% + ${w.driftX}px)`,
                y: `calc(${50 + w.driftY / 6}% - ${Math.abs(w.driftY)}px)`,
                filter: "blur(9px)",
                scale: w.scale * 1.3,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.8, delay: w.delay, ease: [0.2, 0, 0.4, 1] }}
              className="absolute font-serif pointer-events-none select-none"
              style={{
                fontSize: "clamp(1rem, 2.8vw, 1.6rem)",
                color: "#c9a84c",
                filter: "drop-shadow(0 0 12px rgba(201,168,76,0.7))",
                transformOrigin: "center",
                whiteSpace: "nowrap",
                left: 0,
                top: 0,
              }}
            >
              {w.word}
            </motion.span>
          ))}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* ─── WRITING PHASE ─── */}
        {phase === "writing" && (
          <motion.div
            key="writing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7 }}
            className="relative z-10 flex flex-col h-full items-center justify-center px-6 md:px-16"
          >
            {/* Question */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="text-center mb-10"
            >
              <p
                className="font-sans text-[9px] tracking-[0.55em] uppercase mb-3"
                style={{ color: "rgba(150,200,255,0.3)" }}
              >
                {beat.sub ?? "अंतिम प्रश्न · The Final Question"}
              </p>
              <h2
                className="font-serif font-bold"
                style={{
                  fontSize: "clamp(1.3rem, 3.5vw, 2.2rem)",
                  color: "#c8e8ff",
                  filter: "drop-shadow(0 0 18px rgba(150,200,255,0.4))",
                }}
              >
                {beat.headline ?? "What did you learn from this life?"}
              </h2>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }}
                className="h-px mt-4 mx-auto origin-center"
                style={{
                  width: 80,
                  background: "linear-gradient(to right, transparent, rgba(150,200,255,0.25), transparent)",
                }}
              />
            </motion.div>

            {/* Text input */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.9 }}
              className="w-full max-w-lg"
            >
              <div
                className="relative pb-px"
                style={{
                  borderBottom: `1px solid rgba(201,168,76,${text.length > 0 ? 0.3 : 0.1})`,
                  transition: "border-color 0.5s ease",
                }}
              >
                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Write here…"
                  rows={3}
                  className="w-full bg-transparent border-0 outline-none resize-none text-center"
                  style={{
                    cursor: "pointer",
                    color: text.length > 0 ? "rgba(201,168,76,0.85)" : "rgba(150,120,60,0.2)",
                    fontFamily: "var(--font-serif, Georgia, serif)",
                    fontSize: "clamp(1rem, 2.5vw, 1.4rem)",
                    lineHeight: 1.7,
                    caretColor: "rgba(201,168,76,0.7)",
                  }}
                  autoFocus
                />
                {/* Glow under textarea while typing */}
                {text.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
                    style={{
                      background: "linear-gradient(to right, transparent, rgba(201,168,76,0.5), transparent)",
                      filter: "blur(2px)",
                    }}
                  />
                )}
              </div>

              {/* Helper text */}
              <motion.p
                animate={{ opacity: text.length > 0 ? 0.25 : 0.12 }}
                className="text-center font-sans text-[9px] tracking-[0.3em] uppercase mt-3"
                style={{ color: "rgba(180,160,120,1)" }}
              >
                Press Enter or tap below to release
              </motion.p>
            </motion.div>

            {/* Submit */}
            <AnimatePresence>
              {text.trim().length > 0 && (
                <motion.button
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.4 }}
                  onClick={handleSubmit}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="mt-7 px-10 py-3 border rounded-sm font-sans text-[10px] tracking-[0.5em] uppercase transition-all duration-400"
                  style={{
                    cursor: "pointer",
                    borderColor: "rgba(201,168,76,0.3)",
                    color: "rgba(201,168,76,0.6)",
                    background: "rgba(80,55,5,0.12)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.65)";
                    (e.currentTarget as HTMLElement).style.color = "rgba(201,168,76,0.95)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 0 16px rgba(180,130,20,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.3)";
                    (e.currentTarget as HTMLElement).style.color = "rgba(201,168,76,0.6)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  Release
                </motion.button>
              )}
            </AnimatePresence>

            {/* Quiet prompt */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
              className="absolute bottom-10 font-sans text-[9px] tracking-wide text-center"
              style={{ color: "rgba(180,160,120,0.12)" }}
            >
              There is no wrong answer. Yama has already closed the book.
            </motion.p>
          </motion.div>
        )}

        {/* ─── RELEASING PHASE ─── */}
        {phase === "releasing" && (
          <motion.div
            key="releasing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 flex flex-col h-full items-center justify-center"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.4, 0.4, 0] }}
              transition={{ duration: 3, times: [0, 0.2, 0.7, 1] }}
              className="font-sans text-[10px] tracking-[0.5em] uppercase"
              style={{ color: "rgba(201,168,76,0.6)" }}
            >
              Releasing…
            </motion.p>
          </motion.div>
        )}

        {/* ─── RELEASED PHASE ─── */}
        {phase === "released" && (
          <motion.div
            key="released"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.8 }}
            className="relative z-10 flex flex-col h-full items-center justify-center px-6 text-center"
          >
            {/* Subtle golden bloom */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2.5, ease: "easeOut" }}
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse 50% 50% at 50% 45%, rgba(201,168,76,0.12) 0%, transparent 70%)",
              }}
            />

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 1.4, ease: "easeOut" }}
              className="h-px w-16 mb-8 origin-center"
              style={{ background: "linear-gradient(to right, transparent, rgba(201,168,76,0.4), transparent)" }}
            />

            <motion.p
              initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.5, duration: 1.2 }}
              className="font-serif"
              style={{
                fontSize: "clamp(1.1rem, 2.8vw, 1.7rem)",
                color: "rgba(201,168,76,0.65)",
                filter: "drop-shadow(0 0 14px rgba(201,168,76,0.3))",
              }}
            >
              It has been received.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1.2 }}
              className="font-sans text-[11px] mt-4 max-w-xs leading-relaxed"
              style={{ color: "rgba(200,180,140,0.3)" }}
            >
              The learning you carried across this life is not lost. It goes forward with the soul.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.8, duration: 1 }}
              className="mt-8 flex flex-col items-center gap-2"
              style={{ color: "rgba(201,168,76,0.2)" }}
            >
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-px h-8 origin-top"
                style={{ background: "linear-gradient(to bottom, rgba(201,168,76,0.3), transparent)" }}
              />
              <span className="font-sans text-[9px] tracking-[0.4em] uppercase">Continue</span>
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.5 }}
              onClick={reset}
              className="absolute bottom-10 font-sans text-[9px] tracking-[0.35em] uppercase transition-colors"
              style={{ cursor: "none", color: "rgba(200,180,150,0.12)" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "rgba(200,180,150,0.4)")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(200,180,150,0.12)")}
            >
              Answer Again
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
