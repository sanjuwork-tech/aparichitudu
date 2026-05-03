import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Beat } from "@/data/realms";
import { useSoulStore } from "@/state/SoulStore";

interface Props {
  beat: Beat;
  theme: { glow: string; color: string };
}

const SINS = [
  { name: "Seizing another's wife",         hell: "Tāmisra",       hellDesc: "Absolute darkness — bound with ropes, beaten, cast into a void with no end" },
  { name: "Hoarding wealth, giving nothing", hell: "Mahāraurava",   hellDesc: "Ruru beasts devour the flesh while it regrows — forever, without pause" },
  { name: "Speaking false testimony",        hell: "Avīci",         hellDesc: "Cast from a mountain of stone — revived at the bottom, cast again, eternally" },
  { name: "Betraying a friend's trust",     hell: "Andhatāmisra",  hellDesc: "Blind darkness where the mind itself ceases — no thought, no self" },
  { name: "Striking your parents",          hell: "Kālasūtraka",   hellDesc: "Burnt on hot sand under a sun that never sets — no shade comes" },
  { name: "Breaking sacred vows",           hell: "Saṅghāta",      hellDesc: "Crushed between boulders like grain between millstones" },
  { name: "Ungrateful to benefactors",      hell: "Lohasaṅku",     hellDesc: "Iron spikes driven through the feet — dragged without mercy" },
  { name: "Harming living beings",          hell: "Raurava",       hellDesc: "Ringed by ruru beasts — as you caused pain, pain is administered" },
  { name: "Living only for yourself",       hell: "Mahāraurava",   hellDesc: "The self you guarded devours itself from the inside out" },
  { name: "Defiling water or ponds",        hell: "Putimṛttikā",   hellDesc: "Submerged in putrid earth — what you poisoned, you shall breathe" },
  { name: "Stealing from temples",          hell: "Tāpana",        hellDesc: "Impaled on a lance of white fire — the gods' property is returned in kind" },
  { name: "Burning or felling forests",     hell: "Sampratāpana",  hellDesc: "Engulfed in flames that will not go out until the trees you destroyed regrow" },
  { name: "Practicing hypocrisy",           hell: "Mahāniraya",    hellDesc: "The mask is permanently ripped away — you are seen as you are, forever" },
  { name: "Abandoning parents in old age",  hell: "Kālasūtraka",   hellDesc: "As they walked with no shade, you walk — through the Thread of Time's endless heat" },
  { name: "Trafficking living beings",      hell: "Lohitoda",      hellDesc: "Submerged in a lake of boiling blood — as you sold bodies, so your body" },
  { name: "Unchastity in thought and deed", hell: "Śālmali",       hellDesc: "The silk-cotton tree with iron thorns — embraced by what you desired" },
  { name: "Poisoning another's food",       hell: "Saviṣa",        hellDesc: "Forced to consume what you administered — it does not kill, it merely burns" },
  { name: "Stealing from the helpless",     hell: "Kāka",          hellDesc: "Iron-beaked crows peck what you stole from others — eternally restored" },
  { name: "Deceiving with false promises",  hell: "Ulu",           hellDesc: "Clawed by owl-demons in darkness — as you kept them in the dark" },
  { name: "Speaking ill of the departed",  hell: "Kāka",          hellDesc: "The words find their way back — spoken by crow-beaks against your own form" },
  { name: "Coveting another's possessions", hell: "Andhatāmisra",  hellDesc: "Desire that will never reach its object — blind forever, wanting forever" },
  { name: "Seizing another's child",        hell: "Tāmisra",       hellDesc: "Darkness that swallows completely — you search for what you took, and cannot find it" },
  { name: "Contaminating sacred waters",    hell: "Kudmala",       hellDesc: "Covered in pustules that burst and reform — the water you corrupted corrupts you" },
  { name: "Striking a woman",               hell: "Sañjīvana",     hellDesc: "Killed and revived and killed again — the hand remembers every blow" },
];

type Phase = "choice" | "judging" | "verdict";

interface FloatyText {
  id: number;
  x: number;
  y: number;
}

const JUDGING_LINES = [
  "The Book of Deeds is being opened.",
  "Chitragupta reads.",
  "The sun has witnessed. The moon has witnessed.",
  "Fire, wind, sky — all have witnessed.",
  "Nothing was missed.",
];

