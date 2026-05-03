import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface Props {
  onMute: () => void;
  onUnmute: () => void;
}

export function SoundControl({ onMute, onUnmute }: Props) {
  const [muted, setMuted] = useState(false);

  const toggle = () => {
    if (muted) {
      setMuted(false);
      onUnmute();
    } else {
      setMuted(true);
      onMute();
    }
  };

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 1 }}
      onClick={toggle}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-3 py-2 font-sans text-[10px] tracking-[0.3em] uppercase transition-all duration-300 group"
      style={{
        border: "1px solid rgba(201,168,76,0.2)",
        background: "rgba(10,8,5,0.7)",
        backdropFilter: "blur(8px)",
        color: muted ? "rgba(200,180,150,0.3)" : "rgba(200,180,150,0.6)",
      }}
      whileHover={{ borderColor: "rgba(201,168,76,0.5)", color: "rgba(200,180,150,0.9)" }}
      whileTap={{ scale: 0.95 }}
      title={muted ? "Unmute ambient sound" : "Mute ambient sound"}
    >
      {/* Sound wave icon */}
      <span className="flex items-center gap-0.5 h-3">
        {[2, 3, 4, 3, 2].map((h, i) => (
          <motion.span
            key={i}
            className="w-0.5 rounded-full"
            style={{ background: "currentColor", height: `${h * 3}px` }}
            animate={!muted ? {
              scaleY: [1, 1.5, 0.8, 1.3, 1],
            } : { scaleY: 0.3 }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </span>
      <span>{muted ? "Sound Off" : "Ambient"}</span>
      <AnimatePresence>
        {muted && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "rgba(10,8,5,0.7)" }}
          >
            <span className="w-full text-center text-[10px] tracking-widest">MUTED</span>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
