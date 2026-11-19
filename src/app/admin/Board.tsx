"use client";
import { useEffect, useState } from "react";

type Status = "new" | "contacted" | "converted" | "lost";
type Lead = {
  token: string;
  name: string;
  phone: string;
  town: string;
  locationText: string | null;
  availability: string | null;
  photoCount: number;
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

export default function Board() {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

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
                  <article className="card" key={l.token}>
                    <div className="card__name">{l.name}</div>
                    <a className="card__phone" href={`tel:+${l.phone}`}>
                      +{l.phone}
                    </a>
                    <div className="card__meta">
                      {l.town}
                      {l.locationText ? ` · ${l.locationText}` : ""}
                    </div>
                    {l.completed && <span className="card__tag">Completed signup</span>}
                    <select
                      className="card__move"
                      value={l.status}
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
    </>
  );
}
