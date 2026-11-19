"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { config } from "@/landing/config";

type Status = "loading" | "ready" | "error";
type SeatsState = {
  total: number;
  /** Real free spots left. `null` until the first successful fetch. */
  left: number | null;
  status: Status;
  refresh: () => Promise<void>;
};

const SeatsContext = createContext<SeatsState | null>(null);

/** Fetches the live counter on load, when the tab regains focus, and every 30s while visible. */
export function SeatsProvider({ children }: { children: React.ReactNode }) {
  const [left, setLeft] = useState<number | null>(null);
  const [total, setTotal] = useState<number>(config.seatTotal);
  const [status, setStatus] = useState<Status>("loading");

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/seats", { cache: "no-store" });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as { total: number; left: number };
      setTotal(data.total);
      setLeft(data.left);
      setStatus("ready");
    } catch {
      // Keep the last good number if we had one; otherwise show the "unavailable" copy.
      setStatus((s) => (s === "ready" ? s : "error"));
    }
  }, []);

  useEffect(() => {
    refresh();
    let timer: number | undefined;
    const start = () => {
      window.clearInterval(timer);
      timer = window.setInterval(refresh, config.seatRefreshMs);
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        refresh();
        start();
      } else {
        window.clearInterval(timer);
      }
    };
    start();
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", refresh);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", refresh);
    };
  }, [refresh]);

  const value = useMemo(() => ({ total, left, status, refresh }), [total, left, status, refresh]);
  return <SeatsContext.Provider value={value}>{children}</SeatsContext.Provider>;
}

export function useSeats() {
  const ctx = useContext(SeatsContext);
  if (!ctx) throw new Error("useSeats must be used inside <SeatsProvider>");
  return ctx;
}
