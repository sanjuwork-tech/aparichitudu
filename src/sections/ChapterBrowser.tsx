import { motion } from "framer-motion";
import { useState } from "react";
import { chapters } from "@/data/chapters";

const realmGroups = [
  {
    label: "The Hells",
    range: "Chapters I–VII",
    color: "#c94a4a",
    glow: "rgba(139,21,21,0.5)",
    desc: "Yama's messengers, the 21 great hells, Vaitarani River",
    chapters: [1, 2, 3, 4, 5, 6, 7],
  },
  {
    label: "Rites for the Dead",
    range: "Chapters VII–XIII",
    color: "#c9a84c",
    glow: "rgba(180,130,40,0.5)",
    desc: "Funeral ceremonies, rice-ball offerings, the body's journey",
    chapters: [7, 8, 9, 10, 11, 12, 13],
  },
  {
    label: "The City of Justice",
    range: "Chapter XIV",
    color: "#6eb4d8",
    glow: "rgba(70,140,190,0.5)",
    desc: "Chitragupta's accounting, heaven and its rewards",
    chapters: [14],
  },
  {
    label: "Liberation",
    range: "Chapters XV–XVI",
    color: "#d4f0ff",
    glow: "rgba(180,220,255,0.4)",
    desc: "Yoga, Self-knowledge, the final liberation from birth and death",
    chapters: [15, 16],
  },
];

export function ChapterBrowser() {
  const [activeRealm, setActiveRealm] = useState<number | null>(null);

  return (
    <section className="relative w-full min-h-screen py-24 px-6 md:px-12 overflow-hidden">
      {/* Background atmosphere */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(40,15,5,0.8) 0%, rgba(10,8,5,1) 100%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="text-center mb-20"
        >
          <p className="text-primary/40 font-sans tracking-[0.5em] uppercase text-xs mb-4">
            Navigate the Realms
          </p>
          <h2 className="text-4xl md:text-6xl text-primary font-serif mb-6">
            The Sixteen Chapters
          </h2>
          <div
            className="h-px w-48 mx-auto"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(201,168,76,0.6), transparent)",
            }}
          />
        </motion.div>

        {/* Realm bands */}
        <div className="space-y-12 mb-20">
          {realmGroups.map((realm, ri) => (
            <motion.div
              key={ri}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: ri * 0.1 }}
            >
              <div
                className="flex items-center gap-4 mb-5 cursor-pointer"
                onClick={() => setActiveRealm(activeRealm === ri ? null : ri)}
              >
                <div className="h-px flex-1" style={{ background: `linear-gradient(to right, ${realm.glow}, transparent)` }} />
                <span
                  className="font-serif tracking-widest text-sm uppercase"
                  style={{ color: realm.color, filter: `drop-shadow(0 0 8px ${realm.glow})` }}
                >
                  {realm.label}
                </span>
                <span className="text-foreground/30 font-sans text-xs">{realm.range}</span>
                <div className="h-px w-8" style={{ background: `linear-gradient(to left, ${realm.glow}, transparent)` }} />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {realm.chapters.map((cid) => {
                  const ch = chapters.find((c) => c.id === cid);
                  if (!ch) return null;
                  return (
                    <ChapterCard key={cid} chapter={ch} color={realm.color} glow={realm.glow} />
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* All chapters flat grid for mobile/quick access */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="border-t border-primary/10 pt-12"
        >
          <p className="text-center text-primary/30 font-sans text-xs tracking-widest uppercase mb-8">
            All Chapters
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {chapters.map((ch, i) => (
              <FullChapterCard key={ch.id} chapter={ch} index={i} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ChapterCard({
  chapter,
  color,
  glow,
}: {
  chapter: (typeof chapters)[0];
  color: string;
  glow: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() =>
        document
          .getElementById(`chapter-${chapter.id}`)
          ?.scrollIntoView({ behavior: "smooth" })
      }
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.96 }}
      className="relative p-4 text-left transition-all duration-300 overflow-hidden"
      style={{
        border: `1px solid ${hovered ? color : color + "40"}`,
        background: hovered ? `${glow}18` : "rgba(10,8,5,0.5)",
        boxShadow: hovered ? `0 0 20px ${glow}, inset 0 0 15px ${glow}15` : "none",
      }}
    >
      <span
        className="block font-serif text-2xl font-bold mb-2"
        style={{ color, filter: hovered ? `drop-shadow(0 0 10px ${glow})` : "none" }}
      >
        {chapter.roman}
      </span>
      <span className="block font-sans text-xs text-foreground/60 line-clamp-2 leading-snug">
        {chapter.title}
      </span>
      {hovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background: `radial-gradient(ellipse at 50% 100%, ${glow}30 0%, transparent 70%)`,
          }}
        />
      )}
    </motion.button>
  );
}

function FullChapterCard({
  chapter,
  index,
}: {
  chapter: (typeof chapters)[0];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const isCrimson = chapter.theme === "crimson";
  const isSilver = chapter.theme === "silver";
  const color = isCrimson ? "#c94a4a" : isSilver ? "#6eb4d8" : "#c9a84c";
  const glow = isCrimson
    ? "rgba(139,21,21,0.5)"
    : isSilver
    ? "rgba(70,140,190,0.4)"
    : "rgba(180,140,30,0.4)";

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() =>
        document
          .getElementById(`chapter-${chapter.id}`)
          ?.scrollIntoView({ behavior: "smooth" })
      }
      whileHover={{ y: -3, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className="relative p-5 text-left transition-all duration-300 overflow-hidden group"
      style={{
        border: `1px solid ${hovered ? color + "80" : color + "20"}`,
        background: hovered ? `${glow}12` : "rgba(15,10,5,0.6)",
        boxShadow: hovered ? `0 0 24px ${glow}60` : "none",
      }}
    >
      <div
        className="absolute -right-3 -top-6 font-serif text-7xl font-bold pointer-events-none select-none"
        style={{ color: color + "08" }}
      >
        {chapter.roman}
      </div>
      <span
        className="block font-serif text-xs tracking-widest uppercase mb-2"
        style={{ color: color + "80" }}
      >
        Chapter {chapter.roman}
      </span>
      <h3
        className="font-serif text-base mb-3 transition-colors duration-300 line-clamp-2 leading-snug"
        style={{ color: hovered ? color : "hsl(var(--foreground))" }}
      >
        {chapter.title}
      </h3>
      <p className="text-foreground/40 text-xs font-sans line-clamp-2 leading-snug">
        {chapter.shortDesc}
      </p>
      {hovered && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          className="absolute bottom-0 left-0 h-px w-full origin-left"
          style={{ background: `linear-gradient(to right, ${color}, transparent)` }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.button>
  );
}
