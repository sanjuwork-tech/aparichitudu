import { useRef, useCallback, useEffect } from "react";
import type { BeatType } from "@/data/realms";

interface ToneLayer {
  freq: number;
  type: OscillatorType;
  gainVal: number;
  detune?: number;
  lfoRate?: number;
  lfoDepth?: number;
}

interface RealmTone {
  layers: ToneLayer[];
  masterGain: number;
  reverbTime?: number;
}

const REALM_TONES: Record<string, RealmTone> = {
  default: {
    layers: [
      { freq: 55,   type: "sine", gainVal: 0.5, lfoRate: 0.07 },
      { freq: 55.8, type: "sine", gainVal: 0.3, lfoRate: 0.09 },
    ],
    masterGain: 0.06,
  },
  descent: {
    layers: [
      { freq: 55,  type: "sine",     gainVal: 0.60, lfoRate: 0.06, lfoDepth: 0.28 },
      { freq: 58,  type: "sine",     gainVal: 0.50, lfoRate: 0.08, lfoDepth: 0.25 },
      { freq: 110, type: "triangle", gainVal: 0.15, lfoRate: 0.05, lfoDepth: 0.20 },
      { freq: 220, type: "sine",     gainVal: 0.05, detune: -12,   lfoRate: 0.10 },
    ],
    masterGain: 0.13,
    reverbTime: 2.5,
  },
  hells: {
    layers: [
      { freq: 44,  type: "sine",     gainVal: 0.70, lfoRate: 0.05, lfoDepth: 0.30 },
      { freq: 47,  type: "sine",     gainVal: 0.60, lfoRate: 0.07, lfoDepth: 0.28 },
      { freq: 88,  type: "triangle", gainVal: 0.20, lfoRate: 0.06, lfoDepth: 0.18 },
      { freq: 132, type: "sawtooth", gainVal: 0.03, lfoRate: 0.11 },
    ],
    masterGain: 0.14,
    reverbTime: 3,
  },
  rites: {
    layers: [
      { freq: 110, type: "sine",     gainVal: 0.50, lfoRate: 0.08, lfoDepth: 0.20 },
      { freq: 165, type: "sine",     gainVal: 0.40, lfoRate: 0.09, lfoDepth: 0.18 },
      { freq: 220, type: "triangle", gainVal: 0.15, lfoRate: 0.07 },
      { freq: 55,  type: "sine",     gainVal: 0.20, lfoRate: 0.06 },
    ],
    masterGain: 0.09,
    reverbTime: 2,
  },
  justice: {
    layers: [
      { freq: 220, type: "sine", gainVal: 0.50, lfoRate: 0.07, lfoDepth: 0.18 },
      { freq: 330, type: "sine", gainVal: 0.40, lfoRate: 0.09, lfoDepth: 0.15 },
      { freq: 440, type: "sine", gainVal: 0.15, lfoRate: 0.10 },
      { freq: 110, type: "sine", gainVal: 0.10, lfoRate: 0.06 },
    ],
    masterGain: 0.08,
    reverbTime: 1.5,
  },
  liberation: {
    layers: [
      { freq: 432, type: "sine", gainVal: 0.50, lfoRate: 0.06, lfoDepth: 0.14 },
      { freq: 528, type: "sine", gainVal: 0.40, lfoRate: 0.07, lfoDepth: 0.12 },
      { freq: 648, type: "sine", gainVal: 0.25, lfoRate: 0.05, lfoDepth: 0.10 },
      { freq: 864, type: "sine", gainVal: 0.10, lfoRate: 0.08 },
      { freq: 216, type: "sine", gainVal: 0.15, lfoRate: 0.06 },
    ],
    masterGain: 0.07,
    reverbTime: 1.2,
  },
};

interface OscEntry {
  osc: OscillatorNode;
  gain: GainNode;
  lfo: OscillatorNode;
  lfoGain: GainNode;
}

interface AudioState {
  ctx: AudioContext;
  masterGain: GainNode;
  reverbGain: GainNode;
  dryGain: GainNode;
  convolver: ConvolverNode | null;
  oscillators: OscEntry[];
}

