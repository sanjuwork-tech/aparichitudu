import { useState } from "react";
import { motion } from "framer-motion";
import type { Beat } from "@/data/realms";
import { useSoulStore } from "@/state/SoulStore";

interface Props {
  beat: Beat;
  theme: { glow: string; color: string };
}

const VERDICT_COLORS: Record<string, string> = {
  heavily_sinful: "#c94a4a",
  sinful: "#c97a4a",
  balanced: "#c9a84c",
  virtuous: "#8fd4a8",
  greatly_virtuous: "#c8e8ff",
  empty: "#888888",
};

const ECHO_COLORS: Record<string, string> = {
  devoted: "#c8e8ff",
  dutiful: "#c9a84c",
  selfish: "#c97a4a",
  harmed: "#c94a4a",
};

function buildTextSummary(record: ReturnType<typeof useSoulStore>["record"]): string {
  const lines: string[] = [
    "═══════════════════════════════",
    "  YOUR RECORD · GARUDA PURĀṆA",
    "  Chitragupta's Account",
    "═══════════════════════════════",
    "",
  ];
  if (record.sins.length > 0) {
    lines.push("TRANSGRESSIONS ACKNOWLEDGED:");
    record.sins.forEach((s) => lines.push(`  • ${s}`));
    lines.push("");
  }
  if (record.scalesVerdictTitle) {
    lines.push("THE SCALES:");
    lines.push(`  Sins: ${record.sinCount}  |  Merits: ${record.virtueCount}`);
    lines.push(`  Verdict: ${record.scalesVerdictTitle}`);
    lines.push("");
  }
  if (record.echoPathLabel) {
    lines.push("THE ECHO OF LIVES:");
    lines.push(`  Path chosen: ${record.echoPathLabel}`);
    lines.push("");
  }
  if (record.finalAnswer) {
    lines.push("WHAT YOU CARRIED FORWARD:");
    lines.push(`  "${record.finalAnswer}"`);
    lines.push("");
  }
  lines.push("Sealed by Dharmarāja · Garuda Purāṇa");
  return lines.join("\n");
}

