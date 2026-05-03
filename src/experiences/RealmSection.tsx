import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, animate as fmAnimate } from "framer-motion";
import type { Realm, BeatType } from "@/data/realms";
import { ParticleCanvas } from "@/effects/ParticleCanvas";
import { DescentRoad } from "@/effects/DescentRoad";
import { BeatPortal } from "./BeatPortal";
import { BeatScene } from "./BeatScene";
import { BeatQuote } from "./BeatQuote";
import { BeatList } from "./BeatList";
import { BeatRiver } from "./BeatRiver";
import { BeatVerse } from "./BeatVerse";
import { BeatVerdict } from "./BeatVerdict";
import { BeatScales } from "./BeatScales";
import { BeatEcho } from "./BeatEcho";
import { BeatMantra } from "./BeatMantra";
import { BeatFinalQuestion } from "./BeatFinalQuestion";
import { BeatReport } from "./BeatReport";
import { BeatYamaduta } from "./BeatYamaduta";

const THEME = {
  crimson: {
    glow: "rgba(139,21,21,0.5)",
    color: "#c94a4a",
    ambient: "radial-gradient(ellipse 90% 70% at 50% 100%, rgba(80,5,5,0.5) 0%, transparent 70%)",
    particle: "hell" as const,
  },
  gold: {
    glow: "rgba(180,130,30,0.5)",
    color: "#c9a84c",
    ambient: "radial-gradient(ellipse 90% 70% at 50% 100%, rgba(80,50,5,0.4) 0%, transparent 70%)",
    particle: "ceremony" as const,
  },
  silver: {
    glow: "rgba(70,120,180,0.5)",
    color: "#6eb4d8",
    ambient: "radial-gradient(ellipse 90% 70% at 50% 30%, rgba(10,40,80,0.5) 0%, transparent 70%)",
    particle: "liberation" as const,
  },
  liberation: {
    glow: "rgba(150,200,255,0.4)",
    color: "#c8e8ff",
    ambient: "radial-gradient(ellipse 90% 70% at 50% 30%, rgba(20,60,120,0.4) 0%, transparent 70%)",
    particle: "liberation" as const,
  },
};

const VARIANTS = {
  initial: (dir: number) => ({
    opacity: 0,
    scale: dir >= 0 ? 0.58 : 1.42,
    filter: dir >= 0 ? "blur(12px)" : "blur(8px)",
  }),
  animate: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
  },
  exit: (dir: number) => ({
    opacity: 0,
    scale: dir >= 0 ? 1.42 : 0.58,
    filter: dir >= 0 ? "blur(8px)" : "blur(12px)",
  }),
};

interface Props {
  realm: Realm;
  triggerBeat: (beatType: BeatType, theme: string) => void;
}

