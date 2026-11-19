"use client";

import { useEffect, useId, useRef, useState } from "react";
import { config } from "@/landing/config";
import { copy } from "@/landing/copy";
import { compressImage } from "@/landing/lib/compressImage";
import { newEventId, track, trackCustom } from "@/landing/lib/pixel";
import {
  cleanPhone,
  hasErrors,
  validateStep1,
  validateStep2,
  type Errors,
  type Step1,
  type Step2,
} from "@/landing/lib/validate";
import { ArrowRight } from "./Icons";
import { useSeats } from "./SeatsProvider";

const F = copy.form;
type Photo = { id: string; url: string; blob: Blob };
type Done = { position: number; consent: boolean; name: string; waitlist: boolean };

/** UTM params + fbclid from the landing URL (sent with step 1). */
function readTracking() {
  const q = new URLSearchParams(location.search);
  const utm: Record<string, string> = {};
  q.forEach((v, k) => {
    if (k.startsWith("utm_")) utm[k] = v;
  });
  return { utm, fbclid: q.get("fbclid") };
}

async function post<T>(url: string, body: unknown): Promise<{ ok: true; data: T } | { ok: false; status: number; data: unknown }> {
  try {
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json().catch(() => ({}));
    return res.ok ? { ok: true, data: data as T } : { ok: false, status: res.status, data };
  } catch {
    return { ok: false, status: 0, data: {} };
  }
}

