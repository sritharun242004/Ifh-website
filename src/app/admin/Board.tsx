"use client";
import { useEffect, useState } from "react";

type Status = "new" | "contacted" | "converted" | "lost";
type Lead = {
  token: string;
  name: string;
  phone: string;
  town: string;
  locationText: string | null;
  lat: number | null;
  lng: number | null;
  availability: string | null;
  photoUrls: string[];
  photoCount: number;
  waConsent: boolean;
  utm: Record<string, string>;
  fbclid: string | null;
  position: number | null;
  status: Status;
  completed: boolean;
  createdAt: string;
};

const COLUMNS: { key: Status; label: string }[] = [
  { key: "new", label: "New lead" },
  { key: "contacted", label: "Contacted" },
  { key: "converted", label: "Converted" },
  { key: "lost", label: "Lost" },
];

// Stored phone is 10 digits; present it as an Indian number.
const intl = (p: string) => (p.length === 10 ? `91${p}` : p);
const pretty = (p: string) => (p.length === 10 ? `+91 ${p.slice(0, 5)} ${p.slice(5)}` : `+${p}`);
const fmtDate = (s: string) =>
  new Date(s).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

export default function Board() {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [selected, setSelected] = useState<Lead | null>(null);

  async function load() {
    try {
      const res = await fetch("/api/admin/leads", { cache: "no-store" });
      if (!res.ok) throw new Error();
      const j = (await res.json()) as { leads: Lead[] };
      setLeads(j.leads);
      setErr(null);
    } catch {
      setErr("Could not load leads.");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function move(token: string, status: Status) {
    setLeads((cur) => cur?.map((l) => (l.token === token ? { ...l, status } : l)) ?? cur);
    setSelected((s) => (s && s.token === token ? { ...s, status } : s));
    try {
      await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, status }),
      });
    } catch {
      load();
    }
  }

  if (err) return <p className="admin__err">{err}</p>;
  if (!leads) return <p className="admin__note">Loading…</p>;

  return (
    <>
      <div className="admin__sub">
        {leads.length} owner{leads.length === 1 ? "" : "s"} ·{" "}
        <button className="admin__refresh" onClick={load} type="button">
          Refresh
        </button>
      </div>
      <div className="board">
        {COLUMNS.map((col) => {
          const items = leads.filter((l) => l.status === col.key);
          return (
            <section className="board__col" key={col.key} data-col={col.key}>
              <h2 className="board__colhead">
                {col.label} <span>{items.length}</span>
              </h2>
              <div className="board__list">
                {items.map((l) => (
                  <article
                    className="card"
                    key={l.token}
                    onClick={() => setSelected(l)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setSelected(l)}
                  >
                    <div className="card__name">{l.name}</div>
                    <div className="card__phone">{pretty(l.phone)}</div>
                    <div className="card__meta">
                      {l.town}
                      {l.locationText ? ` · ${l.locationText}` : ""}
                    </div>
                    <div className="card__badges">
                      {l.completed ? (
                        <span className="card__tag">Seat #{l.position}</span>
                      ) : (
                        <span className="card__tag card__tag--draft">Step 1 only</span>
                      )}
                      {l.photoCount > 0 && <span className="card__tag card__tag--ph">{l.photoCount} photos</span>}
                    </div>
                    <select
                      className="card__move"
                      value={l.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => move(l.token, e.target.value as Status)}
                    >
                      {COLUMNS.map((c) => (
                        <option key={c.key} value={c.key}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </article>
                ))}
                {items.length === 0 && <p className="board__empty">No leads here.</p>}
              </div>
            </section>
          );
        })}
      </div>

      {selected && (
        <div className="lead" onClick={() => setSelected(null)}>
          <div className="lead__panel" onClick={(e) => e.stopPropagation()}>
            <button className="lead__close" onClick={() => setSelected(null)} aria-label="Close">
              ×
            </button>
            <h2 className="lead__name">{selected.name}</h2>
            <div className="lead__actions">
              <a className="lead__btn" href={`tel:+${intl(selected.phone)}`}>
                Call
              </a>
              <a
                className="lead__btn lead__btn--wa"
                href={`https://wa.me/${intl(selected.phone)}`}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>
              <select
                className="lead__status"
                value={selected.status}
                onChange={(e) => move(selected.token, e.target.value as Status)}
              >
                {COLUMNS.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <dl className="lead__grid">
              <dt>Phone</dt>
              <dd>{pretty(selected.phone)}</dd>
              <dt>Town</dt>
              <dd>{selected.town}</dd>
              <dt>Location</dt>
              <dd>
                {selected.locationText || "—"}
                {selected.lat != null && selected.lng != null && (
                  <>
                    {" "}
                    <a
                      href={`https://www.google.com/maps?q=${selected.lat},${selected.lng}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      map ↗
                    </a>
                  </>
                )}
              </dd>
              <dt>Available</dt>
              <dd>{selected.availability || "—"}</dd>
              <dt>WhatsApp consent</dt>
              <dd>{selected.waConsent ? "Yes" : "No"}</dd>
              <dt>Seat</dt>
              <dd>{selected.completed ? `#${selected.position} (completed)` : "Step 1 only — no seat yet"}</dd>
              <dt>Signed up</dt>
              <dd>{fmtDate(selected.createdAt)}</dd>
              {(Object.keys(selected.utm).length > 0 || selected.fbclid) && (
                <>
                  <dt>Source</dt>
                  <dd>
                    {Object.entries(selected.utm)
                      .map(([k, v]) => `${k}=${v}`)
                      .join(", ") || ""}
                    {selected.fbclid ? ` · fbclid` : ""}
                  </dd>
                </>
              )}
            </dl>

            <div className="lead__photos">
              <div className="lead__photos-h">Photos ({selected.photoUrls.length})</div>
              {selected.photoUrls.length === 0 ? (
                <p className="admin__note" style={{ padding: "6px 0" }}>
                  No photos uploaded.
                </p>
              ) : (
                <div className="lead__thumbs">
                  {selected.photoUrls.map((u, i) => (
                    <a key={i} href={u} target="_blank" rel="noreferrer">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={u} alt={`Photo ${i + 1}`} />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
