"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/logo";
import { site } from "@/content/site";

// Transparent over each page's hero ([data-hero]), solid once the hero has scrolled away.
export function SiteHeader() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const header = headerRef.current;
    const hero = document.querySelector("[data-hero]");
    if (!header) return;
    if (!hero) {
      header.dataset.solid = "true";
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        header.dataset.solid = String(!entry.isIntersecting);
      },
      { rootMargin: "-76px 0px 0px 0px" },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header ref={headerRef} className="site-header" data-solid="false">
      <div className="wrap header-inner">
        <Link href="/" className="logo" aria-label={`${site.name}, home`}>
          <Logo />
          {site.name}
        </Link>
        <nav className="main-nav" aria-label="Main">
          {site.nav.map((item) => (
            <Link key={item.href} href={item.href} aria-current={isCurrent(item.href) ? "page" : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-cta">
          <Link href="/enquire" className="button">
            Enquire
          </Link>
        </div>
        <button type="button" className="button menu-button" aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(true)}>
          Menu
        </button>
      </div>

      {menuOpen && (
        <div id="mobile-menu" className="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="mobile-menu-top">
            <Link href="/" className="logo" onClick={() => setMenuOpen(false)}>
              <Logo />
              {site.name}
            </Link>
            <button type="button" className="button button-ghost" onClick={() => setMenuOpen(false)} autoFocus>
              Close
            </button>
          </div>
          <nav aria-label="Main">
            {site.nav.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} aria-current={isCurrent(item.href) ? "page" : undefined}>
                {item.label}
              </Link>
            ))}
          </nav>
          <Link href="/enquire" className="button button-apricot" onClick={() => setMenuOpen(false)}>
            Enquire about a journey
          </Link>
        </div>
      )}
    </header>
  );
}
