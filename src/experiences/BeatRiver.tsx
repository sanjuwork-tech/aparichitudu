import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Beat } from "@/data/realms";
import { useSoulStore } from "@/state/SoulStore";

interface Props {
  beat: Beat;
  theme: { glow: string; color: string };
}

function RiverWaves({ agitated = false }: { agitated?: boolean }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-52 overflow-hidden pointer-events-none">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute w-[200%] left-[-50%]"
          style={{
            height: `${30 + i * 8}px`,
            bottom: `${i * 28}px`,
            borderRadius: "50%",
            background: `linear-gradient(to bottom, ${
              i % 2 === 0 ? "rgba(100,10,10,0.35)" : "rgba(60,5,5,0.4)"
            } 0%, transparent 100%)`,
            opacity: 0.7 - i * 0.1,
          }}
          animate={{
            x: ["-5%", "5%", "-5%"],
            scaleY: agitated ? [1, 1.3, 0.9, 1.2, 1] : [1, 1.08, 1],
          }}
          transition={{
            duration: agitated ? 1.5 + i * 0.3 : 4 + i * 0.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}
      {Array.from({ length: 14 }).map((_, i) => (
        <motion.div
          key={`bone-${i}`}
          className="absolute rounded-full"
          style={{
            width: `${3 + Math.random() * 5}px`,
            height: `${1 + Math.random() * 2}px`,
            left: `${Math.random() * 100}%`,
            bottom: `${4 + Math.random() * 16}px`,
            background: "rgba(180,160,140,0.4)",
          }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
        />
      ))}
    </div>
  );
}

function GoldenCowCrossing() {
  return (
    <motion.div
      className="absolute bottom-28 left-0 right-0 h-14 overflow-hidden pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Golden light beam on water */}
      <motion.div
        className="absolute bottom-0 w-24 h-full"
        initial={{ left: "-10%" }}
        animate={{ left: "110%" }}
        transition={{ duration: 3.5, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 50% 100%, rgba(201,168,76,0.5) 0%, transparent 70%)",
        }}
      />
      {/* Cow silhouette — simple SVG */}
      <motion.div
        className="absolute bottom-2"
        initial={{ left: "-8%" }}
        animate={{ left: "108%" }}
        transition={{ duration: 3.5, ease: "easeInOut" }}
      >
        <motion.div
          animate={{ y: [0, -2, 0, -1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        >
          <svg width="48" height="32" viewBox="0 0 48 32" fill="none">
            <ellipse cx="24" cy="20" rx="18" ry="9" fill="rgba(201,168,76,0.7)" />
            <ellipse cx="38" cy="14" rx="8" ry="7" fill="rgba(201,168,76,0.7)" />
            <rect x="8" y="27" width="4" height="5" rx="1" fill="rgba(201,168,76,0.6)" />
            <rect x="15" y="27" width="4" height="5" rx="1" fill="rgba(201,168,76,0.6)" />
            <rect x="28" y="27" width="4" height="5" rx="1" fill="rgba(201,168,76,0.6)" />
            <rect x="35" y="27" width="4" height="5" rx="1" fill="rgba(201,168,76,0.6)" />
            <ellipse cx="44" cy="12" rx="2.5" ry="2" fill="rgba(201,168,76,0.7)" />
            <path d="M43 8 L41 4 M45 8 L47 4" stroke="rgba(201,168,76,0.6)" strokeWidth="1.5" strokeLinecap="round" />
            <motion.ellipse
              cx="44" cy="10"
              rx="4" ry="4"
              fill="rgba(201,168,76,0.15)"
              animate={{ r: [4, 10, 4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </svg>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

type Choice = "none" | "gave" | "didnot";

export function BeatRiver({ beat, theme }: Props) {
  const [choice, setChoice] = useState<Choice>("none");
  const { update } = useSoulStore();

  return (
    <div className="flex flex-col items-center justify-center h-full relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 100% 60% at 50% 30%, rgba(60,5,5,0.6) 0%, rgba(5,2,2,0.9) 80%)",
        }}
      />

      {/* River — more agitated if they didn't give */}
      <RiverWaves agitated={choice === "didnot"} />

      {/* Cow crossing animation */}
      <AnimatePresence>
        {choice === "gave" && <GoldenCowCrossing key="cow" />}
      </AnimatePresence>

      {/* Soul dragged in — dark ripple */}
      <AnimatePresence>
        {choice === "didnot" && (
          <motion.div
            key="drag"
            className="absolute bottom-24 left-0 right-0 h-16 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border"
                style={{
                  width: 20 + i * 18,
                  height: 20 + i * 18,
                  left: `${40 + i * 2}%`,
                  top: `${30 - i * 4}%`,
                  borderColor: "rgba(139,21,21,0.4)",
                  transform: "translate(-50%, -50%)",
                }}
                animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* River surface shimmer */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(80,5,5,0.5))" }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-8 md:px-20 mb-40">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1 }}
          className="h-px w-24 mb-8"
          style={{ background: `linear-gradient(to right, transparent, rgba(180,30,30,0.6), transparent)` }}
        />

        <motion.h3
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-serif font-bold mb-4"
          style={{
            fontSize: "clamp(2.2rem, 7vw, 5rem)",
            color: "#f0e8d8",
            filter: "drop-shadow(0 0 30px rgba(139,21,21,0.9)) drop-shadow(0 0 60px rgba(139,21,21,0.5))",
          }}
        >
          {beat.headline}
        </motion.h3>

        <AnimatePresence mode="wait">
          {choice === "none" && (
            <motion.div
              key="neutral"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center gap-4"
            >
              <p
                className="font-sans font-light text-sm md:text-base max-w-lg leading-relaxed mb-2"
                style={{
                  color: "rgba(238, 218, 200, 0.88)",
                  textShadow: "0 1px 8px rgba(0,0,0,0.9)",
                }}
              >
                {beat.sub}
              </p>
              <p
                className="font-sans text-[11px] tracking-[0.3em] uppercase mb-4"
                style={{ color: "rgba(220,200,180,0.60)" }}
              >
                In life, did you give a cow to the deserving?
              </p>
              <div className="flex gap-4">
                <motion.button
                  onClick={() => { setChoice("gave"); update({ cowGiven: true }); }}
                  className="px-5 py-2.5 border font-sans text-[11px] tracking-[0.35em] uppercase"
                  style={{ cursor: "pointer", borderColor: "rgba(201,168,76,0.3)", color: "rgba(201,168,76,0.6)" }}
                  whileHover={{ borderColor: "rgba(201,168,76,0.7)", color: "rgba(201,168,76,1)", scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  I gave — गोदान
                </motion.button>
                <motion.button
                  onClick={() => setChoice("didnot")}
                  className="px-5 py-2.5 border font-sans text-[11px] tracking-[0.35em] uppercase"
                  style={{ cursor: "pointer", borderColor: "rgba(139,21,21,0.3)", color: "rgba(201,74,74,0.5)" }}
                  whileHover={{ borderColor: "rgba(201,74,74,0.6)", color: "rgba(201,74,74,0.9)", scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  I did not
                </motion.button>
              </div>
            </motion.div>
          )}

          {choice === "gave" && (
            <motion.div
              key="gave"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center gap-3 max-w-lg"
            >
              <p
                className="font-sans text-sm leading-relaxed"
                style={{ color: "rgba(238,218,190,0.88)", textShadow: "0 1px 6px rgba(0,0,0,0.85)" }}
              >
                The cow you gave appears at the bank. She steps onto the waters.
                Her hooves find solid ground where there was none.
                You hold her tail. You cross.
              </p>
              <p className="font-sans text-[11px] tracking-[0.3em] uppercase mt-1" style={{ color: "rgba(201,168,76,0.6)" }}>
                गोदान — The gift of a cow crosses the Vaitaranī.
              </p>
              <button
                onClick={() => setChoice("none")}
                className="mt-3 font-sans text-[9px] tracking-[0.4em] uppercase text-foreground/20 hover:text-foreground/40 transition-colors"
                style={{ cursor: "pointer" }}
              >
                ← Return
              </button>
            </motion.div>
          )}

          {choice === "didnot" && (
            <motion.div
              key="didnot"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center gap-3 max-w-lg"
            >
              <p
                className="font-sans text-sm leading-relaxed"
                style={{ color: "rgba(238,200,195,0.88)", textShadow: "0 1px 6px rgba(0,0,0,0.85)" }}
              >
                There is no cow. The messengers of Yama drag you in.
                The river burns — it is boiling blood and pus. You cannot breathe.
                You cannot die. You simply experience it.
              </p>
              <p className="font-sans text-[11px] tracking-[0.3em] uppercase mt-1" style={{ color: "rgba(139,21,21,0.6)" }}>
                The Vaitaranī remembers nothing of mercy.
              </p>
              <button
                onClick={() => setChoice("none")}
                className="mt-3 font-sans text-[9px] tracking-[0.4em] uppercase text-foreground/20 hover:text-foreground/40 transition-colors"
                style={{ cursor: "pointer" }}
              >
                ← Return
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-8 flex items-center gap-3"
        >
          <div className="h-px w-8 bg-[#c94a4a]/30" />
          <span className="font-sans text-[10px] tracking-[0.5em] uppercase text-[#c94a4a]/40">
            वैतरणी नदी · Vaitaranī
          </span>
          <div className="h-px w-8 bg-[#c94a4a]/30" />
        </motion.div>
      </div>
    </div>
  );
}
