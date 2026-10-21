"use client";

import { useState, type FormEvent } from "react";
import { FaqList } from "@/components/Faq";
import { FORMS, type Field, type LeadKind } from "@/content/forms";
import type { FaqItem } from "@/content/site";

type Props = {
  kind: LeadKind;
  faqEyebrow: string;
  faqTitle: string;
  faqItems: FaqItem[];
};

type Status = "idle" | "sending" | "done";

/** Enquiry form (left) next to the FAQ accordion (right). */
export function LeadSection({ kind, faqEyebrow, faqTitle, faqItems }: Props) {
  const form = FORMS[kind];
  const [values, setValues] = useState<Record<string, string | string[]>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState("");

  const set = (name: string, value: string | string[]) => {
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((e) => (e[name] ? { ...e, [name]: "" } : e));
  };

  const toggle = (name: string, option: string) => {
    const current = (values[name] as string[] | undefined) ?? [];
    set(
      name,
      current.includes(option) ? current.filter((o) => o !== option) : [...current, option],
    );
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setFormError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          kind,
          website: new FormData(e.currentTarget).get("website"),
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus("done");
        return;
      }
      if (json.errors) {
        setErrors(json.errors);
        document.getElementById(`${kind}-${Object.keys(json.errors)[0]}`)?.focus();
      } else {
        setFormError(json.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setFormError("Network error. Please check your connection and try again.");
    }
    setStatus("idle");
  }

  return (
    <section className="section bg-sage" id="faq" aria-labelledby={`${kind}-form-h`}>
      <div className="container lead-grid">
        <div className="lead-card reveal" id="enquire">
          {status === "done" ? (
            <div className="lead-done" role="status">
              <span className="eyebrow">Thank you</span>
              <h2 className="section-title">We&apos;ve got your details.</h2>
              <p>
                An IFH advisor will call you on the number you shared, usually within one working
                day.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate>
              <span className="eyebrow">{form.eyebrow}</span>
              <h2 className="section-title" id={`${kind}-form-h`}>
                {form.title}
              </h2>
              <p className="lead-sub">{form.lead}</p>

              <div className="lead-fields">
                {form.fields.map((f) => (
                  <FieldInput
                    key={f.name}
                    kind={kind}
                    field={f}
                    value={values[f.name]}
                    error={errors[f.name]}
                    onChange={(v) => set(f.name, v)}
                    onToggle={(o) => toggle(f.name, o)}
                  />
                ))}
              </div>

              {/* honeypot: hidden from people, tempting for bots */}
              <input
                className="hp"
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              {formError && (
                <p className="field-error" role="alert">
                  {formError}
                </p>
              )}
              <button className="btn btn-block" type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : form.submit}
              </button>
              <p className="fine">
                By submitting you agree to be contacted by IFH Connects about your enquiry.
              </p>
            </form>
          )}
        </div>

        <div className="lead-faq">
          <div className="reveal">
            <span className="eyebrow">{faqEyebrow}</span>
            <h2 className="section-title">{faqTitle}</h2>
          </div>
          <FaqList id={`${kind}-faq`} items={faqItems} />
        </div>
      </div>
    </section>
  );
}

function FieldInput({
  kind,
  field: f,
  value,
  error,
  onChange,
  onToggle,
}: {
  kind: LeadKind;
  field: Field;
  value: string | string[] | undefined;
  error?: string;
  onChange: (v: string) => void;
  onToggle: (o: string) => void;
}) {
  const id = `${kind}-${f.name}`;
  const err = error ? `${id}-err` : undefined;
  const label = (
    <>
      {f.label}
      {f.required && <span aria-hidden="true"> *</span>}
    </>
  );
  const text = typeof value === "string" ? value : "";
  const common = { id, name: f.name, "aria-invalid": !!error, "aria-describedby": err };

  let control: React.ReactNode;
  switch (f.type) {
    case "text":
    case "email":
    case "tel":
      control = (
        <input
          {...common}
          type={f.type}
          value={text}
          required={f.required}
          inputMode={f.type === "tel" ? "numeric" : undefined}
          autoComplete={
            f.name === "name"
              ? "name"
              : f.type === "tel"
                ? "tel-national"
                : f.type === "email"
                  ? "email"
                  : undefined
          }
          placeholder={f.hint}
          maxLength={f.type === "tel" ? 15 : 200}
          onChange={(e) => onChange(e.target.value)}
        />
      );
      break;
    case "select":
      control = (
        <select
          {...common}
          value={text}
          required={f.required}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Select…</option>
          {f.options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      );
      break;
    case "textarea":
      control = (
        <textarea
          {...common}
          rows={3}
          maxLength={1000}
          value={text}
          onChange={(e) => onChange(e.target.value)}
        />
      );
      break;
    case "radio":
    case "chips": {
      const multi = f.type === "chips";
      const picked = multi ? ((value as string[] | undefined) ?? []) : [text];
      return (
        <fieldset className="field field-group" aria-describedby={err}>
          <legend>{label}</legend>
          <div className="chip-row">
            {f.options.map((o) => (
              <label key={o} className={`chip${picked.includes(o) ? " is-on" : ""}`}>
                <input
                  type={multi ? "checkbox" : "radio"}
                  name={f.name}
                  checked={picked.includes(o)}
                  onChange={() => (multi ? onToggle(o) : onChange(o))}
                />
                {o}
              </label>
            ))}
          </div>
          {error && (
            <p className="field-error" id={err}>
              {error}
            </p>
          )}
        </fieldset>
      );
    }
  }

  return (
    <div className={`field${f.type === "textarea" ? " field-wide" : ""}`}>
      <label htmlFor={id}>{label}</label>
      {control}
      {error && (
        <p className="field-error" id={err}>
          {error}
        </p>
      )}
    </div>
  );
}
