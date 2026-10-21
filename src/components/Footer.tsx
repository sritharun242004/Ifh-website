import Image from "next/image";
import Link from "next/link";
import { FOOTER_COLUMNS } from "@/content/site";

/** Dark footer: tagline + small print, four link columns and the full logo lockup. */
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div className="footer-lead">
          <p className="footer-serif">Find your place. Skip the broker.</p>
          <div className="footer-meta">
            <span>I Find House</span>
            <span>© 2026 IFH Connects · All prices in INR</span>
            <span className="footer-tag">Zero brokerage, always</span>
          </div>
        </div>
        <div className="footer-grid">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h3>{col.title}</h3>
              <ul>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <Link className="footer-mark" href="/" aria-label="IFH Connects — home">
        <Image src="/assets/logo.png" alt="" width={1174} height={774} style={{ height: "auto" }} />
        <span className="footer-mark-text">
          <strong>IFH Connects</strong>
          <small>Rent, stay or find an office</small>
        </span>
      </Link>
    </footer>
  );
}