export function OwnerForm() {
  const { left, refresh } = useSeats();
  const waitlist = left === 0;
  const uid = useId();
  const ids = (k: string) => `${uid}-${k}`;

  const [step, setStep] = useState<1 | 2>(1);
  const [done, setDone] = useState<Done | null>(null);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState("");
  const leadId = useRef<string | null>(null);

  const [s1, setS1] = useState<Step1>({ name: "", phone: "", town: "" });
  const [e1, setE1] = useState<Errors<Step1>>({});
  const [s2, setS2] = useState<Omit<Step2, "photoCount">>({
    locationText: "",
    lat: null,
    lng: null,
    availability: "",
    waConsent: false,
  });
  const [e2, setE2] = useState<Errors<Step2>>({});
  const [loc, setLoc] = useState<"idle" | "locating" | "added" | "denied">("idle");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photoBusy, setPhotoBusy] = useState(false);

  const stepHeading = useRef<HTMLParagraphElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const townSheet = useRef<HTMLDialogElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [honeypot, setHoneypot] = useState("");

  // Revoke thumbnail URLs on unmount.
  const photosRef = useRef(photos);
  photosRef.current = photos;
  useEffect(() => () => photosRef.current.forEach((p) => URL.revokeObjectURL(p.url)), []);

  /* ---------- step 1 ---------- */
  const blur1 = (k: keyof Step1) => {
    const { errors } = validateStep1(s1);
    setE1((prev) => ({ ...prev, [k]: s1[k] ? errors[k] : prev[k] }));
  };

  const onNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    const { data, errors } = validateStep1(s1);
    setE1(errors);
    if (hasErrors(errors)) {
      document.getElementById(ids(Object.keys(errors)[0]))?.focus();
      return;
    }
    setBusy(true);
    setFormError("");
    const res = await post<{ leadId: string }>("/api/owner/start", { ...data, ...readTracking(), website: honeypot });
    setBusy(false);
    if (!res.ok) {
      const server = (res.data as { errors?: Errors<Step1> }).errors;
      if (server) setE1(server);
      else setFormError(F.errors.network);
      return;
    }
    leadId.current = res.data.leadId;
    trackCustom("Step1Complete", { town: data.town });
    setStep(2);
  };

  /* ---------- step 2 ---------- */
  const locateMe = () => {
    if (!("geolocation" in navigator)) {
      setLoc("denied");
      return;
    }
    setLoc("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setS2((v) => ({ ...v, lat: pos.coords.latitude, lng: pos.coords.longitude }));
        setE2((v) => ({ ...v, locationText: undefined }));
        setLoc("added");
      },
      () => setLoc("denied"),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    );
  };

  const addPhotos = async (files: FileList | null) => {
    if (!files?.length) return;
    setPhotoBusy(true);
    const room = 10 - photos.length;
    const next: Photo[] = [];
    for (const file of Array.from(files).slice(0, room)) {
      if (!file.type.startsWith("image/")) continue;
      try {
        const blob = await compressImage(file);
        next.push({ id: newEventId(), url: URL.createObjectURL(blob), blob });
      } catch {
        /* skip unreadable files */
      }
    }
    setPhotos((p) => [...p, ...next].slice(0, 10));
    setPhotoBusy(false);
    if (fileInput.current) fileInput.current.value = "";
  };

  const removePhoto = (id: string) =>
    setPhotos((p) => {
      const gone = p.find((x) => x.id === id);
      if (gone) URL.revokeObjectURL(gone.url);
      return p.filter((x) => x.id !== id);
    });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy || !leadId.current) return;
    const { data, errors } = validateStep2({ ...s2, photoCount: photos.length });
    setE2(errors);
    if (hasErrors(errors)) {
      const first = errors.locationText ? ids("locationText") : ids("when-0");
      document.getElementById(first)?.focus();
      return;
    }
    setBusy(true);
    setFormError("");
    const eventId = newEventId();
    // TODO(photos): upload `photos[].blob` once a file store is chosen, and send their URLs.
    const res = await post<{ position: number }>("/api/owner/complete", { leadId: leadId.current, ...data, eventId });
    setBusy(false);
    if (!res.ok) {
      const server = (res.data as { errors?: Errors<Step2> }).errors;
      if (server) setE2(server);
      else if (res.status === 404) {
        setStep(1);
        setFormError(F.errors.network);
      } else setFormError(F.errors.network);
      return;
    }
    track("Lead", { content_name: "owner_free_spot", town: s1.town }, eventId);
    setDone({ position: res.data.position, consent: data.waConsent, name: s1.name, waitlist: res.data.position > config.seatTotal });
    refresh(); // the counter everywhere drops to the real new value
  };

  // Move focus to the new step / success message for keyboard + screen-reader users.
  useEffect(() => {
    if (step === 2) stepHeading.current?.focus();
  }, [step]);
  useEffect(() => {
    if (done) successRef.current?.focus();
  }, [done]);

  /* ---------- success ---------- */
  if (done) {
    const wa = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(F.success.waText(done.name))}`;
    return (
      <div className="form-card success" ref={successRef} tabIndex={-1} role="status">
        <svg className="success-tick" viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="32" cy="32" r="30" />
          <path d="M19 33.5 28 42l17-19" />
        </svg>
        <p className="success-title">{done.waitlist ? F.success.waitlistTitle : F.success.title(done.position)}</p>
        <p className="success-sub">{done.consent ? F.success.whatsapp : F.success.noWhatsapp}</p>
        <a className="btn-secondary" href={wa} target="_blank" rel="noopener noreferrer">
          <WaIcon />
          {F.success.openWhatsapp}
        </a>
      </div>
    );
  }

  return (
    <div className="form-card">
      <div className="progress" aria-hidden="true">
        <span className="is-on" />
        <span className={step === 2 ? "is-on" : ""} />
      </div>
      <p className="step-label" ref={stepHeading} tabIndex={-1}>
        {F.stepOf(step)}
      </p>

      {step === 1 ? (
        <form onSubmit={onNext} noValidate>
          {/* honeypot */}
          <div className="hp" aria-hidden="true">
            <label>
              Website
              <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
            </label>
          </div>

          <div className="field">
            <label htmlFor={ids("name")}>{F.name.label}</label>
            <input
              id={ids("name")}
              type="text"
              autoComplete="name"
              placeholder={F.name.placeholder}
              value={s1.name}
              onChange={(e) => setS1({ ...s1, name: e.target.value })}
              onBlur={() => blur1("name")}
              aria-invalid={!!e1.name}
              aria-describedby={e1.name ? ids("name-err") : undefined}
            />
            {e1.name && <p className="err" id={ids("name-err")}>{e1.name}</p>}
          </div>

          <div className="field">
            <label htmlFor={ids("phone")}>{F.phone.label}</label>
            <div className={`phone-input${e1.phone ? " is-invalid" : ""}`}>
              <span className="prefix" aria-hidden="true">
                +91
              </span>
              <input
                id={ids("phone")}
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder={F.phone.placeholder}
                maxLength={10}
                value={s1.phone}
                onChange={(e) => setS1({ ...s1, phone: cleanPhone(e.target.value).slice(0, 10) })}
                onBlur={() => blur1("phone")}
                aria-invalid={!!e1.phone}
                aria-describedby={e1.phone ? ids("phone-err") : undefined}
              />
            </div>
            {e1.phone && <p className="err" id={ids("phone-err")}>{e1.phone}</p>}
          </div>

          <div className="field">
            <span className="label" id={ids("town-label")}>
              {F.town.label}
            </span>
            <button
              type="button"
              id={ids("town")}
              className={`select-btn${s1.town ? "" : " is-empty"}${e1.town ? " is-invalid" : ""}`}
              aria-labelledby={`${ids("town-label")} ${ids("town")}`}
              aria-haspopup="dialog"
              aria-describedby={e1.town ? ids("town-err") : undefined}
              onClick={() => townSheet.current?.showModal()}
            >
              <span>{s1.town || F.town.placeholder}</span>
              <Chevron />
            </button>
            {e1.town && <p className="err" id={ids("town-err")}>{e1.town}</p>}
          </div>

          <dialog
            ref={townSheet}
            className="sheet"
            aria-labelledby={ids("sheet-title")}
            onClick={(e) => e.target === e.currentTarget && townSheet.current?.close()}
          >
            <div className="sheet-inner">
              <span className="sheet-grip" aria-hidden="true" />
              <p className="sheet-title" id={ids("sheet-title")}>
                {F.town.sheetTitle}
              </p>
              <div className="sheet-options" role="radiogroup" aria-labelledby={ids("sheet-title")}>
                {config.towns.map((t) => (
                  <button
                    key={t}
                    type="button"
                    role="radio"
                    aria-checked={s1.town === t}
                    className="sheet-option"
                    onClick={() => {
                      setS1({ ...s1, town: t });
                      setE1({ ...e1, town: undefined });
                      townSheet.current?.close();
                      document.getElementById(ids("town"))?.focus();
                    }}
                  >
                    {t}
                    {s1.town === t && <Check />}
                  </button>
                ))}
              </div>
            </div>
          </dialog>

          {formError && <p className="err form-err" role="alert">{formError}</p>}

          <button className="btn-primary" type="submit" disabled={busy} aria-busy={busy}>
            {busy ? F.saving : F.next}
            {!busy && <ArrowRight />}
          </button>
        </form>
      ) : (
        <form onSubmit={onSubmit} noValidate>
          <div className="field">
            <label htmlFor={ids("locationText")}>{F.location.label}</label>
            <input
              id={ids("locationText")}
              type="text"
              autoComplete="street-address"
              placeholder={F.location.placeholder}
              value={s2.locationText}
              onChange={(e) => setS2({ ...s2, locationText: e.target.value })}
              aria-invalid={!!e2.locationText}
              aria-describedby={e2.locationText ? ids("loc-err") : undefined}
            />
            <button
              type="button"
              className={`loc-btn${loc === "added" ? " is-added" : ""}`}
              onClick={locateMe}
              disabled={loc === "locating"}
            >
              <PinIcon />
              {loc === "locating" ? F.location.locating : loc === "added" ? F.location.added : F.location.useMine}
              {loc === "added" && <Check />}
            </button>
            {loc === "denied" && <p className="hint">{F.location.denied}</p>}
            {e2.locationText && <p className="err" id={ids("loc-err")}>{e2.locationText}</p>}
          </div>

          <fieldset className="field" aria-describedby={e2.availability ? ids("when-err") : undefined}>
            <legend>{F.when.label}</legend>
            <div className="chips">
              {F.when.options.map((o, i) => (
                <label key={o} className="chip">
                  <input
                    id={ids(`when-${i}`)}
                    type="radio"
                    name={ids("when")}
                    value={o}
                    checked={s2.availability === o}
                    onChange={() => {
                      setS2({ ...s2, availability: o });
                      setE2({ ...e2, availability: undefined });
                    }}
                  />
                  <span>{o}</span>
                </label>
              ))}
            </div>
            {e2.availability && <p className="err" id={ids("when-err")}>{e2.availability}</p>}
          </fieldset>

          <div className="field">
            <span className="label">
              {F.photos.label} <span className="optional">{F.photos.optional}</span>
            </span>
            <div className="photos">
              {photos.map((p, i) => (
                <span key={p.id} className="photo">
                  {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview */}
                  <img src={p.url} alt={`Photo ${i + 1}`} width={72} height={72} />
                  <button type="button" className="photo-x" aria-label={`${F.photos.remove} ${i + 1}`} onClick={() => removePhoto(p.id)}>
                    ×
                  </button>
                </span>
              ))}
              {photos.length < 10 && (
                <label className={`photo-add${photoBusy ? " is-busy" : ""}`}>
                  <input
                    ref={fileInput}
                    type="file"
                    accept="image/*"
                    multiple
                    className="sr-only"
                    onChange={(e) => addPhotos(e.target.files)}
                    disabled={photoBusy}
                  />
                  <span aria-hidden="true">+</span>
                  <span className="photo-add-text">{photoBusy ? "..." : F.photos.add}</span>
                </label>
              )}
            </div>
            <p className="hint">
              {photos.length}/10 · {F.photos.hint}
            </p>
          </div>

          <label className="consent">
            <input
              type="checkbox"
              checked={s2.waConsent}
              onChange={(e) => setS2({ ...s2, waConsent: e.target.checked })}
            />
            <span className="box" aria-hidden="true">
              <Check />
            </span>
            <span>{F.consent}</span>
          </label>

          {formError && <p className="err form-err" role="alert">{formError}</p>}

          <button className="btn-primary" type="submit" disabled={busy} aria-busy={busy}>
            {busy ? F.saving : waitlist ? F.submitWaitlist : F.submit}
            {!busy && <ArrowRight />}
          </button>
          <button type="button" className="btn-text" onClick={() => setStep(1)} disabled={busy}>
            {F.back}
          </button>
        </form>
      )}
    </div>
  );
}

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
function Check() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.5 10 17l9-10" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinejoin="round">
      <path d="M12 21s-6-5.6-6-11a6 6 0 0 1 12 0c0 5.4-6 11-6 11z" />
      <circle cx="12" cy="10" r="2.2" />
    </svg>
  );
}
function WaIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="currentColor">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.4-.2z" />
    </svg>
  );
}
