import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { chapters } from "@/data/chapters";
import { ParticleCanvas } from "@/effects/ParticleCanvas";

interface ChapterProps {
  chapter: typeof chapters[0];
}

const themeMap = {
  crimson: {
    text: "text-[#c94a4a]",
    border: "border-[#8B1515]",
    borderHover: "hover:border-[#c94a4a]",
    bg: "bg-[#8B1515]/10",
    bgHover: "hover:bg-[#8B1515]/20",
    glow: "rgba(139,21,21,0.4)",
    ambientBg:
      "radial-gradient(ellipse 80% 60% at 50% 80%, rgba(100,10,10,0.25) 0%, transparent 70%)",
    particle: "hell" as const,
  },
  gold: {
    text: "text-primary",
    border: "border-primary",
    borderHover: "hover:border-primary",
    bg: "bg-primary/10",
    bgHover: "hover:bg-primary/15",
    glow: "rgba(201,168,76,0.35)",
    ambientBg:
      "radial-gradient(ellipse 80% 60% at 50% 80%, rgba(130,90,10,0.2) 0%, transparent 70%)",
    particle: "ceremony" as const,
  },
  silver: {
    text: "text-[#93afc8]",
    border: "border-[#4a7fa8]",
    borderHover: "hover:border-[#93afc8]",
    bg: "bg-[#4a7fa8]/10",
    bgHover: "hover:bg-[#4a7fa8]/15",
    glow: "rgba(100,160,200,0.35)",
    ambientBg:
      "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(20,60,100,0.25) 0%, transparent 70%)",
    particle: "liberation" as const,
  },
};

