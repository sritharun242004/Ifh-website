"use client";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
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
        body: JSON.stringify({ email: email.trim(), password: pw }),
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
        type="email"
        inputMode="email"
        autoComplete="username"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="admin@ifh.com"
        autoFocus
      />
      <input
        type="password"
        autoComplete="current-password"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        placeholder="Password"
      />
      {err && <p className="admin__err">{err}</p>}
      <button type="submit" disabled={busy || !email || !pw}>
        {busy ? "Checking…" : "Sign in"}
      </button>
    </form>
  );
}
