import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Beat } from "@/data/realms";

interface Props {
  beat: Beat;
  theme: { glow: string; color: string };
}

const LINES = [
  { text: "They have come for you.", attr: false },
  { text: "Two messengers. As black as crows.", attr: false },
  { text: "Bearing nooses and rods, naked, with grinding teeth.", attr: false },
  { text: "They are not angry. They are merely precise.", attr: false },
  { text: "— Garuda Purāṇa · Chapter I", attr: true },
];

const ASH = [
  { l: 8,  t: 22, w: 2.5, h: 1.5, d: 0    },
  { l: 28, t: 55, w: 1.5, h: 2,   d: 1.2  },
  { l: 65, t: 18, w: 2,   h: 1,   d: 0.55 },
  { l: 80, t: 40, w: 1,   h: 2,   d: 1.85 },
  { l: 18, t: 72, w: 2.5, h: 1,   d: 0.8  },
  { l: 74, t: 62, w: 1.5, h: 1.5, d: 0.3  },
  { l: 50, t: 28, w: 1,   h: 1,   d: 2.1  },
  { l: 38, t: 14, w: 2,   h: 1,   d: 0.9  },
  { l: 90, t: 78, w: 1.5, h: 1.5, d: 1.5  },
  { l: 45, t: 82, w: 1,   h: 2,   d: 0.6  },
];

function YamadutaFigure({ mirror }: { mirror?: boolean }) {
  return (
    <svg
      viewBox="0 0 110 260"
      width="110"
      height="260"
      overflow="visible"
      style={{ transform: mirror ? "scaleX(-1)" : "none" }}
    >
      {/* Head */}
      <ellipse cx="55" cy="26" rx="17" ry="21"
        fill="rgba(4,1,1,0.98)" stroke="rgba(110,8,8,0.6)" strokeWidth="0.8"/>
      {/* Hair wisps */}
      <path d="M46,8 Q43,1 41,6 M55,5 Q55,0 56,5 M64,8 Q67,1 69,6"
        stroke="rgba(6,1,1,0.85)" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      {/* Body */}
      <path d="M44,46 L37,51 L31,110 L50,110 L50,148 L60,148 L60,110 L79,110 L73,51 L66,46 Z"
        fill="rgba(4,1,1,0.98)" stroke="rgba(100,8,8,0.45)" strokeWidth="0.7"/>
      {/* Left arm - noose */}
      <path d="M37,55 Q27,70 20,83"
        stroke="rgba(4,1,1,0.98)" strokeWidth="11" strokeLinecap="round" fill="none"/>
      {/* Right arm - rod */}
      <path d="M73,55 Q83,67 90,78"
        stroke="rgba(4,1,1,0.98)" strokeWidth="11" strokeLinecap="round" fill="none"/>
      {/* Legs */}
      <rect x="35" y="108" width="14" height="54" rx="4" fill="rgba(4,1,1,0.98)"/>
      <rect x="59" y="108" width="14" height="54" rx="4" fill="rgba(4,1,1,0.98)"/>
      {/* Eyes — glowing crimson */}
      <circle cx="47" cy="23" r="4.5" fill="rgba(220,25,15,0.8)"
        style={{ filter: "drop-shadow(0 0 5px rgba(200,20,10,0.7))" }}/>
      <circle cx="63" cy="23" r="4.5" fill="rgba(220,25,15,0.8)"
        style={{ filter: "drop-shadow(0 0 5px rgba(200,20,10,0.7))" }}/>
      {/* Noose — left hand */}
      <circle cx="16" cy="94" r="11" fill="none" stroke="rgba(88,48,10,0.65)" strokeWidth="2.5"/>
      <line x1="20" y1="83" x2="22" y2="83" stroke="rgba(88,48,10,0.65)" strokeWidth="2.2"/>
      {/* Rod — right hand */}
      <line x1="90" y1="78" x2="106" y2="135"
        stroke="rgba(60,28,6,0.75)" strokeWidth="4" strokeLinecap="round"/>
      <circle cx="106" cy="135" r="4" fill="rgba(55,24,5,0.6)"/>
    </svg>
  );
}

