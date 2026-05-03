import { useState, useCallback, useEffect } from "react";
import { motion, useSpring, useTransform, useMotionValue, AnimatePresence } from "framer-motion";
import { useSoulStore } from "@/state/SoulStore";
import type { Beat } from "@/data/realms";

interface Props {
  beat: Beat;
  theme: { glow: string; color: string };
}

const SINS = [
  "Betrayed a friend's trust",
  "Spoke false words",
  "Took what wasn't mine",
  "Neglected my parents",
  "Lived only for myself",
  "Broke a sacred vow",
  "Harmed a living being",
  "Gave in to cruelty",
  "Wasted what was given",
  "Consumed to excess",
  "Ignored suffering nearby",
  "Felt envy without restraint",
];

const VIRTUES = [
  "Fed the hungry",
  "Spoke truth even painfully",
  "Cared for the elderly",
  "Gave without expectation",
  "Spared a life I could have taken",
  "Honored every vow I made",
  "Planted trees or tended land",
  "Showed kindness for no reason",
  "Shared knowledge freely",
  "Protected those in fear",
  "Offered water to the thirsty",
  "Kept my mind in service",
];

type Verdict = "empty" | "heavily_sinful" | "sinful" | "balanced" | "virtuous" | "greatly_virtuous";

function getVerdict(sins: number, virtues: number): Verdict {
  if (sins === 0 && virtues === 0) return "empty";
  const diff = virtues - sins;
  if (diff <= -5) return "heavily_sinful";
  if (diff <= -2) return "sinful";
  if (diff <= 2) return "balanced";
  if (diff <= 5) return "virtuous";
  return "greatly_virtuous";
}

const VERDICTS: Record<Verdict, { title: string; text: string; color: string; yama: string }> = {
  empty: {
    title: "The Scales Are Empty",
    text: "Your life was spent watching from a distance. You took no stand. The record holds nothing.",
    yama: "You return to the same circumstances. Nothing has moved.",
    color: "#888888",
  },
  heavily_sinful: {
    title: "The Balance Falls to Darkness",
    text: "The weight of transgression is undeniable. Chitragupta reads aloud. Yama's rod descends.",
    yama: "You are bound for the lower realms. The 21 hells await — each matching a mark on your soul.",
    color: "#c94a4a",
  },
  sinful: {
    title: "Darkness Outweighs the Light",
    text: "Some virtue, but not enough. The scale tilts toward shadow. You know what you have done.",
    yama: "You return to the human realm carrying unresolved karma. The weight follows you.",
    color: "#c97a4a",
  },
  balanced: {
    title: "Equally Weighed",
    text: "Good and ill, precisely balanced. Neither condemned nor elevated. The middle path.",
    yama: "You are reborn as a human. The work is not finished.",
    color: "#c9a84c",
  },
  virtuous: {
    title: "Virtue Gains Ground",
    text: "The scale tips toward light. The good you have done exceeds what you have taken.",
    yama: "The realms of Svarga open. You rest there until the merit is spent, then return.",
    color: "#8fd4a8",
  },
  greatly_virtuous: {
    title: "The Soul Rises",
    text: "Few arrive here so unburdened. Your heart has walked the dharmic path with sincerity.",
    yama: "The road to Moksha lies open. You approach the end of all cycles.",
    color: "#c8e8ff",
  },
};

const MAX_TILT = 26;
const BEAM_HALF = 130;
const CHAIN_LEN = 55;