export function ChapterSection({ chapter }: ChapterProps) {
  const ref = useRef<HTMLElement>(null);
  const [hoveredVerse, setHoveredVerse] = useState<number | null>(null);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const theme = themeMap[(chapter.theme as keyof typeof themeMap) ?? "gold"] ?? themeMap.gold;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const bgParallax = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section
      ref={ref}
      id={`chapter-${chapter.id}`}
      className="relative w-full min-h-screen py-28 md:py-36 px-6 md:px-12 flex flex-col justify-center overflow-hidden"
      style={{ borderTop: `1px solid ${theme.glow}22` }}
    >
      {/* Atmospheric ambient layer */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ y: bgParallax }}
      >
        <div className="w-full h-full" style={{ background: theme.ambientBg }} />
      </motion.div>

      {/* Realm-specific particles */}
      <ParticleCanvas intensity={theme.particle} />

      {/* Giant chapter number watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
        <motion.div
          initial={{ opacity: 0, scale: 1.3 }}
          whileInView={{ opacity: 0.04, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: "easeOut" }}
          className={`font-serif leading-none ${theme.text}`}
          style={{ fontSize: "clamp(12rem, 45vw, 38rem)" }}
        >
          {chapter.roman}
        </motion.div>
      </div>

      {/* Vertical chapter line on left */}
      <motion.div
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute left-6 md:left-12 top-0 bottom-0 w-px origin-top"
        style={{
          background: `linear-gradient(to bottom, transparent 0%, ${theme.glow} 20%, ${theme.glow} 80%, transparent 100%)`,
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto w-full">
        {/* Chapter header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <span
              className={`${theme.text} font-serif tracking-[0.4em] text-xs uppercase opacity-70`}
            >
              Chapter
            </span>
            <span
              className={`font-serif text-5xl font-bold ${theme.text} opacity-80`}
              style={{ filter: `drop-shadow(0 0 16px ${theme.glow})` }}
            >
              {chapter.roman}
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif text-foreground leading-tight">
            {chapter.title}
          </h2>
          <p className={`${theme.text} font-sans text-sm mt-4 opacity-60 max-w-xl`}>
            {chapter.shortDesc}
          </p>
        </motion.div>

        {/* Verses — interactive cards */}
        <div className="space-y-6">
          {chapter.verses.map((verse, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: idx * 0.15 }}
              onMouseEnter={() => setHoveredVerse(idx)}
              onMouseLeave={() => setHoveredVerse(null)}
              className={`relative pl-6 md:pl-10 py-5 pr-5 border-l-2 ${theme.border} cursor-default transition-all duration-400 group`}
              style={{
                background:
                  hoveredVerse === idx
                    ? `linear-gradient(to right, ${theme.glow}18, transparent)`
                    : "transparent",
                boxShadow:
                  hoveredVerse === idx ? `inset 3px 0 0 ${theme.glow}` : undefined,
              }}
            >
              {/* Verse number */}
              <span
                className={`absolute top-5 left-[-1.1rem] w-5 h-5 rounded-full border ${theme.border} flex items-center justify-center text-[9px] font-serif ${theme.text} bg-background`}
                style={{ opacity: 0.7 }}
              >
                {idx + 1}
              </span>

              <p
                className="font-sans font-light text-lg md:text-xl leading-relaxed text-foreground/85 group-hover:text-foreground transition-colors duration-300"
              >
                <span className={`${theme.text} opacity-50 mr-1`}>"</span>
                {verse}
                <span className={`${theme.text} opacity-50 ml-1`}>"</span>
              </p>

              {/* Glow line on hover */}
              <motion.div
                className="absolute bottom-0 left-0 h-px w-full"
                animate={{ scaleX: hoveredVerse === idx ? 1 : 0, opacity: hoveredVerse === idx ? 1 : 0 }}
                style={{
                  background: `linear-gradient(to right, ${theme.glow}, transparent)`,
                  transformOrigin: "left",
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>

        {/* Extra list — interactive badges */}
        {chapter.extraList && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="mt-14"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className={`h-px flex-1 ${theme.border} opacity-30`} style={{ background: `linear-gradient(to right, ${theme.glow}50, transparent)` }} />
              <h4 className={`${theme.text} font-serif text-lg tracking-widest uppercase`}>
                {chapter.extraList.title}
              </h4>
              <div className={`h-px flex-1`} style={{ background: `linear-gradient(to left, ${theme.glow}50, transparent)` }} />
            </div>
            <div className="flex flex-wrap gap-2.5">
              {chapter.extraList.items.map((item, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  onMouseEnter={() => setHoveredItem(i)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`text-xs md:text-sm px-3 py-1.5 border ${theme.border} ${theme.bg} font-sans cursor-default transition-all duration-300`}
                  style={{
                    boxShadow:
                      hoveredItem === i ? `0 0 12px ${theme.glow}, inset 0 0 8px ${theme.glow}30` : "none",
                    color: hoveredItem === i ? "hsl(var(--foreground))" : undefined,
                    borderColor: hoveredItem === i ? theme.glow : undefined,
                  }}
                >
                  <span className={`${theme.text} opacity-50 mr-1 text-[10px]`}>{i + 1}.</span>
                  {item}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Key Truth — cinematic reveal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1, delay: 0.1 }}
          className={`mt-16 p-8 border ${theme.border} ${theme.bg} backdrop-blur-sm relative overflow-hidden`}
        >
          {/* Corner ornaments */}
          <span
            className={`absolute top-2 left-2 text-lg ${theme.text} opacity-30`}
            style={{ filter: `drop-shadow(0 0 6px ${theme.glow})` }}
          >✦</span>
          <span
            className={`absolute top-2 right-2 text-lg ${theme.text} opacity-30`}
            style={{ filter: `drop-shadow(0 0 6px ${theme.glow})` }}
          >✦</span>
          <span
            className={`absolute bottom-2 left-2 text-lg ${theme.text} opacity-30`}
            style={{ filter: `drop-shadow(0 0 6px ${theme.glow})` }}
          >✦</span>
          <span
            className={`absolute bottom-2 right-2 text-lg ${theme.text} opacity-30`}
            style={{ filter: `drop-shadow(0 0 6px ${theme.glow})` }}
          >✦</span>

          {/* Ambient glow inside box */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 50% 100%, ${theme.glow}18 0%, transparent 70%)`,
            }}
          />

          <div
            className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4 font-serif text-xs tracking-[0.4em] uppercase ${theme.text}`}
          >
            KEY TRUTH
          </div>
          <p className="font-serif text-lg md:text-xl text-foreground/90 text-center relative z-10 leading-relaxed">
            {chapter.keyTruth}
          </p>
        </motion.div>
      </div>

      {/* Section divider */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: `linear-gradient(to right, transparent, ${theme.glow}40, transparent)`,
        }}
      />
    </section>
  );
}