export function BeatYamaduta({ beat }: Props) {
  const [lineIdx, setLineIdx] = useState(0);
  const arrived = lineIdx >= LINES.length;

  useEffect(() => {
    if (arrived) return;
    const t = setTimeout(() => setLineIdx((i) => Math.min(i + 1, LINES.length)), 2700);
    return () => clearTimeout(t);
  }, [lineIdx, arrived]);

  const handleClick = () => {
    if (!arrived) setLineIdx((i) => Math.min(i + 1, LINES.length));
  };

  const progress = lineIdx / LINES.length;
  const figScale = 0.08 + progress * 0.58;

  return (
    <div
      className="relative flex flex-col h-full overflow-hidden"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      {/* Atmosphere */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 85% 70% at 50% 70%, rgba(65,3,3,0.78) 0%, rgba(2,0,0,0.99) 78%)",
        }}
      />

      {/* Dim moon */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "7%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 52,
          height: 52,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(190,160,120,0.12) 0%, transparent 70%)",
          boxShadow: "0 0 28px rgba(180,140,100,0.06)",
        }}
      />

      {/* Floating ash particles */}
      {ASH.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.l}%`,
            top: `${p.t}%`,
            width: p.w,
            height: p.h,
            background: "rgba(170,70,25,0.28)",
          }}
          animate={{ y: [0, -20, 0], opacity: [0.18, 0.48, 0.18] }}
          transition={{
            duration: 3.5 + p.d,
            repeat: Infinity,
            delay: p.d,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Ground fog */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: 110,
          background: "linear-gradient(to top, rgba(28,1,1,0.85), transparent)",
        }}
      />

      {/* The two figures — approach from distance */}
      <div
        className="absolute bottom-0 left-0 right-0 flex justify-center items-end pointer-events-none"
        style={{ paddingBottom: "4%" }}
      >
        {/* Left */}
        <motion.div
          style={{ transformOrigin: "bottom center", marginRight: "-18px" }}
          animate={{ scale: figScale, opacity: Math.min(progress * 3, 1) }}
          transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 2.3, repeat: Infinity, ease: "easeInOut" }}
          >
            <YamadutaFigure mirror={false} />
          </motion.div>
        </motion.div>

        {/* Right — slightly smaller / offset for depth */}
        <motion.div
          style={{ transformOrigin: "bottom center", marginLeft: "-18px" }}
          animate={{ scale: figScale * 0.88, opacity: Math.min(progress * 3, 1) }}
          transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.0, repeat: Infinity, ease: "easeInOut", delay: 0.55 }}
          >
            <YamadutaFigure mirror={true} />
          </motion.div>
        </motion.div>
      </div>

      {/* Arrival glow beneath figures */}
      <AnimatePresence>
        {arrived && (
          <motion.div
            key="arrivalglow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-0 left-0 right-0 pointer-events-none"
            style={{
              height: "55%",
              background:
                "radial-gradient(ellipse 55% 45% at 50% 100%, rgba(100,4,4,0.5) 0%, transparent 70%)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Text lines — center-upper area */}
      <div className="relative z-10 mt-auto mb-56 mx-auto max-w-lg w-full px-8 flex flex-col items-center text-center">
        <AnimatePresence>
          {LINES.slice(0, lineIdx).map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
              animate={{
                opacity:
                  i === lineIdx - 1
                    ? line.attr
                      ? 0.45
                      : 0.88
                    : line.attr
                    ? 0.25
                    : 0.28,
                y: 0,
                filter: "blur(0px)",
              }}
              transition={{ duration: 0.75 }}
              className={
                line.attr
                  ? "font-sans text-[10px] tracking-[0.45em] uppercase mt-4 mb-1"
                  : "font-serif text-xl md:text-2xl mb-2 leading-relaxed"
              }
              style={{
                color:
                  line.attr
                    ? "rgba(201,74,74,0.55)"
                    : i === lineIdx - 1
                    ? "#eeaaaa"
                    : "rgba(220,140,130,0.38)",
              }}
            >
              {line.text}
            </motion.p>
          ))}
        </AnimatePresence>

        {!arrived && (
          <motion.div
            animate={{ opacity: [0.18, 0.55, 0.18] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="mt-6 font-sans text-[9px] tracking-[0.5em] uppercase pointer-events-none"
            style={{ color: "rgba(201,74,74,0.25)" }}
          >
            Tap to witness
          </motion.div>
        )}
      </div>

      {/* Beat label */}
      {beat.headline && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 pointer-events-none"
        >
          <div className="h-px w-8" style={{ background: "rgba(201,74,74,0.2)" }} />
          <span
            className="font-sans text-[9px] tracking-[0.45em] uppercase"
            style={{ color: "rgba(201,74,74,0.4)" }}
          >
            {beat.headline}
          </span>
          <div className="h-px w-8" style={{ background: "rgba(201,74,74,0.2)" }} />
        </motion.div>
      )}
    </div>
  );
}
