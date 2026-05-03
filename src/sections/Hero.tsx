import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ParticleCanvas } from "@/effects/ParticleCanvas";
import { useMouseParallax } from "@/hooks/useMouseParallax";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const mouse = useMouseParallax();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Garuda — real image with parallax */}
      <motion.div
        className="absolute inset-0 z-0 flex items-center justify-center"
        style={{ y: bgY, x: mouse.x * -20, scale: 1.1 }}
      >
        <img
          src="/images/garuda-real.png"
          alt=""
          className="h-full w-auto max-w-none object-contain object-center"
          style={{ opacity: 0.28 }}
        />
      </motion.div>

      {/* Fire glow layer — moves with mouse for depth */}
      <motion.div
        className="absolute inset-0 z-1 pointer-events-none"
        style={{ x: mouse.x * -45, y: mouse.y * -20 }}
      >
        <div
          className="w-full h-full"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 60%, rgba(180,60,10,0.15) 0%, transparent 70%)",
          }}
        />
      </motion.div>

      {/* Gradient fade to background */}
      <div
        className="absolute inset-0 z-1 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,8,5,0.25) 0%, rgba(10,8,5,0.55) 60%, rgba(10,8,5,1) 100%)",
        }}
      />
      <div
        className="absolute inset-0 z-1 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.65) 100%)",
        }}
      />

      {/* Live ember particles */}
      <ParticleCanvas intensity="hell" />

      {/* Text content with scroll parallax */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-5xl"
      >
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.4, delay: 0.2, ease: "easeOut" }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="h-px w-12 md:w-28 bg-gradient-to-r from-transparent to-primary/50" />
          <span className="text-primary/50 text-xs tracking-[0.5em] uppercase font-sans">
            Vishnu Purāṇa · Uttara Khaṇḍa
          </span>
          <div className="h-px w-12 md:w-28 bg-gradient-to-l from-transparent to-primary/50" />
        </motion.div>

        <div className="flex flex-wrap justify-center gap-x-1 mb-8">
          {"GARUDA PURĀṆA".split("").map((ch, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, delay: 0.3 + i * 0.065, ease: "easeOut" }}
              className={`font-serif font-bold leading-none select-none ${ch === " " ? "w-5" : ""}`}
              style={{
                fontSize: "clamp(2.2rem, 7.5vw, 5.5rem)",
                color: "transparent",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                backgroundImage:
                  "linear-gradient(180deg, #f5df80 0%, #c9a84c 45%, #7a5510 100%)",
                filter: "drop-shadow(0 0 28px rgba(201,168,76,0.45))",
              }}
            >
              {ch}
            </motion.span>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="text-foreground/55 font-sans font-light text-base md:text-xl max-w-lg tracking-wide mb-12"
        >
          The ancient scripture of death, karma &amp; liberation —<br />spoken by Viṣṇu to Garuḍa, King of Birds
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1.2 }}
          className="flex flex-col items-center gap-2 text-primary/40"
        >
          <span className="text-xs tracking-[0.4em] uppercase font-sans">Descend</span>
          <motion.div
            animate={{ scaleY: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-14 bg-gradient-to-b from-primary/50 to-transparent origin-top"
          />
          <motion.div
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            className="w-1.5 h-1.5 rounded-full bg-primary/50"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
