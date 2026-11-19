import { config } from "@/landing/config";
import { copy } from "@/landing/copy";
import { LogoMark } from "./Logo";

/** Tiny footer: logo, name, Privacy · Terms, WhatsApp help. */
export function Footer() {
  const f = copy.footer;
  return (
    <footer className="foot">
      <p className="foot-brand">
        <LogoMark className="foot-logo" />
        {f.name}
      </p>
      <p className="foot-links">
        <a href="/privacy">{f.privacy}</a>
        <span aria-hidden="true">·</span>
        <a href="/terms">{f.terms}</a>
        <span aria-hidden="true">·</span>
        <a href={`https://wa.me/${config.whatsappNumber}`} target="_blank" rel="noopener noreferrer">
          {f.help}
        </a>
      </p>
    </footer>
  );
}