export function BeatVerdict({ beat, theme }: Props) {
  const [phase, setPhase] = useState<Phase>("choice");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [floaties, setFloaties] = useState<FloatyText[]>([]);
  const [shakingIdx, setShakingIdx] = useState<number | null>(null);
  const [judgingLine, setJudgingLine] = useState(0);
  const [nextId, setNextId] = useState(0);

  const { update } = useSoulStore();
  useEffect(() => {
    update({ sins: Array.from(selected).map((i) => SINS[i].name) });
  }, [selected]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleSin = useCallback((idx: number, e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
        setShakingIdx(idx);
        setTimeout(() => setShakingIdx(null), 500);
        setFloaties((f) => [...f, { id: nextId, x, y }]);
        setNextId((n) => n + 1);
      }
      return next;
    });
  }, [nextId]);

  const removeFloaty = useCallback((id: number) => {
    setFloaties((f) => f.filter((fl) => fl.id !== id));
  }, []);

  const receiveVerdict = useCallback(() => {
    setPhase("judging");
    setJudgingLine(0);
  }, []);

  useEffect(() => {
    if (phase !== "judging") return;
    if (judgingLine < JUDGING_LINES.length) {
      const t = setTimeout(() => setJudgingLine((l) => l + 1), 900);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setPhase("verdict"), 600);
      return () => clearTimeout(t);
    }
  }, [phase, judgingLine]);

  const reset = useCallback(() => {
    setSelected(new Set());
    setPhase("choice");
    setJudgingLine(0);
  }, []);

  const uniqueHells = Array.from(
    new Map(
      Array.from(selected).map((i) => [SINS[i].hell, SINS[i]])
    ).values()
  );

  return (
    <div className="relative flex flex-col h-full overflow-hidden">
      {/* Dark atmospheric bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 80%, rgba(80,5,5,0.55) 0%, rgba(5,2,2,0.95) 80%)",
        }}
      />

      <AnimatePresence mode="wait">

        {/* ─── PHASE: CHOICE ─── */}
        {phase === "choice" && (
          <motion.div
            key="choice"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 flex flex-col h-full overflow-hidden"
          >
            {/* Header */}
            <div className="flex-shrink-0 px-6 md:px-14 pt-14 pb-4 flex items-start justify-between">
              <div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="font-sans text-[9px] tracking-[0.5em] uppercase mb-2"
                  style={{ color: "#c94a4a80" }}
                >
                  चित्रगुप्त का आदेश
                </motion.p>
                <motion.h2
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="font-serif font-bold leading-tight"
                  style={{
                    fontSize: "clamp(1.6rem, 4vw, 2.8rem)",
                    color: "#c94a4a",
                    filter: "drop-shadow(0 0 20px rgba(139,21,21,0.6))",
                  }}
                >
                  Touch what you have done.
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="font-sans text-xs text-foreground/35 mt-1.5 max-w-sm"
                >
                  {beat.sub ?? "The sun, moon, fire, and your own heart witnessed every act. Chitragupta's book is already written."}
                </motion.p>
              </div>

              {/* Sin counter */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: selected.size > 0 ? 1 : 0.2, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="flex-shrink-0 text-right"
              >
                <div
                  className="font-sans text-[11px] tracking-[0.3em] uppercase"
                  style={{ color: "#c94a4a60" }}
                >
                  पाप
                </div>
                <motion.div
                  key={selected.size}
                  initial={{ scale: 1.4, color: "#ff3333" }}
                  animate={{ scale: 1, color: "#c94a4a" }}
                  transition={{ duration: 0.3 }}
                  className="font-serif text-3xl font-bold"
                  style={{ color: "#c94a4a" }}
                >
                  {selected.size}
                </motion.div>
              </motion.div>
            </div>

            {/* Sin grid */}
            <div className="flex-1 overflow-y-auto px-6 md:px-14 pb-2 scrollbar-thin">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {SINS.map((sin, i) => {
                  const isSelected = selected.has(i);
                  const isShaking = shakingIdx === i;
                  return (
                    <motion.button
                      key={i}
                      onClick={(e) => toggleSin(i, e)}
                      className="relative text-left p-3 rounded-sm border transition-all duration-300 overflow-visible"
                      style={{
                        cursor: "pointer",
                        background: isSelected
                          ? "rgba(139,21,21,0.25)"
                          : "rgba(10,5,5,0.6)",
                        borderColor: isSelected
                          ? "#c94a4a60"
                          : "rgba(201,168,76,0.08)",
                        boxShadow: isSelected
                          ? "0 0 12px rgba(139,21,21,0.4), inset 0 0 20px rgba(139,21,21,0.1)"
                          : "none",
                      }}
                      animate={
                        isShaking
                          ? { x: [-4, 4, -4, 4, 0], y: [-2, 2, -2, 0] }
                          : { x: 0, y: 0 }
                      }
                      transition={isShaking ? { duration: 0.35 } : {}}
                      whileHover={{
                        scale: 1.04,
                        borderColor: "rgba(201,74,74,0.3)",
                        background: isSelected
                          ? "rgba(139,21,21,0.35)"
                          : "rgba(40,10,10,0.7)",
                      }}
                      whileTap={{ scale: 0.96 }}
                    >
                      {/* Crimson flood fill on select */}
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute inset-0 rounded-sm pointer-events-none"
                          style={{
                            background:
                              "radial-gradient(circle at 50% 50%, rgba(139,21,21,0.3) 0%, transparent 70%)",
                          }}
                        />
                      )}

                      <p
                        className="font-sans text-[10px] leading-snug relative z-10"
                        style={{
                          color: isSelected ? "#e88080" : "rgba(201,168,76,0.5)",
                        }}
                      >
                        {sin.name}
                      </p>

                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5">
                          <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{
                              background: "#c94a4a",
                              boxShadow: "0 0 4px #c94a4a",
                            }}
                          />
                        </div>
                      )}

                      {/* Floating +1 पाप */}
                      <AnimatePresence>
                        {floaties
                          .filter((f) => SINS.indexOf(sin) === i)
                          .map((f) => (
                            <motion.span
                              key={f.id}
                              initial={{ opacity: 1, y: 0, x: 0 }}
                              animate={{ opacity: 0, y: -40 }}
                              transition={{ duration: 0.8 }}
                              onAnimationComplete={() => removeFloaty(f.id)}
                              className="absolute pointer-events-none font-sans text-[10px] font-bold"
                              style={{
                                left: f.x,
                                top: f.y,
                                color: "#ff4444",
                                textShadow: "0 0 8px #ff4444",
                                zIndex: 50,
                              }}
                            >
                              +1 पाप
                            </motion.span>
                          ))}
                      </AnimatePresence>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Verdict button */}
            <div className="flex-shrink-0 px-6 md:px-14 py-5 flex items-center justify-between">
              <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-foreground/20">
                {selected.size === 0
                  ? "The book is open."
                  : selected.size === 1
                  ? "One mark upon your soul."
                  : `${selected.size} marks upon your soul.`}
              </p>
              <AnimatePresence>
                {selected.size > 0 && (
                  <motion.button
                    key="verdict-btn"
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={receiveVerdict}
                    className="relative px-6 py-3 border font-sans text-[11px] tracking-[0.35em] uppercase overflow-hidden"
                    style={{
                      cursor: "pointer",
                      borderColor: "#c94a4a60",
                      color: "#c94a4a",
                    }}
                    whileHover={{ borderColor: "#c94a4a", color: "#e88080" }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      animate={{ opacity: [0.08, 0.2, 0.08] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                      style={{
                        background:
                          "radial-gradient(ellipse at center, rgba(139,21,21,0.6) 0%, transparent 70%)",
                      }}
                    />
                    <span className="relative z-10">Receive Your Verdict</span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ─── PHASE: JUDGING ─── */}
        {phase === "judging" && (
          <motion.div
            key="judging"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 flex flex-col h-full items-center justify-center px-8"
          >
            <motion.div
              className="absolute inset-0"
              animate={{ opacity: [0.6, 0.9, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ background: "rgba(5,1,1,0.92)" }}
            />
            <div className="relative z-10 flex flex-col items-center gap-6 text-center max-w-lg">
              <motion.div
                animate={{ rotate: [0, 1, -1, 0], scale: [1, 1.02, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="font-serif text-lg tracking-[0.3em] uppercase"
                style={{
                  color: "#c94a4a80",
                  filter: "drop-shadow(0 0 10px rgba(139,21,21,0.5))",
                }}
              >
                ॐ
              </motion.div>
              <div className="flex flex-col gap-3 min-h-[120px]">
                {JUDGING_LINES.slice(0, judgingLine).map((line, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: i === judgingLine - 1 ? 1 : 0.35, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="font-sans text-sm tracking-widest"
                    style={{ color: i === judgingLine - 1 ? "#e88080" : "#c94a4a60" }}
                  >
                    {line}
                  </motion.p>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── PHASE: VERDICT ─── */}
        {phase === "verdict" && (
          <motion.div
            key="verdict"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 flex flex-col h-full overflow-hidden"
          >
            <div className="absolute inset-0" style={{ background: "rgba(4,1,1,0.96)" }} />

            <div className="relative z-10 flex flex-col h-full overflow-y-auto px-6 md:px-14 py-12">
              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex-shrink-0 text-center mb-8"
              >
                <p className="font-sans text-[9px] tracking-[0.5em] uppercase mb-2" style={{ color: "#c94a4a50" }}>
                  चित्रगुप्त का निर्णय
                </p>
                <h2
                  className="font-serif font-bold"
                  style={{
                    fontSize: "clamp(2rem, 5vw, 3.5rem)",
                    color: "#c94a4a",
                    filter: "drop-shadow(0 0 30px rgba(139,21,21,0.8))",
                  }}
                >
                  {selected.size === 0
                    ? "You are free."
                    : "The verdict is written."}
                </h2>
                <p className="font-sans text-sm text-foreground/40 mt-2">
                  {selected.size === 0
                    ? "No sin was found. The gates of Svarga open."
                    : `You carry ${selected.size} mark${selected.size > 1 ? "s" : ""} of sin. ${uniqueHells.length} realm${uniqueHells.length > 1 ? "s" : ""} await${uniqueHells.length === 1 ? "s" : ""} you.`}
                </p>
              </motion.div>

              {/* Hell list */}
              {uniqueHells.length > 0 && (
                <div className="flex flex-col gap-4 mb-8">
                  {uniqueHells.map((sin, i) => (
                    <motion.div
                      key={sin.hell}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.18, duration: 0.6 }}
                      className="border-l-2 pl-5 py-2"
                      style={{ borderColor: "#c94a4a60" }}
                    >
                      <div className="flex items-baseline gap-3 mb-1">
                        <span
                          className="font-serif font-bold text-base md:text-xl"
                          style={{
                            color: "#c94a4a",
                            filter: "drop-shadow(0 0 10px rgba(139,21,21,0.5))",
                          }}
                        >
                          {sin.hell}
                        </span>
                        <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-foreground/25">
                          नरक
                        </span>
                      </div>
                      <p className="font-sans text-xs leading-relaxed text-foreground/45">
                        {sin.hellDesc}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Final sentence */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + uniqueHells.length * 0.18 + 0.5, duration: 1 }}
                className="border border-[#c94a4a20] p-5 text-center mb-8"
              >
                <p className="font-sans text-xs leading-relaxed text-foreground/40 italic">
                  {selected.size === 0
                    ? "Karma is exhausted. The soul rises toward light."
                    : `Your soul shall cycle through these realms until the karma accumulated in this life is fully consumed. Then — and only then — will rebirth come.`}
                </p>
              </motion.div>

              {/* Reset */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + uniqueHells.length * 0.18 + 1.2 }}
                className="flex justify-center"
              >
                <button
                  onClick={reset}
                  className="font-sans text-[10px] tracking-[0.4em] uppercase px-5 py-2.5 border"
                  style={{
                    cursor: "pointer",
                    borderColor: "rgba(201,168,76,0.15)",
                    color: "rgba(201,168,76,0.35)",
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.borderColor = "rgba(201,168,76,0.4)";
                    (e.target as HTMLElement).style.color = "rgba(201,168,76,0.7)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.borderColor = "rgba(201,168,76,0.15)";
                    (e.target as HTMLElement).style.color = "rgba(201,168,76,0.35)";
                  }}
                >
                  Clear the record
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
