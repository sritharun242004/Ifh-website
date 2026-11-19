"use client";
import { useState } from "react";

export default function Login() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (res.ok) {
        location.reload();
        return;
      }
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      setErr(j.error ?? "Sign-in failed");
    } catch {
      setErr("Sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="admin__login" onSubmit={submit}>
      <h1>Admin sign-in</h1>
      <input
        type="password"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        placeholder="Admin password"
        autoFocus
      />
      {err && <p className="admin__err">{err}</p>}
      <button type="submit" disabled={busy || !pw}>
        {busy ? "Checking…" : "Sign in"}
      </button>
    </form>
  );
}