function ScaleVisual({ sinCount, virtueCount, color }: { sinCount: number; virtueCount: number; color: string }) {
  // useSpring with a plain number only uses it as initial value — must use a MotionValue as source
  const angleSource = useMotionValue(0);
  const angle = useSpring(angleSource, { stiffness: 90, damping: 18 });

  useEffect(() => {
    const balance = virtueCount - sinCount;
    const target = Math.max(-MAX_TILT, Math.min(MAX_TILT, balance * 3.5));
    angleSource.set(target);
  }, [sinCount, virtueCount, angleSource]);

  const leftPanY = useTransform(angle, (a) => -Math.sin((a * Math.PI) / 180) * CHAIN_LEN * 0.7);
  const rightPanY = useTransform(angle, (a) => Math.sin((a * Math.PI) / 180) * CHAIN_LEN * 0.7);

  return (
    <div className="relative w-full flex justify-center" style={{ height: 210 }}>
      {/* Vertical support pillar */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-sm"
        style={{ width: 3, height: 118, background: `linear-gradient(to top, ${color}90, ${color}25)`, transition: "background 1.2s ease" }}
      />
      {/* Fulcrum triangle */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: 116,
          width: 0, height: 0,
          borderLeft: "12px solid transparent",
          borderRight: "12px solid transparent",
          borderBottom: `16px solid ${color}60`,
          transition: "border-color 1.2s ease",
        }}
      />

      {/* Beam */}
      <motion.div
        className="absolute left-1/2 rounded-full"
        style={{
          rotate: angle,
          bottom: 132,
          width: BEAM_HALF * 2,
          marginLeft: -BEAM_HALF,
          height: 3,
          background: `linear-gradient(to right, rgba(201,74,74,0.6), ${color}80, rgba(201,168,76,0.6))`,
          transformOrigin: "center",
          transition: "background 1.2s ease",
        }}
      />

      {/* Left pan - SINS */}
      <motion.div
        style={{ y: leftPanY, bottom: 60, left: `calc(50% - ${BEAM_HALF}px)`, translateX: "-50%", position: "absolute" }}
        className="flex flex-col items-center"
      >
        <div style={{ width: 1, height: CHAIN_LEN, background: "rgba(201,74,74,0.35)" }} />
        <motion.div
          className="rounded-full flex flex-col items-center justify-center"
          animate={{
            background: sinCount > 0
              ? ["rgba(80,5,5,0.6)", "rgba(100,10,10,0.7)", "rgba(80,5,5,0.6)"]
              : "rgba(15,6,6,0.5)",
            boxShadow: sinCount > 0 ? ["0 0 15px rgba(139,21,21,0.3)", "0 0 25px rgba(139,21,21,0.5)", "0 0 15px rgba(139,21,21,0.3)"] : "none",
          }}
          transition={{ duration: 2.5, repeat: sinCount > 0 ? Infinity : 0, ease: "easeInOut" }}
          style={{
            width: 68, height: 68,
            border: `1px solid rgba(201,74,74,${sinCount > 0 ? 0.55 : 0.2})`,
          }}
        >
          <motion.span
            key={sinCount}
            initial={{ scale: 1.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-serif text-2xl font-bold leading-none"
            style={{ color: sinCount > 0 ? "#e88080" : "rgba(200,80,80,0.2)" }}
          >
            {sinCount}
          </motion.span>
          <span className="font-sans text-[8px] tracking-widest uppercase mt-0.5" style={{ color: "rgba(201,74,74,0.45)" }}>पाप</span>
        </motion.div>
      </motion.div>

      {/* Right pan - VIRTUES */}
      <motion.div
        style={{ y: rightPanY, bottom: 60, right: `calc(50% - ${BEAM_HALF}px)`, translateX: "50%", position: "absolute" }}
        className="flex flex-col items-center"
      >
        <div style={{ width: 1, height: CHAIN_LEN, background: "rgba(201,168,76,0.35)" }} />
        <motion.div
          className="rounded-full flex flex-col items-center justify-center"
          animate={{
            background: virtueCount > 0
              ? ["rgba(80,50,5,0.55)", "rgba(100,65,8,0.65)", "rgba(80,50,5,0.55)"]
              : "rgba(15,12,5,0.5)",
            boxShadow: virtueCount > 0 ? ["0 0 15px rgba(180,130,30,0.3)", "0 0 25px rgba(180,130,30,0.5)", "0 0 15px rgba(180,130,30,0.3)"] : "none",
          }}
          transition={{ duration: 2.5, repeat: virtueCount > 0 ? Infinity : 0, ease: "easeInOut" }}
          style={{
            width: 68, height: 68,
            border: `1px solid rgba(201,168,76,${virtueCount > 0 ? 0.55 : 0.2})`,
          }}
        >
          <motion.span
            key={virtueCount}
            initial={{ scale: 1.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-serif text-2xl font-bold leading-none"
            style={{ color: virtueCount > 0 ? "#e8c96a" : "rgba(200,168,76,0.2)" }}
          >
            {virtueCount}
          </motion.span>
          <span className="font-sans text-[8px] tracking-widest uppercase mt-0.5" style={{ color: "rgba(201,168,76,0.45)" }}>पुण्य</span>
        </motion.div>
      </motion.div>

      {/* Pan labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
        <span className="font-sans text-[9px] tracking-[0.3em] uppercase" style={{ color: "rgba(201,74,74,0.4)" }}>Transgressions</span>
        <span className="font-sans text-[9px] tracking-[0.3em] uppercase" style={{ color: "rgba(201,168,76,0.4)" }}>Merits</span>
      </div>
    </div>
  );
}

function ItemButton({ label, selected, side, onToggle, index }: {
  label: string; selected: boolean; side: "sin" | "virtue"; onToggle: () => void; index: number;
}) {
  const isSin = side === "sin";
  const activeColor = isSin ? "#e88080" : "#e8c96a";
  const activeBg = isSin ? "rgba(139,21,21,0.2)" : "rgba(180,130,30,0.18)";
  const activeBorder = isSin ? "rgba(201,74,74,0.5)" : "rgba(201,168,76,0.45)";
  const idleColor = isSin ? "rgba(201,74,74,0.16)" : "rgba(201,168,76,0.14)";

  return (
    <motion.button
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.035 }}
      onClick={onToggle}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      className="w-full text-left px-3 py-2 rounded-sm border transition-all duration-300 relative overflow-hidden"
      style={{
        cursor: "pointer",
        borderColor: selected ? activeBorder : idleColor,
        background: selected ? activeBg : "rgba(4,3,2,0.5)",
        boxShadow: selected ? `0 0 8px ${isSin ? "rgba(139,21,21,0.25)" : "rgba(180,130,30,0.22)"}` : "none",
      }}
    >
      {selected && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 origin-left pointer-events-none"
          style={{ background: `linear-gradient(to right, ${activeBg}, transparent)` }}
        />
      )}
      <div className="flex items-center gap-2 relative z-10">
        <motion.div
          animate={{ scale: selected ? 1 : 0.5, opacity: selected ? 1 : 0.25 }}
          transition={{ duration: 0.2 }}
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ background: activeColor, boxShadow: selected ? `0 0 6px ${activeColor}` : "none" }}
        />
        <span
          className="font-sans text-[11px] leading-snug"
          style={{ color: selected ? activeColor : "rgba(200,180,150,0.3)" }}
        >
          {label}
        </span>
      </div>
    </motion.button>
  );
}

export function BeatScales({ beat }: Props) {
  const [sins, setSins] = useState<Set<number>>(new Set());
  const [virtues, setVirtues] = useState<Set<number>>(new Set());

  const toggleSin = useCallback((i: number) => {
    setSins((p) => { const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n; });
  }, []);
  const toggleVirtue = useCallback((i: number) => {
    setVirtues((p) => { const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n; });
  }, []);
  const reset = useCallback(() => { setSins(new Set()); setVirtues(new Set()); }, []);

  const sinCount = sins.size;
  const virtueCount = virtues.size;
  const verdict = getVerdict(sinCount, virtueCount);
  const v = VERDICTS[verdict];

  const { update } = useSoulStore();
  useEffect(() => {
    update({ sinCount, virtueCount, scalesVerdict: verdict, scalesVerdictTitle: v.title });
  }, [sinCount, virtueCount, verdict]); // eslint-disable-line react-hooks/exhaustive-deps

  const bgColor =
    verdict === "heavily_sinful" ? "rgba(80,5,5,0.55)" :
    verdict === "sinful"         ? "rgba(60,20,5,0.45)" :
    verdict === "balanced"       ? "rgba(50,35,5,0.38)" :
    verdict === "virtuous"       ? "rgba(20,50,30,0.35)" :
    verdict === "greatly_virtuous" ? "rgba(10,30,60,0.4)" :
    "rgba(20,15,10,0.35)";

  return (
    <div className="relative flex flex-col h-full overflow-hidden">
      {/* Atmospheric bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${bgColor} 0%, rgba(5,3,2,0.96) 80%)`,
          transition: "background 1.5s ease",
        }}
      />

      {/* Header */}
      <div className="flex-shrink-0 px-6 md:px-12 pt-10 pb-2 text-center relative z-10">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-sans text-[9px] tracking-[0.55em] uppercase mb-1"
          style={{ color: "rgba(110,180,216,0.45)" }}
        >
          धर्मराज का न्याय · The Scales of Yama
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-serif font-bold"
          style={{
            fontSize: "clamp(1.4rem, 3vw, 2.2rem)",
            color: "#6eb4d8",
            filter: "drop-shadow(0 0 18px rgba(70,140,190,0.55))",
          }}
        >
          {beat.headline ?? "Weigh Your Soul"}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="font-sans text-[11px] text-foreground/25 mt-1 max-w-sm mx-auto"
        >
          Mark what you have done and what you have given. The scales do not lie.
        </motion.p>
      </div>

      {/* Scale */}
      <div className="flex-shrink-0 relative z-10 px-4">
        <ScaleVisual sinCount={sinCount} virtueCount={virtueCount} color={v.color} />
      </div>

      {/* Two-column selector */}
      <div className="flex-1 overflow-y-auto px-3 md:px-6 pb-2 relative z-10">
        <div className="grid grid-cols-2 gap-2 max-w-2xl mx-auto">
          <div className="flex flex-col gap-1">
            <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-center mb-1" style={{ color: "rgba(201,74,74,0.5)" }}>
              I have committed
            </p>
            {SINS.map((sin, i) => (
              <ItemButton key={i} index={i} label={sin} selected={sins.has(i)} side="sin" onToggle={() => toggleSin(i)} />
            ))}
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-center mb-1" style={{ color: "rgba(201,168,76,0.5)" }}>
              I have given
            </p>
            {VIRTUES.map((virtue, i) => (
              <ItemButton key={i} index={i} label={virtue} selected={virtues.has(i)} side="virtue" onToggle={() => toggleVirtue(i)} />
            ))}
          </div>
        </div>
      </div>

      {/* Verdict */}
      <AnimatePresence mode="wait">
        <motion.div
          key={verdict}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.45 }}
          className="flex-shrink-0 px-6 md:px-12 py-4 border-t relative z-10"
          style={{ borderColor: `${v.color}18`, transition: "border-color 1.2s ease" }}
        >
          <div className="max-w-xl mx-auto text-center">
            <motion.p
              className="font-serif text-sm md:text-base font-bold mb-1"
              style={{ color: v.color, filter: `drop-shadow(0 0 10px ${v.color}50)`, transition: "color 1.2s ease" }}
            >
              {v.title}
            </motion.p>
            <p className="font-sans text-[11px] text-foreground/38 leading-relaxed">{v.text}</p>
            <p className="font-sans text-[10px] italic mt-1" style={{ color: `${v.color}55`, transition: "color 1.2s ease" }}>
              Yama speaks: {v.yama}
            </p>
            {(sinCount > 0 || virtueCount > 0) && (
              <button
                onClick={reset}
                className="mt-2 font-sans text-[9px] tracking-[0.4em] uppercase transition-colors"
                style={{ cursor: "pointer", color: "rgba(200,180,150,0.2)" }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "rgba(200,180,150,0.45)")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(200,180,150,0.2)")}
              >
                Clear & Reconsider
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