export function BeatReport({ beat }: Props) {
  const { record } = useSoulStore();
  const [copied, setCopied] = useState(false);

  const hasSins = record.sins.length > 0;
  const hasScales = record.scalesVerdictTitle !== "";
  const hasEcho = record.echoPathId !== "";
  const hasAnswer = record.finalAnswer !== "";
  const anyData = hasSins || hasScales || hasEcho || hasAnswer;

  const verdictColor = VERDICT_COLORS[record.scalesVerdict] ?? "#c9a84c";
  const echoColor = ECHO_COLORS[record.echoPathId] ?? "#c9a84c";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildTextSummary(record));
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {}
  };

  return (
    <div className="relative flex flex-col h-full overflow-y-auto">
      {/* Bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 70% at 50% 35%, rgba(30,20,60,0.55) 0%, rgba(4,3,2,0.97) 80%)",
        }}
      />

      {/* Header above card */}
      <div className="flex-shrink-0 pt-8 pb-4 text-center relative z-10">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-sans text-[9px] tracking-[0.55em] uppercase"
          style={{ color: "rgba(201,168,76,0.35)" }}
        >
          {beat.sub ?? "Your Record · No Database · Session Only"}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="font-serif font-bold mt-1"
          style={{
            fontSize: "clamp(1.2rem, 2.8vw, 1.9rem)",
            color: "#c9a84c",
            filter: "drop-shadow(0 0 14px rgba(201,168,76,0.4))",
          }}
        >
          {beat.headline ?? "Your Complete Record"}
        </motion.h2>
      </div>

      {/* The Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.8 }}
        id="soul-report-card"
        className="relative z-10 mx-auto w-full max-w-md mb-6 px-4"
      >
        <div
          className="w-full rounded-sm"
          style={{
            background: "rgba(8,5,3,0.96)",
            border: "1px solid rgba(201,168,76,0.22)",
            boxShadow: "0 0 40px rgba(0,0,0,0.8), inset 0 0 40px rgba(0,0,0,0.4)",
          }}
        >
          {/* Card header */}
          <div
            className="px-6 py-5 text-center"
            style={{ borderBottom: "1px solid rgba(201,168,76,0.12)" }}
          >
            <div className="flex items-center justify-center gap-3 mb-1">
              <div className="h-px flex-1" style={{ background: "linear-gradient(to right, transparent, rgba(201,168,76,0.3))" }} />
              <span className="font-serif text-lg" style={{ color: "rgba(201,168,76,0.7)" }}>✦</span>
              <div className="h-px flex-1" style={{ background: "linear-gradient(to left, transparent, rgba(201,168,76,0.3))" }} />
            </div>
            <p className="font-sans text-[8px] tracking-[0.6em] uppercase" style={{ color: "rgba(201,168,76,0.45)" }}>
              चित्रगुप्त का लेखा · Chitragupta's Account
            </p>
            <p className="font-serif text-xs mt-0.5" style={{ color: "rgba(180,160,120,0.3)" }}>
              Garuda Purāṇa · The Complete Record
            </p>
          </div>

          {/* Empty state */}
          {!anyData && (
            <div className="px-6 py-10 text-center">
              <p className="font-sans text-[11px]" style={{ color: "rgba(180,160,120,0.3)" }}>
                No journey data yet. Complete the realms first —<br />
                Verdict, Scales, Echo, and the Final Question — then return here.
              </p>
            </div>
          )}

          {/* ── Section 1: Transgressions ── */}
          {hasSins && (
            <div
              className="px-6 py-4"
              style={{ borderBottom: "1px solid rgba(201,168,76,0.08)" }}
            >
              <p
                className="font-sans text-[8px] tracking-[0.5em] uppercase mb-2"
                style={{ color: "rgba(201,74,74,0.5)" }}
              >
                Transgressions Acknowledged
              </p>
              <div className="flex flex-wrap gap-1.5">
                {record.sins.map((sin, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + i * 0.04 }}
                    className="font-sans text-[10px] px-2 py-0.5 rounded-sm"
                    style={{
                      color: "rgba(201,74,74,0.7)",
                      background: "rgba(80,5,5,0.3)",
                      border: "1px solid rgba(201,74,74,0.15)",
                    }}
                  >
                    {sin}
                  </motion.span>
                ))}
              </div>
            </div>
          )}
          {!hasSins && anyData && (
            <div className="px-6 py-3" style={{ borderBottom: "1px solid rgba(201,168,76,0.08)" }}>
              <p className="font-sans text-[8px] tracking-[0.5em] uppercase mb-1" style={{ color: "rgba(201,74,74,0.3)" }}>Transgressions Acknowledged</p>
              <p className="font-sans text-[10px]" style={{ color: "rgba(180,160,120,0.2)" }}>None recorded.</p>
            </div>
          )}

          {/* ── Section 2: The Scales ── */}
          {hasScales && (
            <div
              className="px-6 py-4"
              style={{ borderBottom: "1px solid rgba(201,168,76,0.08)" }}
            >
              <p
                className="font-sans text-[8px] tracking-[0.5em] uppercase mb-2"
                style={{ color: "rgba(201,168,76,0.5)" }}
              >
                The Scales of Yama
              </p>
              <div className="flex items-center gap-4 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="font-sans text-[9px] uppercase tracking-widest" style={{ color: "rgba(201,74,74,0.5)" }}>Sins</span>
                  <span className="font-serif text-lg font-bold" style={{ color: "#e88080" }}>{record.sinCount}</span>
                </div>
                <div className="h-px flex-1" style={{ background: "rgba(201,168,76,0.12)" }} />
                <div className="flex items-center gap-1.5">
                  <span className="font-serif text-lg font-bold" style={{ color: "#e8c96a" }}>{record.virtueCount}</span>
                  <span className="font-sans text-[9px] uppercase tracking-widest" style={{ color: "rgba(201,168,76,0.5)" }}>Merits</span>
                </div>
              </div>
              <p
                className="font-serif text-sm font-medium"
                style={{ color: verdictColor, filter: `drop-shadow(0 0 8px ${verdictColor}50)` }}
              >
                {record.scalesVerdictTitle}
              </p>
            </div>
          )}

          {/* ── Section 3: Echo of Lives ── */}
          {hasEcho && (
            <div
              className="px-6 py-4"
              style={{ borderBottom: "1px solid rgba(201,168,76,0.08)" }}
            >
              <p
                className="font-sans text-[8px] tracking-[0.5em] uppercase mb-2"
                style={{ color: `${echoColor}60` }}
              >
                The Echo of Lives
              </p>
              <p
                className="font-serif text-sm font-medium mb-1"
                style={{ color: echoColor }}
              >
                {record.echoPathLabel}
              </p>
              {record.echoPathVision && (
                <p className="font-sans text-[10px] italic leading-relaxed" style={{ color: "rgba(180,160,120,0.35)" }}>
                  "{record.echoPathVision}"
                </p>
              )}
            </div>
          )}

          {/* ── Section 4: Final Answer ── */}
          {hasAnswer && (
            <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(201,168,76,0.08)" }}>
              <p
                className="font-sans text-[8px] tracking-[0.5em] uppercase mb-2"
                style={{ color: "rgba(201,168,76,0.4)" }}
              >
                What You Carried Forward
              </p>
              <p
                className="font-serif text-sm leading-relaxed"
                style={{
                  color: "rgba(220,190,120,0.7)",
                  fontStyle: "italic",
                }}
              >
                "{record.finalAnswer}"
              </p>
            </div>
          )}

          {/* Card footer */}
          <div className="px-6 py-4 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="h-px flex-1" style={{ background: "linear-gradient(to right, transparent, rgba(201,168,76,0.15))" }} />
              <span className="font-sans text-[7px] tracking-[0.5em] uppercase" style={{ color: "rgba(201,168,76,0.3)" }}>
                Sealed by Dharmarāja
              </span>
              <div className="h-px flex-1" style={{ background: "linear-gradient(to left, transparent, rgba(201,168,76,0.15))" }} />
            </div>
            <p className="font-sans text-[8px]" style={{ color: "rgba(180,160,120,0.18)" }}>
              Garuda Purāṇa · Client-side record · No data leaves this device
            </p>
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      {anyData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="relative z-10 flex flex-col items-center gap-3 pb-10 px-4"
        >
          <button
            onClick={handleCopy}
            className="px-8 py-2.5 border rounded-sm font-sans text-[10px] tracking-[0.45em] uppercase transition-all duration-300"
            style={{
              cursor: "pointer",
              borderColor: copied ? "rgba(140,200,140,0.5)" : "rgba(201,168,76,0.25)",
              color: copied ? "rgba(140,200,140,0.8)" : "rgba(201,168,76,0.55)",
              background: copied ? "rgba(20,50,20,0.2)" : "rgba(30,20,5,0.1)",
            }}
          >
            {copied ? "✓ Copied to Clipboard" : "Copy Text Summary"}
          </button>
          <p className="font-sans text-[9px] text-center max-w-xs" style={{ color: "rgba(180,160,120,0.2)" }}>
            Screenshot the card above to save your record. No data is stored on any server.
          </p>
        </motion.div>
      )}
    </div>
  );
}
