import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Beat } from "@/data/realms";
import { useSoulStore } from "@/state/SoulStore";

interface Props {
  beat: Beat;
  theme: { glow: string; color: string };
}

interface LifePath {
  id: string;
  label: string;
  sublabel: string;
  color: string;
  bgFrom: string;
  borderColor: string;
  symbol: string;
  lines: string[];
  closing: string;
}

const PATHS: LifePath[] = [
  {
    id: "devoted",
    label: "In devotion and service",
    sublabel: "You gave more than you took",
    color: "#c8e8ff",
    bgFrom: "rgba(20,50,100,0.7)",
    borderColor: "rgba(110,180,216,0.55)",
    symbol: "✦",
    lines: [
      "The road southward is not yours today.",
      "The Messengers of Yama have passed you by.",
      "A light breaks open from the north — Viṣṇu's realm — vast, golden, beyond what any eye born of flesh can hold.",
      "You are carried, not walking.",
      "There you will rest in Svarga until the last of your merit is spent.",
      "Then you will be born again — but as a Brahmin's child, or a king's child, with wisdom already sleeping inside you.",
      "The wheel turns — but upward.",
    ],
    closing: "The Garuda Purāṇa: Those who give freely are born into houses of giving.",
  },
  {
    id: "dutiful",
    label: "In duty and dharma",
    sublabel: "You kept your obligations, mostly",
    color: "#c9a84c",
    bgFrom: "rgba(80,55,5,0.65)",
    borderColor: "rgba(201,168,76,0.5)",
    symbol: "◈",
    lines: [
      "The road is familiar. You have walked it before.",
      "A door opens — plain wood, morning light behind it.",
      "Inside: a family. Work. The occasional cruelty of small circumstances.",
      "The wheel turns again. You are given another human birth.",
      "The karmic debt neither grows nor shrinks — it waits.",
      "You are returned to the world you know, with the same lessons and a different face.",
      "Use it better this time.",
    ],
    closing: "The Garuda Purāṇa: The human birth is rare, and the wisest thing is not to waste it.",
  },
  {
    id: "selfish",
    label: "Mostly for myself",
    sublabel: "You took more than you gave",
    color: "#c97a4a",
    bgFrom: "rgba(70,30,5,0.65)",
    borderColor: "rgba(201,122,74,0.5)",
    symbol: "◉",
    lines: [
      "You feel yourself shrinking.",
      "Not in pain — but in dimension. The world grows enormous around you.",
      "A deer's heart beats fast in a forest.",
      "Ears swivel at every sound. The grass is cold with morning dew.",
      "You will live this life, and perhaps three more after it, until the karma of selfishness has been worn down.",
      "The Purana is precise: those who take without giving are born in bodies that cannot give at all.",
      "But the wheel is not without mercy.",
    ],
    closing: "The Garuda Purāṇa: Even animals accumulate merit. The ascent, though slow, is certain.",
  },
  {
    id: "harmed",
    label: "I descended into harm",
    sublabel: "Cruelty, deception, harm",
    color: "#c94a4a",
    bgFrom: "rgba(80,5,5,0.7)",
    borderColor: "rgba(201,74,74,0.5)",
    symbol: "●",
    lines: [
      "The Messengers come.",
      "Their rods are not carried in anger — only in precision.",
      "The scales have spoken. Chitragupta closes the book.",
      "You are placed first in Raurava — for those who have caused beings to suffer.",
      "How long? The Purana is exact: one year for each act.",
      "When the burning is done, you return — smaller, uncertain, beginning again as a worm in the earth.",
      "And from the worm: an insect. From the insect: a fish. From the fish: a bird.",
      "The ascent back to human birth will take 8,400,000 lifetimes.",
      "This is not punishment. This is arithmetic.",
    ],
    closing: "The Garuda Purāṇa: Even this is not permanent. Everything that descends must eventually rise.",
  },
];

