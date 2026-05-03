import { useEffect, useRef, useState } from "react";
import { motion, useSpring, AnimatePresence } from "framer-motion";
import { realms } from "@/data/realms";

const REALM_COLORS: Record<string, string> = {
  descent:    "#c94a4a",
  hells:      "#a83030",
  rites:      "#c9a84c",
  justice:    "#6eb4d8",
  liberation: "#c8e8ff",
};

// Map each realm id to its approximate scroll fraction (0–1)
// We'll compute these dynamically from DOM positions
interface Waypoint {
  id: string;
  label: string;
  color: string;
  fraction: number;
}

const LABELS: Record<string, string> = {
  hero:        "Life",
  descent:     "Descent",
  hells:       "The Hells",
  rites:       "The Rites",
  justice:     "Justice",
  liberation:  "Liberation",
};

export function SoulProgress() {
  const [progress, setProgress] = useState(0);
  const [activeRealm, setActiveRealm] = useState("hero");
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [visible, setVisible] = useState(false);
  const rafRef = useRef<number>(0);

  // Compute waypoints from DOM after mount
  useEffect(() => {
    const compute = () => {
      const totalH = document.documentElement.scrollHeight - window.innerHeight;
      if (totalH <= 0) return;

      const points: Waypoint[] = [];

      // Hero at top
      points.push({ id: "hero", label: "Life", color: "#c9a84c", fraction: 0.01 });

      // Each realm
      realms.forEach((r) => {
        const el = document.getElementById(`realm-${r.id}`);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          points.push({
            id: r.id,
            label: LABELS[r.id] ?? r.title,
            color: REALM_COLORS[r.id] ?? "#c9a84c",
            fraction: Math.min(0.98, top / totalH),
          });
        }
      });

      // Liberation at very bottom
      points.push({ id: "end", label: "Moksha", color: "#c8e8ff", fraction: 0.98 });

      setWaypoints(points);
    };

    // Slight delay to allow DOM to settle after mount
    const t = setTimeout(compute, 800);
    return () => clearTimeout(t);
  }, []);

  // Track scroll progress
  useEffect(() => {
    let lastScrollY = -1;

    const update = () => {
      const scrollY = window.scrollY;
      if (scrollY === lastScrollY) {
        rafRef.current = requestAnimationFrame(update);
        return;
      }
      lastScrollY = scrollY;

      const totalH = document.documentElement.scrollHeight - window.innerHeight;
      const p = totalH > 0 ? Math.min(1, scrollY / totalH) : 0;
      setProgress(p);
      setVisible(scrollY > window.innerHeight * 0.3);

      // Detect active realm
      const sorted = [...realms].reverse();
      for (const r of sorted) {
        const el = document.getElementById(`realm-${r.id}`);
        if (el) {
          const top = el.getBoundingClientRect().top;
          if (top <= window.innerHeight * 0.6) {
            setActiveRealm(r.id);
            break;
          }
        }
      }

      rafRef.current = requestAnimationFrame(update);
    };
    rafRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const soulY = useSpring(progress, { stiffness: 60, damping: 20 });
  const currentColor = REALM_COLORS[activeRealm] ?? "#c9a84c";

  const LINE_HEIGHT = 360; // px of the visible track

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.8 }}
          className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center select-none pointer-events-none"
          style={{ height: LINE_HEIGHT }}
        >
          {/* Track line */}
          <div
            className="absolute left-1/2 -translate-x-1/2 w-px"
            style={{
              height: "100%",
              background: "linear-gradient(to bottom, rgba(201,168,76,0.08), rgba(201,168,76,0.25), rgba(201,168,76,0.08))",
            }}
          />

          {/* Filled progress line */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 w-px top-0 origin-top"
            style={{
              height: `${Math.min(100, progress * 100)}%`,
              background: `linear-gradient(to bottom, rgba(201,168,76,0.3), ${currentColor}80)`,
              transition: "height 0.6s ease, background 1.5s ease",
            }}
          />

          {/* Waypoint dots */}
          {waypoints.map((wp) => (
            <div
              key={wp.id}
              className="absolute left-1/2 -translate-x-1/2 flex items-center pointer-events-auto cursor-pointer group"
              style={{ top: `${wp.fraction * 100}%` }}
              onClick={() => {
                if (wp.id === "hero") window.scrollTo({ top: 0, behavior: "smooth" });
                else if (wp.id === "end") window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
                else document.getElementById(`realm-${wp.id}`)?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {/* Dot */}
              <div
                className="w-1.5 h-1.5 rounded-full transition-all duration-500"
                style={{
                  background: progress >= wp.fraction ? wp.color : "rgba(201,168,76,0.2)",
                  boxShadow: progress >= wp.fraction ? `0 0 6px ${wp.color}` : "none",
                  transform: activeRealm === wp.id ? "scale(1.8)" : "scale(1)",
                }}
              />

              {/* Label — appears on hover */}
              <div
                className="absolute right-5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ color: wp.color }}
              >
                <span className="font-sans text-[10px] tracking-[0.3em] uppercase">{wp.label}</span>
              </div>
            </div>
          ))}

          {/* Soul glyph — the travelling dot */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
            style={{ top: `${progress * 100}%`, translateX: "-50%", translateY: "-50%" }}
            transition={{ type: "spring", stiffness: 60, damping: 20 }}
          >
            {/* Outer pulse ring */}
            <motion.div
              className="absolute rounded-full -translate-x-1/2 -translate-y-1/2"
              animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: 16,
                height: 16,
                background: `radial-gradient(circle, ${currentColor}60 0%, transparent 70%)`,
                transition: "background 1.5s ease",
              }}
            />
            {/* Glowing soul dot */}
            <motion.div
              className="w-2.5 h-2.5 rounded-full -translate-x-1/2 -translate-y-1/2 absolute"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              style={{
                background: currentColor,
                boxShadow: `0 0 8px ${currentColor}, 0 0 20px ${currentColor}60`,
                transition: "background 1.5s ease, box-shadow 1.5s ease",
              }}
            />
          </motion.div>

          {/* Top label */}
          <div
            className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap"
            style={{ color: "rgba(201,168,76,0.3)" }}
          >
            <span className="font-sans text-[9px] tracking-[0.3em] uppercase">Birth</span>
          </div>

          {/* Bottom label */}
          <div
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap"
            style={{ color: "rgba(180,220,255,0.4)" }}
          >
            <span className="font-sans text-[9px] tracking-[0.3em] uppercase">Mokṣa</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