function makeReverb(ctx: AudioContext, duration: number): ConvolverNode {
  const convolver = ctx.createConvolver();
  const sampleRate = ctx.sampleRate;
  const length = sampleRate * duration;
  const impulse = ctx.createBuffer(2, length, sampleRate);
  for (let i = 0; i < 2; i++) {
    const channel = impulse.getChannelData(i);
    for (let j = 0; j < length; j++) {
      channel[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / length, 2.5);
    }
  }
  convolver.buffer = impulse;
  return convolver;
}

function fireBeatSound(
  ctx: AudioContext,
  dest: AudioNode,
  beatType: BeatType,
  theme: string
): void {
  const now = ctx.currentTime;

  function tone(
    freq: number,
    oscType: OscillatorType,
    peakGain: number,
    attack: number,
    decay: number,
    startDelay = 0
  ) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = oscType;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, now + startDelay);
    g.gain.linearRampToValueAtTime(peakGain, now + startDelay + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, now + startDelay + attack + decay);
    osc.connect(g);
    g.connect(dest);
    osc.start(now + startDelay);
    osc.stop(now + startDelay + attack + decay + 0.15);
  }

  switch (beatType) {
    case "portal": {
      const f =
        theme === "liberation" ? 432 :
        theme === "silver"     ? 220 :
        theme === "gold"       ? 110 : 45;
      tone(f,        "sine", 0.30, 0.03, 3.5);
      tone(f * 2.76, "sine", 0.07, 0.06, 2.5);
      break;
    }
    case "yamaduta": {
      tone(40, "sawtooth", 0.12, 0.06, 2.0);
      tone(43, "sawtooth", 0.09, 0.06, 1.8, 0.12);
      tone(80, "sine",     0.06, 0.10, 1.5, 0.22);
      break;
    }
    case "scene": {
      const baseFreq =
        theme === "liberation" ? 216 :
        theme === "silver"     ? 110 :
        theme === "gold"       ? 110 : 55;
      tone(baseFreq, "sine", 0.15, 0.06, 0.9);
      break;
    }
    case "quote": {
      const f =
        theme === "liberation" ? 1080 :
        theme === "silver"     ? 880  :
        theme === "gold"       ? 660  : 550;
      tone(f,       "sine", 0.09, 0.01, 2.5);
      tone(f * 1.5, "sine", 0.04, 0.02, 1.8, 0.09);
      break;
    }
    case "river": {
      [80, 120, 160].forEach((f, i) => {
        tone(f, "sine", 0.13, 0.10, 1.4, i * 0.18);
      });
      break;
    }
    case "list": {
      tone(220, "sine", 0.08, 0.03, 1.2);
      break;
    }
    case "verdict": {
      tone(28,  "sine", 0.22, 0.02, 3.0);
      tone(55,  "sine", 0.14, 0.02, 2.5);
      tone(440, "sine", 0.04, 0.01, 1.2, 0.12);
      break;
    }
    case "scales": {
      tone(220, "sine", 0.11, 0.02, 2.8);
      tone(293, "sine", 0.09, 0.02, 2.5, 0.10);
      break;
    }
    case "echo": {
      [0, 0.5, 1.0, 1.5].forEach((delay, i) => {
        tone(330, "sine", 0.12 * Math.pow(0.55, i), 0.01, 1.0, delay);
      });
      break;
    }
    case "verse": {
      [216, 324, 432].forEach((f, i) => {
        tone(f, "sine", 0.09, 0.10, 2.5, i * 0.5);
      });
      break;
    }
    case "mantra": {
      tone(136,       "sine", 0.20, 0.35, 3.5);
      tone(136 * 2,   "sine", 0.07, 0.35, 3.0);
      tone(136 * 3,   "sine", 0.03, 0.40, 2.5);
      break;
    }
    case "finalQuestion": {
      tone(432, "sine", 0.07, 0.90, 4.0);
      break;
    }
    case "report": {
      tone(440, "sine", 0.07, 0.02, 1.5);
      tone(330, "sine", 0.05, 0.02, 1.2, 0.30);
      break;
    }
    default:
      break;
  }
}

