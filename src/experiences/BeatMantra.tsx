import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import type { Beat } from "@/data/realms";

interface Props {
  beat: Beat;
  theme: { glow: string; color: string };
}

const WORDS = [
  {
    text: "OM",
    devanagari: "ॐ",
    meaning: "The primordial sound — the universe breathing itself into existence",
    guidance: "Open your mouth. Let the sound begin in your chest.",
    color: "#c8e8ff",
    glowColor: "rgba(150,200,255,0.45)",
  },
  {
    text: "NAMO",
    devanagari: "नमो",
    meaning: "I surrender. I release what I have been holding.",
    guidance: "Let your shoulders drop. Release the weight you carry.",
    color: "#d4c8ff",
    glowColor: "rgba(150,120,255,0.4)",
  },
  {
    text: "BHAGAVATE",
    devanagari: "भगवते",
    meaning: "To the Blessed One — the source of all grace, all fortune, all light",
    guidance: "Feel the word fill your body. It is larger than the breath.",
    color: "#c9a84c",
    glowColor: "rgba(200,160,40,0.45)",
  },
  {
    text: "VĀSUDEVĀYA",
    devanagari: "वासुदेवाय",
    meaning: "To Vasudeva — He who dwells in all beings, in all things, in you",
    guidance: "The last syllable. The name dissolves into silence.",
    color: "#ffe8a0",
    glowColor: "rgba(255,220,100,0.5)",
  },
];

type BreathPhase = "idle" | "inhale" | "hold" | "exhale" | "rest";

const BREATH_DURATIONS: Record<BreathPhase, number> = {
  idle: 0,
  inhale: 2000,
  hold: 800,
  exhale: 2000,
  rest: 600,
};

const BREATH_LABELS: Partial<Record<BreathPhase, string>> = {
  inhale: "Breathe in…",
  hold: "Hold…",
  exhale: "Breathe out…",
  rest: "",
};

function BreathRing({
  phase,
  color,
  active,
}: {
  phase: BreathPhase;
  color: string;
  active: boolean;
}) {
  const scale =
    phase === "inhale" ? 1.55 :
    phase === "hold"   ? 1.55 :
    phase === "exhale" ? 1.0 :
    1.0;

  const opacity =
    phase === "inhale" ? 0.7 :
    phase === "hold"   ? 0.8 :
    phase === "exhale" ? 0.2 :
    active ? 0.25 : 0.1;

  const duration =
    phase === "inhale" ? BREATH_DURATIONS.inhale / 1000 :
    phase === "hold"   ? BREATH_DURATIONS.hold  / 1000 :
    phase === "exhale" ? BREATH_DURATIONS.exhale / 1000 :
    0.4;

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: 120,
        height: 120,
        top: "50%",
        left: "50%",
        marginTop: -60,
        marginLeft: -60,
        border: `1px solid ${color}`,
        boxShadow: `0 0 20px ${color.replace("0.45", "0.3")}`,
      }}
      animate={{ scale, opacity }}
      transition={{ duration, ease: phase === "hold" ? "linear" : "easeInOut" }}
    />
  );
}