function VisionPlayer({ path, onBack }: { path: LifePath; onBack: () => void }) {
  const [revealedLines, setRevealedLines] = useState(0);
  const allRevealed = revealedLines >= path.lines.length;

  const revealNext = () => {
    if (!allRevealed) setRevealedLines((n) => n + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-16"
      style={{
        background: `radial-gradient(ellipse 90% 80% at 50% 40%, ${path.bgFrom} 0%, rgba(4,3,2,0.98) 75%)`,
      }}
      onClick={revealNext}
    >
      {/* Path symbol */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="font-serif text-4xl mb-8 select-none"
        style={{ color: path.color, filter: `drop-shadow(0 0 20px ${path.color}70)` }}
      >
        {path.symbol}
      </motion.div>

      {/* Vision lines */}
      <div className="max-w-xl w-full text-center space-y-4 mb-8">
        {path.lines.slice(0, revealedLines).map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7 }}
            className="font-serif leading-relaxed"
            style={{
              fontSize: "clamp(0.9rem, 1.8vw, 1.15rem)",
              color: i === revealedLines - 1 ? path.color : "rgba(220,200,160,0.55)",
              transition: "color 0.8s ease",
            }}
          >
            {line}
          </motion.p>
        ))}
      </div>

      {/* Tap prompt or closing */}
      {!allRevealed ? (
        <motion.div
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2.2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 pointer-events-none"
        >
          <motion.div
            className="w-px h-8 origin-top"
            style={{ background: `linear-gradient(to bottom, ${path.color}70, transparent)` }}
          />
          <span className="font-sans text-[9px] tracking-[0.45em] uppercase" style={{ color: `${path.color}60` }}>
            Touch to continue
          </span>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-center"
        >
          <div className="h-px w-20 mx-auto mb-4" style={{ background: `${path.color}30` }} />
          <p
            className="font-sans text-[10px] tracking-wide italic max-w-sm"
            style={{ color: `${path.color}55` }}
          >
            {path.closing}
          </p>
          <button
            onClick={(e) => { e.stopPropagation(); onBack(); }}
            className="mt-5 font-sans text-[9px] tracking-[0.4em] uppercase transition-colors"
            style={{ cursor: "pointer", color: "rgba(200,180,150,0.2)" }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "rgba(200,180,150,0.5)")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(200,180,150,0.2)")}
          >
            ← Return
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

export function BeatEcho({ beat }: Props) {
  const [selected, setSelected] = useState<LifePath | null>(null);
  const { update } = useSoulStore();

  return (
    <div className="relative flex flex-col h-full overflow-hidden">
      {/* Ambient bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 35%, rgba(30,20,60,0.5) 0%, rgba(4,3,2,0.96) 75%)",
        }}
      />

      <AnimatePresence mode="wait">
        {selected ? (
          <VisionPlayer key="vision" path={selected} onBack={() => setSelected(null)} />
        ) : (
          <motion.div
            key="selector"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 flex flex-col h-full px-5 md:px-12"
          >
            {/* Header */}
            <div className="flex-shrink-0 pt-10 pb-5 text-center">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-sans text-[9px] tracking-[0.55em] uppercase mb-1"
                style={{ color: "rgba(150,120,200,0.45)" }}
              >
                प्रारब्ध · What Has Been Chosen
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="font-serif font-bold"
                style={{
                  fontSize: "clamp(1.3rem, 3vw, 2rem)",
                  color: "#b8a8f0",
                  filter: "drop-shadow(0 0 16px rgba(150,120,200,0.5))",
                }}
              >
                {beat.headline ?? "The Echo of Lives"}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="font-sans text-[11px] text-foreground/25 mt-1 max-w-sm mx-auto"
              >
                Before the wheel turns again — see what awaits. Choose the life you lived.
              </motion.p>
            </div>

            {/* Path cards */}
            <div className="flex-1 flex flex-col justify-center gap-2.5 pb-8 max-w-2xl mx-auto w-full">
              {PATHS.map((path, i) => (
                <motion.button
                  key={path.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                  onClick={() => { setSelected(path); update({ echoPathId: path.id, echoPathLabel: path.label, echoPathVision: path.lines[0] }); }}
                  whileHover={{ scale: 1.015, x: 4 }}
                  whileTap={{ scale: 0.985 }}
                  className="relative w-full text-left px-5 py-4 border rounded-sm overflow-hidden group transition-all duration-300"
                  style={{
                    cursor: "pointer",
                    borderColor: `${path.borderColor.replace("0.5", "0.2")}`,
                    background: "rgba(6,4,3,0.7)",
                  }}
                >
                  {/* Hover fill */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `linear-gradient(to right, ${path.bgFrom.replace("0.65", "0.3")}, transparent)`,
                    }}
                  />

                  <div className="flex items-center gap-4 relative z-10">
                    <span
                      className="text-xl flex-shrink-0 w-8 text-center"
                      style={{ color: path.color, opacity: 0.7 }}
                    >
                      {path.symbol}
                    </span>
                    <div className="flex-1">
                      <p
                        className="font-serif text-sm md:text-base font-medium leading-tight"
                        style={{ color: "rgba(220,200,160,0.75)" }}
                      >
                        {path.label}
                      </p>
                      <p className="font-sans text-[10px] mt-0.5" style={{ color: "rgba(180,160,120,0.35)" }}>
                        {path.sublabel}
                      </p>
                    </div>
                    <motion.span
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="font-sans text-[9px] tracking-[0.3em] uppercase flex-shrink-0"
                      style={{ color: path.color }}
                    >
                      Enter →
                    </motion.span>
                  </div>
                </motion.button>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex-shrink-0 pb-4 text-center font-sans text-[9px] tracking-wide"
              style={{ color: "rgba(180,160,120,0.2)" }}
            >
              The Garuda Purāṇa holds a path for each kind of soul.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
