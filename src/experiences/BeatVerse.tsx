import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Beat } from "@/data/realms";

interface Props {
  beat: Beat;
  theme: { glow: string; color: string };
}

const CHAKRAS = [
  {
    name: "Mūlādhāra",
    sanskrit: "मूलाधार",
    color: "#c94a4a",
    y: "85%",
    element: "Earth",
    desc: "The root center. Governs survival, the physical body, and the earth element. Located at the base of the spine — the foundation of incarnation.",
  },
  {
    name: "Svādhiṣṭhāna",
    sanskrit: "स्वाधिष्ठान",
    color: "#d47a30",
    y: "70%",
    element: "Water",
    desc: "The sacral center. Governs creativity, desire, and the water element. The seeds of karma are sown here through attachment.",
  },
  {
    name: "Maṇipūra",
    sanskrit: "मणिपूर",
    color: "#d4c030",
    y: "55%",
    element: "Fire",
    desc: "The navel center. Governs will, transformation, and the fire element. The digestive fires here burn accumulated karma.",
  },
  {
    name: "Anāhata",
    sanskrit: "अनाहत",
    color: "#40c060",
    y: "42%",
    element: "Air",
    desc: "The heart center. The unstruck sound. Governs love, devotion, and the air element. Liberation begins when the heart opens.",
  },
  {
    name: "Viśuddha",
    sanskrit: "विशुद्ध",
    color: "#40a0d0",
    y: "30%",
    element: "Space",
    desc: "The throat center. Governs speech, truth, and the space element. What you speak shapes the karma of your next life.",
  },
  {
    name: "Ājñā",
    sanskrit: "आज्ञा",
    color: "#8060d0",
    y: "20%",
    element: "Light",
    desc: "The command center — the eye of inner wisdom. Here the soul perceives what lies beyond the physical world. The door to liberation.",
  },
];

export function BeatVerse({ beat }: Props) {
  const [active, setActive] = useState<number | null>(null);

  const toggle = (i: number) => setActive((prev) => (prev === i ? null : i));
  const activeChakra = active !== null ? CHAKRAS[active] : null;

  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden">
      {/* Left — text + active description */}
      <div className="flex flex-col justify-center px-8 md:px-16 py-16 md:w-1/2 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="mb-2"
        >
          <span className="font-sans text-xs tracking-[0.4em] uppercase" style={{ color: "rgba(140,110,200,0.5)" }}>
            The Six Stations
          </span>
        </motion.div>
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="font-serif text-3xl md:text-5xl mb-4"
          style={{ color: "#b8a8f0" }}
        >
          {beat.headline}
        </motion.h3>

        <AnimatePresence mode="wait">
          {activeChakra ? (
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{ duration: 0.4 }}
              className="mt-1"
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ background: activeChakra.color, boxShadow: `0 0 10px ${activeChakra.color}` }}
                />
                <p className="font-serif text-lg font-medium" style={{ color: activeChakra.color }}>
                  {activeChakra.name}
                </p>
                <span className="font-sans text-[9px] tracking-[0.4em] uppercase" style={{ color: `${activeChakra.color}50` }}>
                  {activeChakra.element}
                </span>
              </div>
              <p className="font-sans text-sm text-foreground/55 leading-relaxed max-w-sm">
                {activeChakra.desc}
              </p>
              <p className="font-serif text-xs mt-3" style={{ color: `${activeChakra.color}50` }}>
                {activeChakra.sanskrit}
              </p>
            </motion.div>
          ) : (
            <motion.p
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="font-sans font-light text-foreground/45 text-sm md:text-base leading-relaxed max-w-md mt-2"
            >
              {beat.sub}
            </motion.p>
          )}
        </AnimatePresence>

        {active === null && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            className="mt-5 font-sans text-[9px] tracking-[0.45em] uppercase"
            style={{ color: "rgba(140,110,200,0.25)" }}
          >
            Tap a chakra to learn
          </motion.p>
        )}
      </div>

      {/* Right — chakra column */}
      <div className="md:w-1/2 relative flex items-center justify-center">
        <div className="relative h-80 md:h-[480px] w-16 mx-auto">
          {/* Central channel */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
            className="absolute left-1/2 -translate-x-1/2 w-px h-full origin-bottom"
            style={{
              background: `linear-gradient(to top, ${activeChakra?.color ?? "#b8a8f0"}80, ${activeChakra?.color ?? "#b8a8f0"}20)`,
              transition: "background 0.6s ease",
            }}
          />

          {/* Rising energy pulse */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 w-0.5"
            style={{ background: activeChakra?.color ?? "#b8a8f0", boxShadow: `0 0 8px ${activeChakra?.color ?? "#b8a8f0"}` }}
            animate={{ bottom: ["0%", "100%"] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            initial={{ bottom: "0%", height: 8 }}
          />

          {/* Chakra points */}
          {CHAKRAS.map((chakra, i) => {
            const isActive = active === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8 + i * 0.18 }}
                className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3"
                style={{ top: chakra.y }}
              >
                {/* Left label — hidden on mobile */}
                <div className="text-right w-28 hidden md:block">
                  <motion.p
                    className="font-serif text-xs transition-colors duration-300"
                    animate={{ color: isActive ? chakra.color : `${chakra.color}60` }}
                  >
                    {chakra.name}
                  </motion.p>
                  <p className="font-sans text-[10px] text-foreground/20">{chakra.sanskrit}</p>
                </div>

                {/* Clickable dot */}
                <motion.button
                  onClick={() => toggle(i)}
                  className="relative flex-shrink-0 flex items-center justify-center rounded-full focus:outline-none"
                  style={{ cursor: "pointer" }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  animate={{
                    width: isActive ? 28 : 16,
                    height: isActive ? 28 : 16,
                    boxShadow: isActive
                      ? `0 0 28px ${chakra.color}, 0 0 50px ${chakra.color}60`
                      : `0 0 12px ${chakra.color}`,
                    background: chakra.color,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Outer pulse ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
                    style={{ background: chakra.color + "40" }}
                  />
                  {/* Active check */}
                  {isActive && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-[8px] font-bold text-black relative z-10"
                    >
                      ✦
                    </motion.span>
                  )}
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
