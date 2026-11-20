"use client";
import { useEffect } from "react";
import { Camera, MapPin, MessageCircle, Phone, X } from "lucide-react";
import { fmtDate, intl, pretty, STATUSES, statusMeta, type Lead, type StatusId } from "./status";

export default function LeadDrawer({
  lead,
  onClose,
  onMove,
}: {
  lead: Lead;
  onClose: () => void;
  onMove: (token: string, status: StatusId) => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const meta = statusMeta(lead.status);
  const source = Object.entries(lead.utm)
    .map(([k, v]) => `${k.replace(/^utm_/, "")}: ${v}`)
    .join(" · ");

  return (
    <>
      <div className="drawerBack" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="leadTitle">
        <div className="drawerHead">
          <button className="drawerClose" onClick={onClose} aria-label="Close">
            <X size={17} />
          </button>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <span className="pill" style={{ background: meta.soft, color: meta.color }}>
              <i className="dot" style={{ background: meta.color }} />
              {meta.label}
            </span>
            {lead.completed ? (
              <span className="seatTag">SEAT #{lead.position}</span>
            ) : (
              <span className="seatTag draft">STEP 1 ONLY</span>
            )}
          </div>
          <h2 id="leadTitle">{lead.name}</h2>
          <div className="contactActions">
            <a className="btn small" href={`tel:+${intl(lead.phone)}`}>
              <Phone size={14} /> Call
            </a>
            <a className="btn small wa" href={`https://wa.me/${intl(lead.phone)}`} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={14} /> WhatsApp
            </a>
          </div>
        </div>

        <div className="drawerBody">
          <dl className="infoGrid">
            <div>
              <dt>Phone</dt>
              <dd>{pretty(lead.phone)}</dd>
            </div>
            <div>
              <dt>Town</dt>
              <dd>{lead.town}</dd>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <dt>Location</dt>
              <dd>
                {lead.locationText || "—"}
                {lead.lat != null && lead.lng != null && (
                  <>
                    {" · "}
                    <a href={`https://www.google.com/maps?q=${lead.lat},${lead.lng}`} target="_blank" rel="noopener noreferrer">
                      <MapPin size={12} style={{ verticalAlign: -2 }} /> Open in Maps
                    </a>
                  </>
                )}
              </dd>
            </div>
            <div>
              <dt>House free</dt>
              <dd>{lead.availability || "—"}</dd>
            </div>
            <div>
              <dt>WhatsApp updates</dt>
              <dd>{lead.waConsent ? "Yes" : "No"}</dd>
            </div>
            <div>
              <dt>Signed up</dt>
              <dd>{fmtDate(lead.createdAt)}</dd>
            </div>
            <div>
              <dt>Seat</dt>
              <dd>{lead.completed ? `#${lead.position}` : "Not yet"}</dd>
            </div>
            {(source || lead.fbclid) && (
              <div style={{ gridColumn: "1 / -1" }}>
                <dt>Source</dt>
                <dd>
                  {source || "—"}
                  {lead.fbclid ? " · Facebook ad" : ""}
                </dd>
              </div>
            )}
          </dl>

          <div>
            <p className="sectionLabel">Stage</p>
            <div className="statusPicker">
              {STATUSES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={lead.status === s.id ? "on" : ""}
                  style={lead.status === s.id ? { color: s.color, background: s.soft } : undefined}
                  onClick={() => lead.status !== s.id && onMove(lead.token, s.id)}
                  aria-pressed={lead.status === s.id}
                >
                  <i className="dot" style={{ background: s.color }} />
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="sectionLabel">
              <Camera size={12} style={{ verticalAlign: -2 }} /> Photos
            </p>
            {lead.photoUrls.length > 0 ? (
              <div className="thumbs">
                {lead.photoUrls.map((u, i) => (
                  <a key={i} href={u} target="_blank" rel="noopener noreferrer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={u} alt={`Photo ${i + 1}`} />
                  </a>
                ))}
              </div>
            ) : (
              <p className="muted" style={{ margin: 0, fontSize: 13 }}>
                {lead.photoCount > 0
                  ? `Owner selected ${lead.photoCount} photo${lead.photoCount === 1 ? "" : "s"} (uploads not stored yet).`
                  : "No photos."}
              </p>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