export function BeatMantra({ beat }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [breathPhase, setBreathPhase] = useState<BreathPhase>("idle");
  const [liberated, setLiberated] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isChanting = breathPhase !== "idle" && breathPhase !== "rest";
  const allDone = completed.size === WORDS.length;

  const progress = completed.size / WORDS.length;

  // Background light level changes with completion
  const lightOpacity = useMotionValue(0);
  const smoothLight = useSpring(lightOpacity, { stiffness: 40, damping: 20 });

  useEffect(() => {
    lightOpacity.set(progress * 0.6);
  }, [progress, lightOpacity]);

  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const startChant = () => {
    if (isChanting || completed.has(currentIdx) || allDone) return;

    const runPhase = (phase: BreathPhase, next: () => void) => {
      setBreathPhase(phase);
      timerRef.current = setTimeout(next, BREATH_DURATIONS[phase]);
    };

    runPhase("inhale", () =>
      runPhase("hold", () =>
        runPhase("exhale", () => {
          setBreathPhase("rest");
          setCompleted((prev) => {
            const n = new Set(prev);
            n.add(currentIdx);
            return n;
          });
          timerRef.current = setTimeout(() => {
            setBreathPhase("idle");
            if (currentIdx < WORDS.length - 1) {
              setCurrentIdx((i) => i + 1);
            } else {
              setTimeout(() => setLiberated(true), 1200);
            }
          }, BREATH_DURATIONS.rest);
        })
      )
    );
  };

  useEffect(() => () => clearTimer(), []);

  const word = WORDS[currentIdx];
  const breathLabel = BREATH_LABELS[breathPhase] ?? "";

  return (
    <div className="relative flex flex-col h-full overflow-hidden">
      {/* Dynamic light bloom — grows as mantra progresses */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 70% at 50% 45%, rgba(200,160,40,${progress * 0.22}) 0%, rgba(100,80,200,${(1 - progress) * 0.18}) 40%, rgba(4,3,2,1) 85%)`,
          transition: "background 2s ease",
        }}
      />

      {/* Particle stars — completed words leave light dots */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from(completed).map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.6, 0.3], scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute rounded-full"
            style={{
              width: 3,
              height: 3,
              left: `${25 + i * 16}%`,
              top: "30%",
              background: WORDS[i].color,
              boxShadow: `0 0 8px ${WORDS[i].glowColor}`,
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {liberated ? (
          <motion.div
            key="liberated"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center"
          >
            {/* Golden bloom */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 3, ease: "easeOut" }}
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse 60% 60% at 50% 45%, rgba(255,220,80,0.18) 0%, rgba(200,140,20,0.08) 50%, transparent 80%)",
              }}
            />

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1.5 }}
              className="font-sans text-[10px] tracking-[0.55em] uppercase mb-6"
              style={{ color: "rgba(255,220,80,0.4)" }}
            >
              The Mantra is Complete
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 1.8 }}
              className="font-serif text-4xl md:text-5xl mb-8 select-none"
              style={{
                color: "#ffe880",
                filter: "drop-shadow(0 0 30px rgba(255,220,80,0.6))",
                letterSpacing: "0.2em",
              }}
            >
              ॐ नमो भगवते वासुदेवाय
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 1.5 }}
              className="font-serif text-sm md:text-base max-w-lg leading-loose"
              style={{ color: "rgba(255,220,120,0.55)" }}
            >
              "The name of Viṣṇu holds the soul at the threshold. Between the last breath and the first silence — this mantra alone is the crossing."
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.2, duration: 1 }}
              className="font-sans text-[10px] tracking-widest mt-4 uppercase"
              style={{ color: "rgba(255,200,60,0.3)" }}
            >
              Garuda Purāṇa · Chapter XVI
            </motion.p>

            {/* All four words glowing */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 1.5 }}
              className="flex gap-6 mt-10"
            >
              {WORDS.map((w, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span
                    className="font-sans text-[10px] tracking-[0.3em] uppercase"
                    style={{ color: w.color, filter: `drop-shadow(0 0 8px ${w.glowColor})` }}
                  >
                    {w.text}
                  </span>
                  <div className="w-1 h-1 rounded-full" style={{ background: w.color, boxShadow: `0 0 6px ${w.color}` }} />
                </div>
              ))}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="chanting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 flex flex-col h-full items-center justify-between px-6 py-10"
          >
            {/* Header */}
            <div className="text-center">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-sans text-[9px] tracking-[0.55em] uppercase mb-1"
                style={{ color: "rgba(150,200,255,0.35)" }}
              >
                द्वादशाक्षर मन्त्र · The Twelve-Syllable Mantra
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="font-serif font-bold"
                style={{
                  fontSize: "clamp(1.2rem, 2.8vw, 1.9rem)",
                  color: "#c8e8ff",
                  filter: "drop-shadow(0 0 14px rgba(150,200,255,0.5))",
                }}
              >
                {beat.headline ?? "The Protective Mantra"}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="font-sans text-[11px] text-foreground/25 mt-1 max-w-xs mx-auto"
              >
                Touch each word. Breathe with it. Let it settle before continuing.
              </motion.p>
            </div>

            {/* Progress dots */}
            <div className="flex gap-3">
              {WORDS.map((w, i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: i === currentIdx && !allDone ? 1.3 : 1,
                    opacity: completed.has(i) ? 1 : i === currentIdx ? 0.6 : 0.2,
                  }}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: completed.has(i) ? w.color : "rgba(200,180,150,0.4)",
                    boxShadow: completed.has(i) ? `0 0 8px ${w.glowColor}` : "none",
                  }}
                />
              ))}
            </div>

            {/* Central chant area */}
            <div className="flex-1 flex flex-col items-center justify-center w-full max-w-lg mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIdx}
                  initial={{ opacity: 0, scale: 0.88, filter: "blur(8px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 1.08, filter: "blur(6px)" }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-col items-center gap-5 w-full"
                >
                  {/* Breath ring + word */}
                  <div className="relative flex items-center justify-center" style={{ width: 180, height: 180 }}>
                    <BreathRing phase={breathPhase} color={word.color} active={!completed.has(currentIdx)} />
                    {/* Outer glow ring */}
                    {isChanting && (
                      <motion.div
                        className="absolute rounded-full pointer-events-none"
                        style={{
                          width: 140,
                          height: 140,
                          top: "50%",
                          left: "50%",
                          marginTop: -70,
                          marginLeft: -70,
                          background: `radial-gradient(circle, ${word.glowColor} 0%, transparent 70%)`,
                        }}
                        animate={{ opacity: [0.3, 0.8, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      />
                    )}

                    {/* The word */}
                    <div className="relative z-10 flex flex-col items-center gap-1 text-center select-none">
                      <motion.span
                        className="font-serif"
                        style={{
                          fontSize: "clamp(1.8rem, 5vw, 3rem)",
                          color: word.color,
                          filter: isChanting
                            ? `drop-shadow(0 0 24px ${word.glowColor}) drop-shadow(0 0 6px ${word.color})`
                            : "none",
                          transition: "filter 0.5s ease",
                        }}
                        animate={isChanting ? { textShadow: [`0 0 12px ${word.color}`, `0 0 28px ${word.color}`, `0 0 12px ${word.color}`] } : {}}
                        transition={{ duration: 1.5, repeat: isChanting ? Infinity : 0, ease: "easeInOut" }}
                      >
                        {word.devanagari}
                      </motion.span>
                      <span
                        className="font-sans text-[10px] tracking-[0.4em] uppercase"
                        style={{ color: `${word.color}70` }}
                      >
                        {word.text}
                      </span>
                    </div>
                  </div>

                  {/* Meaning */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="font-sans text-xs text-center max-w-xs leading-relaxed"
                    style={{ color: "rgba(200,180,140,0.45)" }}
                  >
                    {word.meaning}
                  </motion.p>

                  {/* Guidance text */}
                  <motion.p
                    className="font-sans text-[10px] italic text-center max-w-xs"
                    style={{ color: "rgba(180,160,120,0.3)" }}
                  >
                    {word.guidance}
                  </motion.p>

                  {/* Breath phase label */}
                  <AnimatePresence mode="wait">
                    {breathLabel && (
                      <motion.p
                        key={breathPhase}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.4 }}
                        className="font-sans text-xs tracking-[0.35em] uppercase"
                        style={{ color: word.color, filter: `drop-shadow(0 0 8px ${word.glowColor})` }}
                      >
                        {breathLabel}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {/* Tap prompt */}
                  {breathPhase === "idle" && !completed.has(currentIdx) && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      onClick={startChant}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-2 px-8 py-2.5 border rounded-sm font-sans text-[10px] tracking-[0.45em] uppercase transition-all duration-300"
                      style={{
                        cursor: "pointer",
                        borderColor: `${word.color}35`,
                        color: `${word.color}80`,
                        background: `${word.glowColor.replace("0.45", "0.08")}`,
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = `${word.color}70`;
                        (e.currentTarget as HTMLElement).style.color = word.color;
                        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 12px ${word.glowColor}`;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = `${word.color}35`;
                        (e.currentTarget as HTMLElement).style.color = `${word.color}80`;
                        (e.currentTarget as HTMLElement).style.boxShadow = "none";
                      }}
                    >
                      Chant this word
                    </motion.button>
                  )}

                  {completed.has(currentIdx) && currentIdx < WORDS.length - 1 && breathPhase === "idle" && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="font-sans text-[9px] tracking-[0.4em] uppercase"
                      style={{ color: "rgba(200,180,140,0.3)" }}
                    >
                      Scroll or continue below ↓
                    </motion.p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Previously completed words — shown as a building mantra */}
            {completed.size > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-wrap justify-center gap-x-3 gap-y-1 pb-2 max-w-sm mx-auto"
              >
                {WORDS.map((w, i) =>
                  completed.has(i) ? (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="font-serif text-sm"
                      style={{
                        color: w.color,
                        filter: `drop-shadow(0 0 8px ${w.glowColor})`,
                      }}
                    >
                      {w.devanagari}
                    </motion.span>
                  ) : null
                )}
              </motion.div>
            )}

            {/* Instruction at bottom */}
            {completed.size === 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="font-sans text-[9px] tracking-wide text-center pb-1"
                style={{ color: "rgba(180,160,120,0.18)" }}
              >
                The Garuda Purāṇa: Viṣṇu's name at the moment of death dissolves all karma.
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