export function RealmSection({ realm, triggerBeat }: Props) {
  const containerRef  = useRef<HTMLDivElement>(null);
  const activeBeatRef = useRef(0);
  const lastWheelTime = useRef(0);
  const touchStartY   = useRef(0);
  const triggerRef    = useRef(triggerBeat);
  useEffect(() => { triggerRef.current = triggerBeat; }, [triggerBeat]);

  const [activeBeat, setActiveBeat] = useState(0);
  const [transDir, setTransDir]     = useState(1);

  const theme = THEME[realm.theme];
  const total = realm.beats.length;

  const beatProgress = useMotionValue(0);

  useEffect(() => {
    activeBeatRef.current = activeBeat;
    const target = total > 1 ? activeBeat / (total - 1) : 0;
    fmAnimate(beatProgress, target, { duration: 1.0, ease: [0.16, 1, 0.3, 1] });
  }, [activeBeat, total, beatProgress]);

  // Non-passive wheel handler — advance beats, fall through at boundaries
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const dir = e.deltaY > 6 ? 1 : e.deltaY < -6 ? -1 : 0;
      if (!dir) return;
      const cur = activeBeatRef.current;

      const atForwardBoundary  = dir ===  1 && cur >= total - 1;
      const atBackwardBoundary = dir === -1 && cur <= 0;
      if (!atForwardBoundary && !atBackwardBoundary) {
        e.preventDefault();
      }

      const now = Date.now();
      if (now - lastWheelTime.current < 820) return;

      if (dir === 1 && cur < total - 1) {
        lastWheelTime.current = now;
        setTransDir(1);
        setActiveBeat(cur + 1);
        triggerRef.current(realm.beats[cur + 1].type, realm.theme);
      } else if (dir === -1 && cur > 0) {
        lastWheelTime.current = now;
        setTransDir(-1);
        setActiveBeat(cur - 1);
        triggerRef.current(realm.beats[cur - 1].type, realm.theme);
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [total, realm.beats, realm.theme]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    const dy  = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(dy) < 55) return;
    const dir = dy > 0 ? 1 : -1;
    const cur = activeBeatRef.current;
    if (dir === 1 && cur < total - 1) {
      setTransDir(1);
      setActiveBeat(cur + 1);
      triggerRef.current(realm.beats[cur + 1].type, realm.theme);
    } else if (dir === -1 && cur > 0) {
      setTransDir(-1);
      setActiveBeat(cur - 1);
      triggerRef.current(realm.beats[cur - 1].type, realm.theme);
    }
  }, [total, realm.beats, realm.theme]);

  const beat    = realm.beats[Math.min(activeBeat, total - 1)];
  if (!beat) return null;

  const isFirst = activeBeat === 0;
  const isLast  = activeBeat === total - 1;

  return (
    <div
      ref={containerRef}
      id={`realm-${realm.id}`}
      className="relative h-screen w-full"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        <div className="absolute inset-0 bg-background" />
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-1000"
          style={{ background: theme.ambient }}
        />

        {realm.id === "descent" && (
          <DescentRoad scrollProgress={beatProgress} />
        )}

        <ParticleCanvas intensity={theme.particle} />

        {isFirst && (
          <motion.div
            key={`vignette-${realm.id}`}
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0 pointer-events-none z-20"
            style={{ background: "#000" }}
          />
        )}

        {/* Beat content — cinematic depth transition */}
        <AnimatePresence mode="sync" custom={transDir}>
          <motion.div
            key={`beat-${realm.id}-${activeBeat}`}
            custom={transDir}
            variants={VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex flex-col"
          >
            {beat.type === "portal"        && <BeatPortal        beat={beat} theme={theme} realm={realm} />}
            {beat.type === "scene"         && <BeatScene         beat={beat} theme={theme} />}
            {beat.type === "quote"         && <BeatQuote         beat={beat} theme={theme} />}
            {beat.type === "list"          && <BeatList          beat={beat} theme={theme} />}
            {beat.type === "river"         && <BeatRiver         beat={beat} theme={theme} />}
            {beat.type === "verse"         && <BeatVerse         beat={beat} theme={theme} />}
            {beat.type === "verdict"       && <BeatVerdict       beat={beat} theme={theme} />}
            {beat.type === "scales"        && <BeatScales        beat={beat} theme={theme} />}
            {beat.type === "echo"          && <BeatEcho          beat={beat} theme={theme} />}
            {beat.type === "mantra"        && <BeatMantra        beat={beat} theme={theme} />}
            {beat.type === "finalQuestion" && <BeatFinalQuestion beat={beat} theme={theme} />}
            {beat.type === "report"        && <BeatReport        beat={beat} theme={theme} />}
            {beat.type === "yamaduta"      && <BeatYamaduta      beat={beat} theme={theme} />}
          </motion.div>
        </AnimatePresence>

        {/* Progress dots — clickable */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30">
          {realm.beats.map((b, i) => (
            <motion.button
              key={i}
              onClick={() => {
                if (i === activeBeat) return;
                const dir = i > activeBeat ? 1 : -1;
                setTransDir(dir);
                setActiveBeat(i);
                triggerBeat(b.type, realm.theme);
              }}
              animate={{
                scale:   i === activeBeat ? 1.5 : 1,
                opacity: i === activeBeat ? 1   : 0.3,
              }}
              transition={{ duration: 0.3 }}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: theme.color, cursor: "pointer" }}
            />
          ))}
        </div>

        {/* Advance cue */}
        <AnimatePresence mode="wait">
          {isFirst && (
            <motion.div
              key="hint-first"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 2.5, duration: 1 }}
              className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30 pointer-events-none"
            >
              <span className="font-sans text-[10px] tracking-[0.4em] uppercase" style={{ color: theme.color + "65" }}>
                Scroll · swipe to enter
              </span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="w-px h-7"
                style={{ background: `linear-gradient(to bottom, ${theme.color}55, transparent)` }}
              />
            </motion.div>
          )}
          {isLast && !isFirst && (
            <motion.div
              key="hint-last"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 1.8, duration: 1 }}
              className="absolute bottom-14 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30 pointer-events-none"
            >
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-px h-6"
                style={{ background: `linear-gradient(to bottom, ${theme.color}45, transparent)` }}
              />
              <span className="font-sans text-[9px] tracking-[0.4em] uppercase" style={{ color: theme.color + "45" }}>
                Continue ↓
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Realm title + beat counter */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 pointer-events-none">
          <div className="h-px w-8" style={{ background: `${theme.color}30` }} />
          <span className="font-serif text-[10px] tracking-[0.5em] uppercase" style={{ color: theme.color + "50" }}>
            {realm.title}
          </span>
          <span className="font-sans text-[10px]" style={{ color: theme.color + "30" }}>
            {activeBeat + 1} / {total}
          </span>
          <div className="h-px w-8" style={{ background: `${theme.color}30` }} />
        </div>
      </div>
    </div>
  );
}
