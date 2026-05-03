import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hero } from "@/sections/Hero";
import { Introduction } from "@/sections/Introduction";
import { Liberation } from "@/sections/Liberation";
import { RealmNav } from "@/components/RealmNav";
import { MobileNav } from "@/components/MobileNav";
import { RealmSection } from "@/experiences/RealmSection";
import { EntryGate } from "@/effects/EntryGate";
import { CursorGlow } from "@/effects/CursorGlow";
import { SoundControl } from "@/effects/SoundControl";
import { SoulProgress } from "@/effects/SoulProgress";
import { useAmbientSound } from "@/hooks/useAmbientSound";
import { realms } from "@/data/realms";
import type { BeatType } from "@/data/realms";
import { SoulStoreProvider } from "@/state/SoulStore";

const REALM_SOUND_MAP: Record<string, string> = {
  descent:    "descent",
  hells:      "hells",
  rites:      "rites",
  justice:    "justice",
  liberation: "liberation",
};

interface RealmSoundObserverProps {
  setRealm: (id: string) => void;
  triggerBeat: (beatType: BeatType, theme: string) => void;
}

function RealmSoundObserver({ setRealm, triggerBeat }: RealmSoundObserverProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const enteredRef  = useRef(new Set<string>());

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const id = (e.target as HTMLElement).dataset.realmId;
            if (id && REALM_SOUND_MAP[id]) {
              setRealm(REALM_SOUND_MAP[id]);
              if (!enteredRef.current.has(id)) {
                enteredRef.current.add(id);
                const realm = realms.find((r) => r.id === id);
                if (realm) triggerBeat("portal", realm.theme);
              }
            }
          }
        });
      },
      { threshold: 0.25 }
    );

    realms.forEach((r) => {
      const el = document.getElementById(`realm-${r.id}`);
      if (el) {
        el.dataset.realmId = r.id;
        observerRef.current?.observe(el);
      }
    });

    return () => observerRef.current?.disconnect();
  }, [setRealm, triggerBeat]);

  return null;
}

export default function Home() {
  const [entered, setEntered] = useState(false);
  const { start, mute, unmute, setRealm, triggerBeat } = useAmbientSound();

  const handleEnter = () => {
    setEntered(true);
    start();
  };

  return (
    <SoulStoreProvider>
      <CursorGlow />
      <EntryGate onEnter={handleEnter} />

      {/* Fixed Garuda — persists across all realms as you scroll */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
        aria-hidden
      >
        <img
          src="/images/garuda-real.png"
          alt=""
          className="w-full h-full object-contain object-center"
          style={{ opacity: 0.055 }}
        />
      </div>

      <AnimatePresence>
        {entered && (
          <motion.main
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="bg-background text-foreground w-full min-h-screen selection:bg-primary selection:text-primary-foreground"
          >
            <RealmSoundObserver setRealm={setRealm} triggerBeat={triggerBeat} />
            <RealmNav />
            <MobileNav />
            <Hero />
            <Introduction />
            {realms.map((realm) => (
              <RealmSection
                key={realm.id}
                realm={realm}
                triggerBeat={triggerBeat}
              />
            ))}
            <Liberation />
            <SoulProgress />
            <SoundControl onMute={mute} onUnmute={unmute} />
          </motion.main>
        )}
      </AnimatePresence>
    </SoulStoreProvider>
  );
}