export function useAmbientSound() {
  const audioRef = useRef<AudioState | null>(null);
  const mutedRef = useRef(false);
  const currentRealmRef = useRef<string>("default");

  const init = useCallback(() => {
    if (audioRef.current) return;
    const ctx = new AudioContext();
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0;

    const dryGain = ctx.createGain();
    const reverbGain = ctx.createGain();
    dryGain.gain.value = 0.7;
    reverbGain.gain.value = 0.3;

    dryGain.connect(masterGain);
    reverbGain.connect(masterGain);
    masterGain.connect(ctx.destination);

    audioRef.current = {
      ctx,
      masterGain,
      reverbGain,
      dryGain,
      convolver: null,
      oscillators: [],
    };
  }, []);

  const setRealm = useCallback((realmId: string) => {
    if (!audioRef.current || mutedRef.current) return;
    if (currentRealmRef.current === realmId) return;
    currentRealmRef.current = realmId;

    const s = audioRef.current;
    const ctx = s.ctx;
    const realmTone = REALM_TONES[realmId] ?? REALM_TONES.default;
    const now = ctx.currentTime;
    const FADE = 2.5;

    s.oscillators.forEach(({ osc, gain, lfo }) => {
      gain.gain.setTargetAtTime(0, now, FADE * 0.4);
      osc.stop(now + FADE * 2);
      try { lfo.stop(now + FADE * 2); } catch {}
    });
    s.oscillators = [];

    if (realmTone.reverbTime !== undefined) {
      if (s.convolver) {
        try { s.convolver.disconnect(); } catch {}
      }
      const conv = makeReverb(ctx, realmTone.reverbTime);
      conv.connect(s.reverbGain);
      s.convolver = conv;
    }

    s.masterGain.gain.setTargetAtTime(realmTone.masterGain, now + 0.5, FADE * 0.5);

    realmTone.layers.forEach(({ freq, type, gainVal, detune, lfoRate, lfoDepth }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.value = freq;
      if (detune !== undefined) osc.detune.value = detune;

      gain.gain.value = 0;
      gain.gain.setTargetAtTime(gainVal, now + 0.3, FADE * 0.5);

      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.type = "sine";
      lfo.frequency.value = lfoRate ?? (0.06 + Math.random() * 0.05);
      lfoGain.gain.setValueAtTime(0, now);
      lfoGain.gain.setTargetAtTime(
        gainVal * (lfoDepth ?? 0.22),
        now + FADE,
        2.0
      );
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);
      lfo.start(now);

      osc.connect(gain);
      gain.connect(s.dryGain);
      if (s.convolver) gain.connect(s.convolver);

      osc.start(now);
      s.oscillators.push({ osc, gain, lfo, lfoGain });
    });
  }, []);

  const triggerBeat = useCallback((beatType: BeatType, realmTheme: string) => {
    if (!audioRef.current || mutedRef.current) return;
    const { ctx, masterGain } = audioRef.current;
    if (ctx.state === "suspended") return;
    fireBeatSound(ctx, masterGain, beatType, realmTheme);
  }, []);

  const start = useCallback(() => {
    if (!audioRef.current) init();
    const s = audioRef.current!;
    if (s.ctx.state === "suspended") s.ctx.resume();
    mutedRef.current = false;
    setRealm(currentRealmRef.current || "default");
    s.masterGain.gain.setTargetAtTime(
      REALM_TONES[currentRealmRef.current]?.masterGain ?? 0.06,
      s.ctx.currentTime,
      1
    );
  }, [init, setRealm]);

  const mute = useCallback(() => {
    if (!audioRef.current) return;
    mutedRef.current = true;
    audioRef.current.masterGain.gain.setTargetAtTime(
      0,
      audioRef.current.ctx.currentTime,
      0.5
    );
  }, []);

  const unmute = useCallback(() => {
    if (!audioRef.current) return;
    mutedRef.current = false;
    const realmTone = REALM_TONES[currentRealmRef.current] ?? REALM_TONES.default;
    audioRef.current.masterGain.gain.setTargetAtTime(
      realmTone.masterGain,
      audioRef.current.ctx.currentTime,
      0.8
    );
  }, []);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.oscillators.forEach(({ osc, lfo }) => {
          try { osc.stop(); } catch {}
          try { lfo.stop(); } catch {}
        });
        audioRef.current.ctx.close();
      }
    };
  }, []);

  return { start, mute, unmute, setRealm, triggerBeat };
}
