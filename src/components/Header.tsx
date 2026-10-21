"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV } from "@/content/site";
import { getLenis } from "@/lib/lenis";
import { Icon } from "./Icon";

/** Glass navbar + mobile drawer. Identical on every page. */
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  // Stronger shadow once the page has scrolled 8px
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the drawer on navigation
  useEffect(() => setOpen(false), [pathname]);

  // Drawer: lock page scroll, close on Esc, close when the viewport becomes desktop
  useEffect(() => {
    if (!open) return;
    document.body.classList.add("no-scroll");
    getLenis()?.stop();
    closeBtn.current?.focus();

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const desktop = matchMedia("(min-width: 900px)");
    const onResize = (e: MediaQueryListEvent) => e.matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onResize);

    const button = menuBtn.current;
    return () => {
      document.body.classList.remove("no-scroll");
      getLenis()?.start();
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onResize);
      button?.focus();
    };
  }, [open]);

  // Same-page hash links (e.g. "Why IFH" -> /#why-ifh): close the menu, then scroll there.
  const goHash = (e: React.MouseEvent, href: string) => {
    const hash = href.split("#")[1];
    if (!hash || pathname !== "/" || !href.startsWith("/#")) return;
    e.preventDefault();
    setOpen(false);
    window.setTimeout(() => {
      const el = document.getElementById(hash);
      if (!el) return;
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(el, { offset: -104 });
      else el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `/#${hash}`);
    }, 60);
  };

  return (
    <>
      <header className={`site-header${scrolled ? " scrolled" : ""}`}>
        <div className="container header-inner">
          <Link className="brand" href="/" aria-label="IFH Connects — home">
            <Image src="/assets/logo.png" alt="" width={49} height={32} priority />
            <span className="brand-text">
              <span className="brand-name">IFH Connects</span>
              <span className="brand-cap">Rent, stay or find an office</span>
            </span>
          </Link>
          <nav aria-label="Main">
            <div className="nav-links">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  onClick={(e) => goHash(e, item.href)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
          <Link className="btn nav-cta" href="/tenant">
            Get started <Icon name="arrow" />
          </Link>
          <button
            ref={menuBtn}
            className="menu-btn"
            aria-expanded={open}
            aria-controls="drawer"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Icon name="menu" />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`drawer${open ? " open" : ""}`}
        id="drawer"
        aria-hidden={!open}
        role="dialog"
        aria-label="Menu"
        data-lenis-prevent
      >
        <div className="drawer-top">
          <Link className="brand" href="/">
            <Image src="/assets/logo.png" alt="" width={49} height={32} />
            <span className="brand-text">
              <span className="brand-name">IFH Connects</span>
            </span>
          </Link>
          <button
            ref={closeBtn}
            className="menu-btn"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <Icon name="x" />
          </button>
        </div>
        {NAV.map((item) => (
          <Link
            key={item.href}
            className="drawer-link"
            href={item.href}
            aria-current={pathname === item.href ? "page" : undefined}
            onClick={(e) => goHash(e, item.href)}
          >
            {item.label}
          </Link>
        ))}
        <Link className="btn" href="/tenant">
          Get started
        </Link>
      </div>
    </>
  );
}
