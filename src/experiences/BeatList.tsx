import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
import type { Beat } from "@/data/realms";
import { useSoulStore } from "@/state/SoulStore";

interface Props {
  beat: Beat;
  theme: { glow: string; color: string };
}

const BODY_PARTS = [
  "Head", "Eyes & Ears", "Throat", "Back", "Stomach",
  "Thighs", "Legs", "Feet", "Hunger stirs", "Body complete",
];

function RitesItem({
  item, index, color, glow, offered, onOffer,
}: {
  item: { name: string; desc?: string };
  index: number;
  color: string;
  glow: string;
  offered: boolean;
  onOffer: () => void;
}) {
  const [ripple, setRipple] = useState(false);

  const handleClick = useCallback(() => {
    if (offered) return;
    setRipple(true);
    setTimeout(() => setRipple(false), 700);
    onOffer();
  }, [offered, onOffer]);

  const bodyPart = BODY_PARTS[index] ?? "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      onClick={handleClick}
      className="relative overflow-hidden"
      style={{ cursor: "pointer" }}
    >
      <motion.div
        className="flex items-center gap-4 px-4 py-3 border rounded-sm transition-all duration-400"
        style={{
          borderColor: offered ? `${color}50` : `${color}15`,
          background: offered ? `${color}10` : "transparent",
          boxShadow: offered ? `0 0 14px ${glow}` : "none",
        }}
        whileHover={offered ? {} : {
          borderColor: `${color}35`,
          background: `${color}08`,
          scale: 1.01,
        }}
        whileTap={offered ? {} : { scale: 0.98 }}
      >
        {/* Rice ball indicator */}
        <div className="relative flex-shrink-0 w-9 h-9 flex items-center justify-center">
          <motion.div
            className="rounded-full"
            animate={
              offered
                ? { scale: 1, opacity: 1 }
                : { scale: 0.55, opacity: 0.3 }
            }
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              width: 28, height: 28,
              background: offered
                ? `radial-gradient(circle, ${color}cc 0%, ${color}40 60%, transparent 100%)`
                : `radial-gradient(circle, ${color}40 0%, transparent 80%)`,
              boxShadow: offered ? `0 0 12px ${glow}` : "none",
            }}
          />
          {offered && (
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute rounded-full"
              style={{
                width: 28, height: 28,
                background: `radial-gradient(circle, ${color}60 0%, transparent 70%)`,
              }}
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="font-serif text-sm md:text-base transition-colors duration-300"
              style={{ color: offered ? color : "hsl(var(--foreground)/0.7)" }}
            >
              {item.name}
            </span>
            {offered && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-sans text-[9px] tracking-[0.3em] uppercase"
                style={{ color: `${color}70` }}
              >
                Offered
              </motion.span>
            )}
          </div>
          {item.desc && (
            <p className="font-sans text-[11px] text-foreground/35 mt-0.5 leading-snug">
              {item.desc}
            </p>
          )}
        </div>

        {offered && bodyPart && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex-shrink-0 font-sans text-[9px] tracking-[0.25em] uppercase text-right"
            style={{ color: `${color}55` }}
          >
            {bodyPart}
          </motion.span>
        )}
      </motion.div>

      {/* Ripple on click */}
      <AnimatePresence>
        {ripple && (
          <motion.div
            key="ripple"
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{}}
            transition={{ duration: 0.6 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{ width: 40, height: 40, background: `${color}40` }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function BeatList({ beat, theme }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [offered, setOffered] = useState<Set<number>>(new Set());
  const items = beat.items ?? [];
  const isRites = beat.performable === true;

  const { update } = useSoulStore();

  const offerItem = useCallback((i: number) => {
    setOffered((prev) => {
      const next = new Set(prev);
      next.add(i);
      update({ offeredRites: next.size });
      return next;
    });
  }, [update]); // eslint-disable-line react-hooks/exhaustive-deps

  const allOffered = offered.size === items.length && items.length > 0;

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      {/* Header */}
      <div className="px-8 md:px-16 pt-14 pb-4 flex-shrink-0 flex items-start justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p
            className="font-sans text-xs tracking-[0.5em] uppercase mb-3"
            style={{ color: theme.color + "60" }}
          >
            {beat.sub}
          </p>
          <h3
            className="font-serif text-3xl md:text-5xl"
            style={{ color: theme.color, filter: `drop-shadow(0 0 20px ${theme.glow})` }}
          >
            {beat.label}
          </h3>
          <div
            className="h-px mt-4 w-24"
            style={{ background: `linear-gradient(to right, ${theme.color}60, transparent)` }}
          />
        </motion.div>

        {/* Rice ball body progress for rites */}
        {isRites && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-right flex flex-col items-end gap-1"
          >
            <p className="font-sans text-[9px] tracking-[0.4em] uppercase" style={{ color: `${theme.color}50` }}>
              पिण्ड
            </p>
            <div className="flex gap-1 flex-wrap justify-end max-w-[120px]">
              {items.map((_, i) => (
                <motion.div
                  key={i}
                  animate={offered.has(i) ? { scale: 1, opacity: 1 } : { scale: 0.6, opacity: 0.2 }}
                  transition={{ duration: 0.4 }}
                  className="rounded-full"
                  style={{
                    width: 8, height: 8,
                    background: offered.has(i)
                      ? `radial-gradient(circle, ${theme.color} 0%, ${theme.color}60 100%)`
                      : `${theme.color}20`,
                    boxShadow: offered.has(i) ? `0 0 6px ${theme.glow}` : "none",
                  }}
                />
              ))}
            </div>
            <p className="font-sans text-[9px]" style={{ color: `${theme.color}40` }}>
              {offered.size}/{items.length}
            </p>
          </motion.div>
        )}
      </div>

      {/* Performable rites instruction */}
      {isRites && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="px-8 md:px-16 pb-3 font-sans text-[10px] tracking-[0.35em] uppercase flex-shrink-0"
          style={{ color: `${theme.color}35` }}
        >
          {allOffered
            ? "The body is complete. The soul may now walk the road."
            : "Touch each day to perform the offering."}
        </motion.p>
      )}

      {/* All offered celebration */}
      <AnimatePresence>
        {allOffered && isRites && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="px-8 md:px-16 pb-3 flex-shrink-0"
          >
            <div
              className="border px-4 py-3 font-sans text-xs text-center leading-relaxed"
              style={{ borderColor: `${theme.color}30`, color: `${theme.color}70` }}
            >
              The ten rice-balls have been offered. The subtle body is whole.
              The departed soul stands ready — fed by your love — for the journey ahead.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-8 md:px-16 pb-16">
        {isRites ? (
          <div className="flex flex-col gap-2 max-w-xl">
            {items.map((item, i) => (
              <RitesItem
                key={i}
                item={item}
                index={i}
                color={theme.color}
                glow={theme.glow}
                offered={offered.has(i)}
                onOffer={() => offerItem(i)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 md:gap-3 max-w-5xl">
            {items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, delay: i * 0.045, ease: "easeOut" }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className="relative group"
              >
                <div
                  className="px-4 py-3 transition-all duration-300"
                  style={{
                    border: `1px solid ${hovered === i ? theme.color + "80" : theme.color + "20"}`,
                    background: hovered === i ? theme.color + "12" : "transparent",
                    boxShadow: hovered === i ? `0 0 16px ${theme.glow}` : "none",
                    minWidth: "9rem",
                    cursor: "default",
                  }}
                >
                  <div className="flex items-start gap-2">
                    <span className="font-sans text-[10px] mt-0.5 flex-shrink-0" style={{ color: theme.color + "40" }}>
                      {i + 1}.
                    </span>
                    <div>
                      <p
                        className="font-serif text-sm md:text-base transition-colors duration-300"
                        style={{ color: hovered === i ? theme.color : "hsl(var(--foreground))" }}
                      >
                        {item.name}
                      </p>
                      {item.desc && (
                        <motion.p
                          initial={{ height: 0, opacity: 0 }}
                          animate={hovered === i ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="font-sans text-xs text-foreground/50 overflow-hidden mt-1 leading-snug max-w-[16rem]"
                        >
                          {item.desc}
                        </motion.p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
