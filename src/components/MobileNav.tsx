import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { realms } from "@/data/realms";
import { useSoulStore, getCompletedRealms } from "@/state/SoulStore";

const THEME_COLOR: Record<string, string> = {
  crimson:    "#c94a4a",
  gold:       "#c9a84c",
  silver:     "#6eb4d8",
  liberation: "#c8e8ff",
};

const SYMBOL: Record<string, string> = {
  descent:    "↓",
  hells:      "⬥",
  rites:      "◎",
  justice:    "⚖",
  liberation: "◯",
};

const SHORT: Record<string, string> = {
  descent:    "Descent",
  hells:      "Hells",
  rites:      "Rites",
  justice:    "Justice",
  liberation: "Liberation",
};

export function MobileNav() {
  const [activeId, setActiveId]   = useState<string | null>(null);
  const [visible, setVisible]     = useState(false);
  const [expanded, setExpanded]   = useState<string | null>(null);
  const { record } = useSoulStore();
  const completed = getCompletedRealms(record);

  // Show bar only after user scrolls past the hero
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track active realm via IntersectionObserver
  useEffect(() => {
    const observers = realms.map((realm) => {
      const el = document.getElementById(`realm-${realm.id}`);
      if (!el) return null;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => { if (e.isIntersecting) setActiveId(realm.id); });
        },
        { threshold: 0.15 }
      );
      observer.observe(el);
      return { observer, el };
    });
    return () => observers.forEach((o) => o?.observer.unobserve(o.el));
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(`realm-${id}`)?.scrollIntoView({ behavior: "smooth" });
    setExpanded(null);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
          style={{
            background: "rgba(8,5,3,0.94)",
            borderTop: "1px solid rgba(201,168,76,0.12)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            paddingBottom: "env(safe-area-inset-bottom, 0px)",
          }}
        >
          {/* Expanded tooltip strip (realm full title) */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                key={expanded}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2 }}
                className="px-4 pt-2 pb-0 text-center pointer-events-none"
              >
                {(() => {
                  const r = realms.find((x) => x.id === expanded);
                  if (!r) return null;
                  const color = THEME_COLOR[r.theme];
                  return (
                    <p
                      className="font-serif text-xs tracking-wide"
                      style={{ color }}
                    >
                      {r.title}
                      <span className="font-sans text-[8px] tracking-[0.4em] uppercase ml-2 opacity-50">
                        {r.tagline.slice(0, 32)}…
                      </span>
                    </p>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tab items */}
          <div className="flex items-stretch">
            {realms.map((realm) => {
              const isActive  = activeId === realm.id;
              const isDone    = completed.has(realm.id);
              const color     = THEME_COLOR[realm.theme];
              const symbol    = SYMBOL[realm.id] ?? "◈";
              const shortName = SHORT[realm.id] ?? realm.nav;

              return (
                <button
                  key={realm.id}
                  onClick={() => scrollTo(realm.id)}
                  onTouchStart={() => setExpanded(expanded === realm.id ? null : realm.id)}
                  className="relative flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 transition-all duration-300 active:scale-95"
                  style={{ cursor: "pointer", WebkitTapHighlightColor: "transparent" }}
                >
                  {/* Active glow backdrop */}
                  {isActive && (
                    <motion.div
                      layoutId="mobileActiveRealm"
                      className="absolute inset-x-1 inset-y-0 rounded-sm pointer-events-none"
                      style={{
                        background: `linear-gradient(to bottom, ${color}15, transparent)`,
                        borderTop: `2px solid ${color}60`,
                      }}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}

                  {/* Symbol */}
                  <motion.span
                    animate={{
                      color:  isActive ? color : "rgba(180,155,120,0.35)",
                      filter: isActive ? `drop-shadow(0 0 6px ${color})` : "none",
                      scale:  isActive ? 1.15 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    className="text-base leading-none relative"
                    style={{ fontFamily: "serif" }}
                  >
                    {symbol}
                    {/* Completion marker */}
                    {isDone && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute -top-1 -right-2 text-[7px] leading-none"
                        style={{ color, filter: `drop-shadow(0 0 3px ${color})` }}
                      >
                        ✦
                      </motion.span>
                    )}
                  </motion.span>

                  {/* Label */}
                  <motion.span
                    animate={{
                      color: isActive ? color : "rgba(180,155,120,0.3)",
                    }}
                    transition={{ duration: 0.3 }}
                    className="font-sans text-[8px] tracking-[0.25em] uppercase leading-none"
                  >
                    {shortName}
                  </motion.span>
                </button>
              );
            })}

            {/* Scroll-to-top button (Liberation / end) */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 transition-all duration-300 active:scale-95"
              style={{ cursor: "pointer", WebkitTapHighlightColor: "transparent" }}
            >
              <motion.span
                className="text-base leading-none"
                style={{ color: "rgba(180,155,120,0.25)" }}
                whileTap={{ color: "rgba(200,232,255,0.7)" }}
              >
                ↑
              </motion.span>
              <span className="font-sans text-[8px] tracking-[0.25em] uppercase leading-none" style={{ color: "rgba(180,155,120,0.2)" }}>
                Top
              </span>
            </button>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
