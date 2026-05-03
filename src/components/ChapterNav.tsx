import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { chapters } from "@/data/chapters";

const themeColor = (theme: string) =>
  theme === "crimson" ? "#c94a4a" : theme === "silver" ? "#6eb4d8" : "#c9a84c";

export function ChapterNav() {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [showTooltip, setShowTooltip] = useState<number | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observers = chapters.map((chapter) => {
      const el = document.getElementById(`chapter-${chapter.id}`);
      if (!el) return null;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => { if (e.isIntersecting) setActiveId(chapter.id); });
        },
        { threshold: 0.25 }
      );
      observer.observe(el);
      return { observer, el };
    });
    return () => observers.forEach((o) => o?.observer.unobserve(o.el));
  }, []);

  const activeChapter = chapters.find((c) => c.id === activeId);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 hidden md:block transition-all duration-500"
      style={{
        background: scrolled
          ? "rgba(10,8,5,0.92)"
          : "linear-gradient(to bottom, rgba(10,8,5,0.7), transparent)",
        borderBottom: scrolled ? "1px solid rgba(201,168,76,0.12)" : "none",
        backdropFilter: scrolled ? "blur(12px)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-serif text-primary font-bold tracking-widest text-base hover:text-primary/80 transition-colors"
        >
          GARUDA PURĀṆA
        </button>

        {/* Chapter pills */}
        <ul className="flex items-center gap-0.5">
          {chapters.map((chapter) => {
            const isActive = activeId === chapter.id;
            const color = themeColor(chapter.theme);
            return (
              <li key={chapter.id} className="relative">
                <button
                  onClick={() =>
                    document
                      .getElementById(`chapter-${chapter.id}`)
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  onMouseEnter={() => setShowTooltip(chapter.id)}
                  onMouseLeave={() => setShowTooltip(null)}
                  className="relative font-serif text-xs px-2.5 py-1.5 transition-all duration-300"
                  style={{
                    color: isActive ? color : "rgba(200,180,150,0.4)",
                    textShadow: isActive ? `0 0 10px ${color}` : "none",
                  }}
                >
                  {chapter.roman}
                  {/* Active underline */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        layoutId="activeChapter"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-4"
                        style={{ background: color, boxShadow: `0 0 6px ${color}` }}
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        exit={{ opacity: 0, scaleX: 0 }}
                      />
                    )}
                  </AnimatePresence>
                </button>

                {/* Tooltip */}
                <AnimatePresence>
                  {showTooltip === chapter.id && (
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
                          border: `1px solid ${color}30`,
                          color: "rgba(200,180,150,0.8)",
                          boxShadow: `0 4px 16px rgba(0,0,0,0.6)`,
                        }}
                      >
                        {chapter.title}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>

        {/* Current chapter label */}
        <AnimatePresence mode="wait">
          {activeChapter && (
            <motion.span
              key={activeChapter.id}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.3 }}
              className="font-sans text-xs text-foreground/30 tracking-wider max-w-[160px] truncate"
            >
              {activeChapter.title}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
