import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { realms } from "@/data/realms";
import { useSoulStore, getCompletedRealms } from "@/state/SoulStore";

const themeColor = (theme: string) => {
  if (theme === "crimson") return "#c94a4a";
  if (theme === "silver") return "#6eb4d8";
  if (theme === "liberation") return "#c8e8ff";
  return "#c9a84c";
};

export function RealmNav() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [tooltip, setTooltip] = useState<string | null>(null);
  const { record } = useSoulStore();
  const completed = getCompletedRealms(record);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observers = realms.map((realm) => {
      const el = document.getElementById(`realm-${realm.id}`);
      if (!el) return null;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => { if (e.isIntersecting) setActiveId(realm.id); });
        },
        { threshold: 0.1 }
      );
      observer.observe(el);
      return { observer, el };
    });
    return () => observers.forEach((o) => o?.observer.unobserve(o.el));
  }, []);

  const activeRealm = realms.find((r) => r.id === activeId);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 hidden md:block transition-all duration-500"
      style={{
        background: scrolled ? "rgba(10,8,5,0.92)" : "linear-gradient(to bottom, rgba(10,8,5,0.6), transparent)",
        borderBottom: scrolled ? "1px solid rgba(201,168,76,0.1)" : "none",
        backdropFilter: scrolled ? "blur(12px)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-serif text-primary font-bold tracking-widest text-sm hover:text-primary/80 transition-colors"
        >
          GARUDA PURĀṆA
        </button>

        {/* Realm pills */}
        <ul className="flex items-center gap-1">
          {realms.map((realm) => {
            const isActive = activeId === realm.id;
            const color = themeColor(realm.theme);
            return (
              <li key={realm.id} className="relative">
                <button
                  onClick={() =>
                    document.getElementById(`realm-${realm.id}`)?.scrollIntoView({ behavior: "smooth" })
                  }
                  onMouseEnter={() => setTooltip(realm.id)}
                  onMouseLeave={() => setTooltip(null)}
                  className="relative font-serif text-xs px-3 py-1.5 transition-all duration-300"
                  style={{
                    color: isActive ? color : "rgba(200,180,150,0.35)",
                    textShadow: isActive ? `0 0 12px ${color}` : "none",
                  }}
                >
                  {realm.nav}
                  {completed.has(realm.id) && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute -top-0.5 -right-1 text-[7px] leading-none"
                      style={{ color: color, filter: `drop-shadow(0 0 4px ${color})` }}
                    >
                      ✦
                    </motion.span>
                  )}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        layoutId="activeRealm"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-4"
                        style={{ background: color, boxShadow: `0 0 6px ${color}` }}
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        exit={{ opacity: 0, scaleX: 0 }}
                      />
                    )}
                  </AnimatePresence>
                </button>

                <AnimatePresence>
                  {tooltip === realm.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 pointer-events-none whitespace-nowrap"
                    >
                      <div
                        className="px-3 py-1.5 font-sans text-xs"
                        style={{
                          background: "rgba(10,8,5,0.95)",
                          border: `1px solid ${color}25`,
                          color: "rgba(200,180,150,0.75)",
                        }}
                      >
                        {realm.title}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>

        {/* Current realm label */}
        <AnimatePresence mode="wait">
          {activeRealm && (
            <motion.span
              key={activeRealm.id}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.3 }}
              className="font-sans text-xs text-foreground/25 tracking-wider max-w-[180px] truncate"
            >
              {activeRealm.tagline}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
