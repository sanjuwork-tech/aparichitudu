import { useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import { ParticleCanvas } from "@/effects/ParticleCanvas";
import { useMouseParallax } from "@/hooks/useMouseParallax";

const VERSES = [
  "As the sun dispels the darkness of the night, so does knowledge dispel ignorance.",
  "The body is unreal — the Self alone is real. Knowing this, one crosses beyond death.",
];

interface Ripple { id: number; x: number; y: number }

export function Liberation() {
  const ref = useRef<HTMLElement>(null);
  const mouse = useMouseParallax();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.1, 1.0]);
  const textY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  const [activeVerse, setActiveVerse] = useState<number | null>(null);
  const [quoteRipples, setQuoteRipples] = useState<Ripple[]>([]);
  const [quoteNextId, setQuoteNextId] = useState(0);

  const handleQuoteClick = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = quoteNextId;
    setQuoteNextId((n) => n + 1);
    setQuoteRipples((r) => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setQuoteRipples((r) => r.filter((rip) => rip.id !== id)), 2000);
  };

  return (
    <section
      ref={ref}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "#020508" }}
    >
      {/* Lotus image parallax */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ scale: bgScale, x: mouse.x * -20, y: mouse.y * -10 }}
      >
        <img
          src="/images/liberation-lotus.png"
          alt="Liberation"
          className="w-full h-full object-cover"
          style={{ opacity: 0.55 }}
        />
      </motion.div>

      {/* Gradient overlays */}
      <div
        className="absolute inset-0 z-1 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(2,5,8,1) 0%, rgba(2,5,8,0.4) 40%, rgba(2,5,8,0.6) 100%)",
        }}
      />
      <div
        className="absolute inset-0 z-1 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(100,160,220,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Rising lotus particle system */}
      <ParticleCanvas intensity="liberation" />

      {/* Content */}
      <motion.div
        style={{ y: textY }}
        className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-4xl"
      >
        {/* Ornament */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="flex items-center gap-3 mb-10"
        >
          <div className="h-px w-12 md:w-24 bg-gradient-to-r from-transparent to-[#6eb4d8]/40" />
          <span className="text-[#6eb4d8]/40 text-xs tracking-[0.5em] uppercase font-sans">
            Chapters XV–XVI
          </span>
          <div className="h-px w-12 md:w-24 bg-gradient-to-l from-transparent to-[#6eb4d8]/40" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="font-serif text-5xl md:text-7xl mb-10"
          style={{
            color: "transparent",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            backgroundImage: "linear-gradient(180deg, #ffffff 0%, #93c5fd 50%, #6eb4d8 100%)",
            filter: "drop-shadow(0 0 30px rgba(100,160,220,0.4))",
          }}
        >
          Liberation
        </motion.h2>

        {/* Tappable main blockquote */}
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, delay: 0.8 }}
          onClick={handleQuoteClick}
          className="relative font-serif text-xl md:text-3xl leading-relaxed text-white/80 mb-14 max-w-3xl overflow-hidden"
          style={{ cursor: "pointer" }}
          whileHover={{ color: "rgba(255,255,255,0.9)" }}
        >
          <AnimatePresence>
            {quoteRipples.map((rip) => (
              <motion.div
                key={rip.id}
                className="absolute rounded-full pointer-events-none"
                initial={{ width: 0, height: 0, opacity: 0.4, left: rip.x, top: rip.y, translateX: "-50%", translateY: "-50%" }}
                animate={{ width: 600, height: 600, opacity: 0 }}
                exit={{}}
                transition={{ duration: 1.8, ease: "easeOut" }}
                style={{ border: "1px solid rgba(100,180,220,0.5)", boxShadow: "0 0 20px rgba(100,180,220,0.3)" }}
              />
            ))}
          </AnimatePresence>
          <span className="text-[#6eb4d8]/50 text-4xl leading-none mr-1">"</span>
          The supreme teaching: Self-knowledge alone liberates. Austerities, fasts,
          and rituals are secondary. The truth is seated within you.
          <span className="text-[#6eb4d8]/50 text-4xl leading-none ml-1">"</span>
        </motion.blockquote>

        {/* Tappable individual verses */}
        {VERSES.map((v, i) => {
          const isActive = activeVerse === i;
          return (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 1.2 + i * 0.3 }}
              onClick={() => setActiveVerse(isActive ? null : i)}
              className="font-sans text-sm md:text-base italic max-w-xl mb-4 relative transition-all duration-500"
              style={{
                cursor: "pointer",
                color: isActive ? "rgba(147,197,253,0.9)" : "rgba(255,255,255,0.4)",
                filter: isActive ? "drop-shadow(0 0 12px rgba(100,180,220,0.6))" : "none",
              }}
              whileHover={{ color: "rgba(147,197,253,0.7)" }}
              whileTap={{ scale: 0.98 }}
            >
              {isActive && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute -left-4 top-0"
                  style={{ color: "rgba(100,180,220,0.6)" }}
                >
                  ✦
                </motion.span>
              )}
              {v}
            </motion.p>
          );
        })}

        {/* Closing */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, delay: 2 }}
          className="mt-16 flex flex-col items-center gap-4"
        >
          <div className="w-px h-20 bg-gradient-to-b from-[#6eb4d8]/50 to-transparent" />
          <motion.span
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-[#93c5fd]/60 font-serif tracking-[0.5em] uppercase text-sm"
            style={{ filter: "drop-shadow(0 0 12px rgba(100,160,220,0.5))" }}
          >
            OM TAT SAT
          </motion.span>
          <p className="text-white/20 font-sans text-xs tracking-widest mt-2">
            ॐ तत् सत्
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
