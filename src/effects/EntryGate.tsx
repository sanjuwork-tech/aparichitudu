import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface EntryGateProps {
  onEnter: () => void;
}

const EMBERS = Array.from({ length: 20 }, (_, i) => ({
  size: 2 + (i * 7) % 3,
  left: (i * 17 + 5) % 100,
  bottom: (i * 13 + 5) % 40,
  hue: 20 + (i * 7) % 30,
  dur: 3 + (i * 7) % 4,
  delay: (i * 11) % 3,
}));

const SPARKS = Array.from({ length: 26 }, (_, i) => {
  const onLeft = i % 2 === 0;
  const angle = onLeft
    ? -40 + (i * 37) % 100
    : 40 + (i * 37) % 100;
  const rad = (angle * Math.PI) / 180;
  const dist = 35 + (i * 23) % 65;
  return {
    id: i,
    startX: onLeft ? 1 + (i * 7) % 9 : 90 + (i * 7) % 9,
    startY: [8, 22, 40, 58, 76, 90][i % 6],
    dx: Math.cos(rad) * dist,
    dy: Math.sin(rad) * dist + 10,
    dur: 0.45 + (i * 13 % 7) / 10,
    delay: (i * 89 % 500) / 1000,
    hue: 22 + (i * 11) % 28,
    size: 2 + (i * 3) % 3,
  };
});

