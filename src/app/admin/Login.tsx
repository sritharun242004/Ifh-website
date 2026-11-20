"use client";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
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
      setErr("Sign-in failed. Check your connection.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="loginWrap">
      <form className="loginCard" onSubmit={submit}>
        <div className="loginBrand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo.png" alt="" width={46} height={30} />
          <span>iFindHouse</span>
        </div>
        <div>
          <h1>Admin sign-in</h1>
          <p className="muted">Manage owner leads.</p>
        </div>

        <label className="field">
          <span>Email</span>
          <input
            className="input"
            type="email"
            inputMode="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@ifh.com"
            autoFocus
            required
          />
        </label>

        <label className="field">
          <span>Password</span>
          <div className="pwWrap">
            <input
              className="input"
              type={show ? "text" : "password"}
              autoComplete="current-password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="Enter password"
              required
            />
            <button
              type="button"
              className="pwToggle"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Hide password" : "Show password"}
              aria-pressed={show}
            >
              {show ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </label>

        {err && (
          <p className="loginErr" role="alert">
            {err}
          </p>
        )}

        <button type="submit" className="btn primary loginBtn" disabled={busy || !email || !pw}>
          {busy ? (
            <>
              <Loader2 size={16} style={{ animation: "spin 0.8s linear infinite" }} /> Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </form>
    </main>
  );
}
