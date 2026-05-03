import { motion } from "framer-motion";
import type { Beat, Realm } from "@/data/realms";

interface Props {
  beat: Beat;
  realm: Realm;
  theme: { glow: string; color: string };
}

// ── Descent: a human silhouette dissolving away ─────────────────────────────
function DescentVisual({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      <motion.div
        animate={{ opacity: [0.1, 0.04, 0.1], filter: ["blur(0px)", "blur(6px)", "blur(0px)"] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 80 190" width="220" height="520" aria-hidden="true">
          <ellipse cx="40" cy="19" rx="14" ry="17" fill={color} />
          <path
            d="M27,35 L19,40 L15,96 L33,96 L33,148 L47,148 L47,96 L65,96 L61,40 L53,35 Z"
            fill={color}
          />
          <rect x="21" y="94"  width="12" height="52" rx="4" fill={color} />
          <rect x="47" y="94"  width="12" height="52" rx="4" fill={color} />
        </svg>
      </motion.div>
    </div>
  );
}

// ── Hells: Chitragupta's open book with lines appearing ──────────────────────
function HellsVisual({ color }: { color: string }) {
  const lines = [30, 50, 70, 90, 110, 130, 150];
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.06 }}
        transition={{ duration: 2 }}
      >
        <svg viewBox="0 0 300 210" width="420" height="295" aria-hidden="true">
          {/* Book pages */}
          <rect x="5"   y="12" width="140" height="180" rx="3" fill="none" stroke={color} strokeWidth="1.2" />
          <rect x="155" y="12" width="140" height="180" rx="3" fill="none" stroke={color} strokeWidth="1.2" />
          {/* Spine */}
          <rect x="144" y="8" width="12" height="190" fill={color} opacity="0.5" />
          {/* Left-page lines */}
          {lines.map((y, i) => (
            <motion.line
              key={`l${i}`}
              x1="20" y1={y} x2="136" y2={y}
              stroke={color} strokeWidth="1.2" strokeLinecap="round"
              style={{ transformOrigin: "20px center" }}
              animate={{ scaleX: [0, 1, 1, 0] }}
              transition={{ duration: 3.8, delay: i * 0.35, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
            />
          ))}
          {/* Right-page lines */}
          {lines.map((y, i) => (
            <motion.line
              key={`r${i}`}
              x1="164" y1={y} x2="280" y2={y}
              stroke={color} strokeWidth="1.2" strokeLinecap="round"
              style={{ transformOrigin: "164px center" }}
              animate={{ scaleX: [0, 1, 1, 0] }}
              transition={{ duration: 3.8, delay: i * 0.35 + 0.18, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
            />
          ))}
        </svg>
      </motion.div>
    </div>
  );
}

// ── Rites: a lamp with a living flame ────────────────────────────────────────
function RitesVisual({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <motion.div
        animate={{ opacity: [0.14, 0.22, 0.14] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 70 130" width="130" height="240" aria-hidden="true">
          {/* Lamp base */}
          <ellipse cx="35" cy="118" rx="22" ry="8" fill={color} opacity="0.55" />
          {/* Lamp body */}
          <path d="M22,80 L18,118 L52,118 L48,80 Z" fill={color} opacity="0.55" rx="3" />
          {/* Wick line */}
          <line x1="35" y1="80" x2="35" y2="72" stroke={color} strokeWidth="2" strokeLinecap="round" />
          {/* Flame */}
          <motion.path
            d="M35,72 Q24,55 28,40 Q31,26 35,14 Q39,26 42,40 Q46,55 35,72 Z"
            fill={color}
            animate={{
              d: [
                "M35,72 Q24,55 28,40 Q31,26 35,14 Q39,26 42,40 Q46,55 35,72 Z",
                "M35,72 Q26,53 30,38 Q33,24 35,12 Q37,24 40,38 Q44,53 35,72 Z",
                "M35,72 Q22,57 26,42 Q29,28 35,16 Q41,28 44,42 Q48,57 35,72 Z",
                "M35,72 Q24,55 28,40 Q31,26 35,14 Q39,26 42,40 Q46,55 35,72 Z",
              ],
            }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Inner flame core */}
          <motion.ellipse
            cx="35" cy="52" rx="5" ry="10"
            fill="rgba(255,255,200,0.6)"
            animate={{ ry: [10, 8, 11, 10], opacity: [0.5, 0.7, 0.4, 0.5] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </motion.div>
    </div>
  );
}

// ── Justice: a set of balance scales that slowly tilt ────────────────────────
function JusticeVisual({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      <motion.div
        animate={{ opacity: [0.10, 0.17, 0.10] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 200 160" width="340" height="272" aria-hidden="true">
          {/* Central post */}
          <rect x="99" y="10" width="3" height="110" fill={color} />
          {/* Top pivot */}
          <circle cx="100" cy="10" r="5" fill={color} />
          {/* Beam — rotates around center */}
          <motion.g
            style={{ transformOrigin: "100px 22px" }}
            animate={{ rotate: [-6, 6, -6] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <rect x="14" y="20" width="172" height="3" rx="1.5" fill={color} />
            {/* Left chain */}
            <line x1="28"  y1="23" x2="28"  y2="65" stroke={color} strokeWidth="1.5" strokeDasharray="4 3" />
            {/* Right chain */}
            <line x1="172" y1="23" x2="172" y2="65" stroke={color} strokeWidth="1.5" strokeDasharray="4 3" />
            {/* Left pan */}
            <ellipse cx="28"  cy="70" rx="26" ry="7" fill={color} opacity="0.7" />
            {/* Right pan */}
            <ellipse cx="172" cy="70" rx="26" ry="7" fill={color} opacity="0.7" />
          </motion.g>
          {/* Base */}
          <rect x="80" y="118" width="40" height="6" rx="3" fill={color} opacity="0.7" />
          <ellipse cx="100" cy="128" rx="30" ry="7" fill={color} opacity="0.35" />
        </svg>
      </motion.div>
    </div>
  );
}

// ── Liberation: expanding rings of light from center ─────────────────────────
function LiberationVisual({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 80,
            height: 80,
            border: `1px solid ${color}`,
          }}
          animate={{ scale: [0.4, 4.5], opacity: [0.22, 0] }}
          transition={{
            duration: 5.5,
            delay: i * 0.9,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
      {/* Static inner glow dot */}
      <motion.div
        className="absolute rounded-full"
        style={{ width: 10, height: 10, background: color }}
        animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.8, 1.3, 0.8] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function RealmVisual({ realmId, color }: { realmId: string; color: string }) {
  switch (realmId) {
    case "descent":    return <DescentVisual    color={color} />;
    case "hells":      return <HellsVisual      color={color} />;
    case "rites":      return <RitesVisual      color={color} />;
    case "justice":    return <JusticeVisual    color={color} />;
    case "liberation": return <LiberationVisual color={color} />;
    default:           return null;
  }
}

export function BeatPortal({ beat, realm, theme }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-8 text-center relative">
      {/* Corner ornaments */}
      {["top-6 left-6", "top-6 right-6", "bottom-6 left-6", "bottom-6 right-6"].map((pos) => (
        <span
          key={pos}
          className={`absolute ${pos} text-2xl pointer-events-none`}
          style={{ color: theme.color + "20" }}
        >✦</span>
      ))}

      {/* Realm-specific atmospheric visual */}
      <RealmVisual realmId={realm.id} color={theme.color} />

      {/* Ornament bar */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.1 }}
        className="flex items-center gap-3 mb-12 relative z-10"
      >
        <div className="h-px w-16 md:w-32" style={{ background: `linear-gradient(to right, transparent, ${theme.color}50)` }} />
        <span className="font-sans text-[10px] tracking-[0.6em] uppercase" style={{ color: theme.color + "60" }}>
          {realm.nav}
        </span>
        <div className="h-px w-16 md:w-32" style={{ background: `linear-gradient(to left, transparent, ${theme.color}50)` }} />
      </motion.div>

      {/* Headline — huge, burns in */}
      <div className="overflow-hidden mb-8 relative z-10">
        <motion.h2
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif font-bold leading-tight"
          style={{
            fontSize: "clamp(3rem, 10vw, 8rem)",
            color: theme.color,
            filter: `drop-shadow(0 0 40px ${theme.glow})`,
          }}
        >
          {beat.headline}
        </motion.h2>
      </div>

      {/* Sub text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="font-sans font-light text-base md:text-xl max-w-xl leading-relaxed mb-12 relative z-10"
        style={{
          color: "rgba(238, 222, 206, 0.82)",
          textShadow: "0 1px 10px rgba(0,0,0,0.85)",
        }}
      >
        {beat.sub}
      </motion.p>

      {/* Gate line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.4, delay: 1.2, ease: "easeOut" }}
        className="h-px w-24 relative z-10"
        style={{ background: `linear-gradient(to right, transparent, ${theme.color}60, transparent)` }}
      />

      {/* Realm name large watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span
          className="font-serif font-bold leading-none uppercase"
          style={{
            fontSize: "clamp(4rem, 25vw, 20rem)",
            color: theme.color + "04",
            letterSpacing: "-0.02em",
          }}
        >
          {realm.title.split(" ")[0]}
        </span>
      </div>
    </div>
  );
}