function DoorFace({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";
  const hingeX = isLeft ? 3 : 188;
  const hw = 9;
  const latchX = isLeft ? 180 : 11;

  return (
    <svg
      viewBox="0 0 200 900"
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id={`dg-${side}`} cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="rgba(201,168,76,0.14)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
        <radialGradient id={`om-${side}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(201,168,76,0.18)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="200" height="900" fill={`url(#dg-${side})`} />

      {/* Outer border double frame */}
      <rect x="7" y="7" width="186" height="886" fill="none" stroke="rgba(201,168,76,0.52)" strokeWidth="1.6" />
      <rect x="18" y="18" width="164" height="864" fill="none" stroke="rgba(201,168,76,0.22)" strokeWidth="0.9" />

      {/* Corner medallions */}
      {([[28, 28], [172, 28], [28, 872], [172, 872]] as [number, number][]).map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="9" fill="none" stroke="rgba(201,168,76,0.48)" strokeWidth="1.1" />
          <circle cx={cx} cy={cy} r="4" fill="rgba(201,168,76,0.22)" />
          {[0, 90, 180, 270].map((deg) => {
            const a = (deg * Math.PI) / 180;
            return (
              <line key={deg}
                x1={cx + 11 * Math.cos(a)} y1={cy + 11 * Math.sin(a)}
                x2={cx + 15 * Math.cos(a)} y2={cy + 15 * Math.sin(a)}
                stroke="rgba(201,168,76,0.32)" strokeWidth="0.7"
              />
            );
          })}
        </g>
      ))}

      {/* Top band */}
      <line x1="18" y1="88" x2="182" y2="88" stroke="rgba(201,168,76,0.3)" strokeWidth="0.8" />
      <text x="100" y="58" textAnchor="middle" fontSize="26" fill="rgba(201,168,76,0.62)" fontFamily="serif">
        {isLeft ? "गरुड" : "पुराण"}
      </text>
      <text x="100" y="80" textAnchor="middle" fontSize="8" fill="rgba(201,168,76,0.28)" fontFamily="sans-serif" letterSpacing="5">
        {isLeft ? "GARUDA" : "PURĀṆA"}
      </text>
      {[40, 60, 80, 100, 120, 140, 160].map((x) => (
        <circle key={x} cx={x} cy="100" r="1.8" fill="rgba(201,168,76,0.2)" />
      ))}

      {/* Mid horizontal rules */}
      <line x1="18" y1="260" x2="182" y2="260" stroke="rgba(201,168,76,0.16)" strokeWidth="0.5" />
      <line x1="18" y1="640" x2="182" y2="640" stroke="rgba(201,168,76,0.16)" strokeWidth="0.5" />

      {/* Central medallion */}
      <circle cx="100" cy="450" r="84" fill="none" stroke="rgba(201,168,76,0.34)" strokeWidth="1.6" />
      <circle cx="100" cy="450" r="66" fill="none" stroke="rgba(201,168,76,0.18)" strokeWidth="0.9" />
      <circle cx="100" cy="450" r="14" fill={`url(#om-${side})`} stroke="rgba(201,168,76,0.28)" strokeWidth="0.8" />
      {[...Array(12)].map((_, i) => {
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
        return (
          <line key={i}
            x1={100 + 68 * Math.cos(a)} y1={450 + 68 * Math.sin(a)}
            x2={100 + 82 * Math.cos(a)} y2={450 + 82 * Math.sin(a)}
            stroke="rgba(201,168,76,0.24)" strokeWidth="0.9"
          />
        );
      })}
      {/* Lotus petals */}
      {[0, 60, 120, 180, 240, 300].map((deg) => {
        const a = (deg * Math.PI) / 180;
        const px = 100 + 34 * Math.cos(a);
        const py = 450 + 34 * Math.sin(a);
        return (
          <ellipse key={deg} cx={px} cy={py} rx="9" ry="16"
            transform={`rotate(${deg + 90}, ${px}, ${py})`}
            fill="rgba(201,168,76,0.07)"
            stroke="rgba(201,168,76,0.2)" strokeWidth="0.7"
          />
        );
      })}
      <text x="100" y="470" textAnchor="middle" fontSize="52" fill="rgba(201,168,76,0.65)" fontFamily="serif">ॐ</text>

      {/* Bottom band */}
      <line x1="18" y1="812" x2="182" y2="812" stroke="rgba(201,168,76,0.3)" strokeWidth="0.8" />
      <text x="100" y="844" textAnchor="middle" fontSize="15" fill="rgba(201,168,76,0.4)" fontFamily="serif">✦  ✦  ✦</text>
      <text x="100" y="870" textAnchor="middle" fontSize="8" fill="rgba(201,168,76,0.2)" fontFamily="sans-serif" letterSpacing="7">DHARMA</text>

      {/* Hinges on outer edge */}
      {[130, 430, 730].map((y) => (
        <rect key={y} x={hingeX} y={y} width={hw} height={38} rx="3"
          fill="rgba(201,168,76,0.58)" stroke="rgba(201,168,76,0.72)" strokeWidth="0.6"
        />
      ))}

      {/* Door pull on inner seam edge */}
      <rect x={latchX} y="420" width="9" height="44" rx="4.5"
        fill="rgba(201,168,76,0.48)" stroke="rgba(201,168,76,0.66)" strokeWidth="0.7"
      />
    </svg>
  );
}

export function EntryGate({ onEnter }: EntryGateProps) {
  const [phase, setPhase] = useState<"waiting" | "opening" | "done">("waiting");
  const [titleDone, setTitleDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setTitleDone(true), 900);
    return () => clearTimeout(t);
  }, []);

  const handleEnter = () => {
    if (phase !== "waiting") return;
    setPhase("opening");
    setTimeout(() => { setPhase("done"); onEnter(); }, 5400);
  };

  if (phase === "done") return null;
  const isOpening = phase === "opening";

  return (
    <div className="fixed inset-0 z-[9998] overflow-hidden select-none" style={{ background: "#040200" }}>

      {/* Golden light flooding from behind the gates */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpening ? 1 : 0 }}
        transition={{ duration: 3.2, ease: "easeOut", delay: 1.0 }}
        style={{
          background:
            "radial-gradient(ellipse 65% 130% at 50% 50%, rgba(255,215,80,0.98) 0%, rgba(240,140,20,0.78) 18%, rgba(120,45,5,0.52) 45%, rgba(30,10,2,0.2) 75%, transparent 95%)",
        }}
      />

      {/* White-gold flash peak */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-40"
        animate={{ opacity: isOpening ? [0, 0, 0, 0.92, 0] : 0 }}
        transition={{ duration: 5.4, times: [0, 0.6, 0.74, 0.86, 1], ease: "easeInOut" }}
        style={{ background: "rgba(255,245,210,1)" }}
      />

      {/* 3D perspective gate container */}
      <div
        className="absolute inset-0 flex"
        style={{ perspective: "1100px", perspectiveOrigin: "50% 48%" }}
      >
        {/* LEFT DOOR */}
        <motion.div
          className="relative w-1/2 h-full overflow-hidden"
          style={{
            transformOrigin: "left center",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            background:
              "repeating-linear-gradient(148deg, rgba(255,220,120,0.022) 0px, rgba(255,220,120,0.022) 1px, transparent 1px, transparent 22px)," +
              "repeating-linear-gradient(242deg, rgba(255,220,120,0.012) 0px, rgba(255,220,120,0.012) 1px, transparent 1px, transparent 30px)," +
              "linear-gradient(175deg, #221408 0%, #130c04 35%, #1e1207 65%, #0e0803 100%)",
            borderRight: "2.5px solid rgba(201,168,76,0.6)",
            boxShadow: "inset -20px 0 40px rgba(0,0,0,0.7)",
          }}
          animate={{ rotateY: isOpening ? -105 : 0 }}
          transition={{ duration: 3.6, ease: [0.76, 0.02, 0.24, 1], delay: isOpening ? 0.8 : 0 }}
        >
          <DoorFace side="left" />
          {/* Seam glow line (pulses while closed, vanishes when opening) */}
          <motion.div
            className="absolute right-0 inset-y-0 w-[3px] pointer-events-none"
            animate={{ opacity: isOpening ? 0 : [0.18, 0.55, 0.18] }}
            transition={isOpening ? { duration: 0.1 } : { duration: 2.8, repeat: Infinity }}
            style={{
              background: "linear-gradient(to bottom, transparent 5%, rgba(255,200,80,0.75) 30%, rgba(255,200,80,0.95) 50%, rgba(255,200,80,0.75) 70%, transparent 95%)",
              filter: "blur(1px)",
            }}
          />
        </motion.div>

        {/* RIGHT DOOR */}
        <motion.div
          className="relative w-1/2 h-full overflow-hidden"
          style={{
            transformOrigin: "right center",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            background:
              "repeating-linear-gradient(32deg, rgba(255,220,120,0.022) 0px, rgba(255,220,120,0.022) 1px, transparent 1px, transparent 22px)," +
              "repeating-linear-gradient(298deg, rgba(255,220,120,0.012) 0px, rgba(255,220,120,0.012) 1px, transparent 1px, transparent 30px)," +
              "linear-gradient(185deg, #221408 0%, #130c04 35%, #1e1207 65%, #0e0803 100%)",
            borderLeft: "2.5px solid rgba(201,168,76,0.6)",
            boxShadow: "inset 20px 0 40px rgba(0,0,0,0.7)",
          }}
          animate={{ rotateY: isOpening ? 105 : 0 }}
          transition={{ duration: 3.6, ease: [0.76, 0.02, 0.24, 1], delay: isOpening ? 0.8 : 0 }}
        >
          <DoorFace side="right" />
          <motion.div
            className="absolute left-0 inset-y-0 w-[3px] pointer-events-none"
            animate={{ opacity: isOpening ? 0 : [0.18, 0.55, 0.18] }}
            transition={isOpening ? { duration: 0.1 } : { duration: 2.8, repeat: Infinity, delay: 1.4 }}
            style={{
              background: "linear-gradient(to bottom, transparent 5%, rgba(255,200,80,0.75) 30%, rgba(255,200,80,0.95) 50%, rgba(255,200,80,0.75) 70%, transparent 95%)",
              filter: "blur(1px)",
            }}
          />
        </motion.div>
      </div>

      {/* Stone dust / sparks when doors crack open */}
      <AnimatePresence>
        {isOpening && SPARKS.map((s) => (
          <motion.div
            key={s.id}
            className="absolute rounded-full pointer-events-none z-20"
            style={{
              left: `${s.startX}%`,
              top: `${s.startY}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              background: `hsl(${s.hue}, 95%, 68%)`,
              boxShadow: `0 0 ${s.size * 2}px ${s.size}px hsl(${s.hue}, 95%, 62%)`,
            }}
            initial={{ opacity: 1, x: 0, y: 0, scale: 1.8 }}
            animate={{ opacity: 0, x: s.dx, y: s.dy, scale: 0 }}
            exit={{}}
            transition={{ duration: s.dur, delay: s.delay, ease: [0.0, 0.9, 0.57, 1] }}
          />
        ))}
      </AnimatePresence>

      {/* Content overlay — title & enter button */}
      <motion.div
        className="absolute inset-0 z-30 flex items-center justify-center"
        style={{ pointerEvents: isOpening ? "none" : "auto" }}
        animate={{ opacity: isOpening ? 0 : 1, y: isOpening ? -24 : 0 }}
        transition={{ duration: 0.65, ease: "easeIn" }}
      >
        <div className="flex flex-col items-center justify-center text-center px-8">
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="h-px w-16 md:w-32 bg-gradient-to-r from-transparent to-primary/60" />
            <span className="text-primary/60 text-xs tracking-[0.5em]">॥ श्री गरुड पुराण ॥</span>
            <div className="h-px w-16 md:w-32 bg-gradient-to-l from-transparent to-primary/60" />
          </motion.div>

          <div className="font-serif text-4xl sm:text-6xl md:text-8xl font-bold mb-6 flex flex-wrap justify-center gap-x-4">
            {["GARUDA", "PURĀṆA"].map((word, wi) => (
              <span key={wi} className="flex">
                {word.split("").map((ch, ci) => (
                  <motion.span
                    key={ci}
                    initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.5, delay: (wi * 6 + ci) * 0.08 + 0.4 }}
                    style={{
                      color: "transparent",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      backgroundImage: "linear-gradient(180deg, #e8c96a 0%, #c9a84c 50%, #8a6520 100%)",
                      filter: "drop-shadow(0 0 20px rgba(201,168,76,0.5))",
                    }}
                  >
                    {ch}
                  </motion.span>
                ))}
              </span>
            ))}
          </div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 1 }}
            className="text-foreground/50 font-sans tracking-[0.25em] uppercase text-xs md:text-sm mb-2">
            The Scripture of Death, Justice & Liberation
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0, duration: 1 }}
            className="text-foreground/30 font-sans text-xs mb-12">
            A dialogue between Viṣṇu and Garuḍa — King of Birds
          </motion.p>

          <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1, delay: 1.8 }} className="flex items-center gap-2 mb-10">
            <div className="h-px w-8 bg-primary/30" />
            {[...Array(5)].map((_, i) => (
              <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.6] }}
                transition={{ delay: 1.8 + i * 0.12, duration: 0.4 }}
                className="text-primary/50 text-xs">✦</motion.span>
            ))}
            <div className="h-px w-8 bg-primary/30" />
          </motion.div>

          <AnimatePresence>
            {titleDone && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }} transition={{ duration: 0.6 }}
                onClick={handleEnter}
                className="group relative font-serif tracking-[0.4em] text-sm uppercase px-12 py-4"
                style={{ border: "1px solid rgba(201,168,76,0.5)", cursor: "pointer" }}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              >
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "radial-gradient(ellipse at center, rgba(201,168,76,0.12) 0%, transparent 70%)" }} />
                <motion.span animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 2.5, repeat: Infinity }}
                  className="text-primary">
                  Enter the Realm
                </motion.span>
                <span className="absolute -bottom-px left-1/2 -translate-x-1/2 w-0 h-px bg-primary group-hover:w-full transition-all duration-500" />
              </motion.button>
            )}
          </AnimatePresence>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.25 }} transition={{ delay: 3.2, duration: 1.5 }}
            className="mt-8 text-foreground/30 text-xs tracking-widest max-w-xs text-center font-sans">
            Some consider it inauspicious to read this text except during funerals
          </motion.p>
        </div>
      </motion.div>

      {/* Ambient embers */}
      {EMBERS.map((e, i) => (
        <div key={i} className="absolute rounded-full pointer-events-none z-10"
          style={{
            width: `${e.size}px`, height: `${e.size}px`,
            left: `${e.left}%`, bottom: `${e.bottom}%`,
            background: `hsl(${e.hue}, 90%, 60%)`,
            boxShadow: `0 0 6px 2px hsl(${e.hue}, 90%, 60%)`,
            animation: `riseEmber ${e.dur}s ${e.delay}s ease-in-out infinite`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}
