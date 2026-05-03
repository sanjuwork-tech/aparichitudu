import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react";

export interface SoulRecord {
  sins: string[];
  sinCount: number;
  virtueCount: number;
  scalesVerdict: string;
  scalesVerdictTitle: string;
  echoPathId: string;
  echoPathLabel: string;
  echoPathVision: string;
  finalAnswer: string;
  offeredRites: number;
  cowGiven: boolean;
}

export function getCompletedRealms(r: SoulRecord): Set<string> {
  const done = new Set<string>();
  if (r.sins.length > 0) done.add("hells");
  if (r.offeredRites > 0 || r.cowGiven) done.add("rites");
  if (r.echoPathId !== "") done.add("justice");
  if (r.finalAnswer !== "") done.add("liberation");
  return done;
}

const DEFAULT: SoulRecord = {
  sins: [],
  sinCount: 0,
  virtueCount: 0,
  scalesVerdict: "",
  scalesVerdictTitle: "",
  echoPathId: "",
  echoPathLabel: "",
  echoPathVision: "",
  finalAnswer: "",
  offeredRites: 0,
  cowGiven: false,
};

const STORAGE_KEY = "garuda_soul_record_v1";

function loadFromSession(): SoulRecord {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT;
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    return DEFAULT;
  }
}

type Action = { type: "UPDATE"; payload: Partial<SoulRecord> } | { type: "RESET" };

function reducer(state: SoulRecord, action: Action): SoulRecord {
  if (action.type === "RESET") return DEFAULT;
  return { ...state, ...action.payload };
}

interface CtxValue {
  record: SoulRecord;
  update: (partial: Partial<SoulRecord>) => void;
  reset: () => void;
}

const Ctx = createContext<CtxValue | null>(null);

export function SoulStoreProvider({ children }: { children: ReactNode }) {
  const [record, dispatch] = useReducer(reducer, undefined, loadFromSession);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    } catch {}
  }, [record]);

  const update = (payload: Partial<SoulRecord>) => dispatch({ type: "UPDATE", payload });
  const reset = () => dispatch({ type: "RESET" });

  return <Ctx.Provider value={{ record, update, reset }}>{children}</Ctx.Provider>;
}

export function useSoulStore(): CtxValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSoulStore must be inside SoulStoreProvider");
  return ctx;
}
