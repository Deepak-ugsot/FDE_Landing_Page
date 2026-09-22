"use client";

import { useEffect, useRef, useState } from "react";
import { navLinks, program } from "@/content/program";
import { Logo } from "@/components/ui/Logo";

const allLinks = [...navLinks, { label: "Apply now", href: program.applyHref }];
const homeLabel = `${program.name} by ${program.mentor} — home`;

/** Hamburger icon (short accent bottom line) that morphs into an ✕ when `open`. */
function MenuButton({
  open,
  onClick,
  className = "",
  tabIndex,
  buttonRef,
}: {
  open: boolean;
  onClick: (button: HTMLButtonElement) => void;
  className?: string;
  tabIndex?: number;
  buttonRef?: React.Ref<HTMLButtonElement>;
}) {
  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={(e) => onClick(e.currentTarget)}
      tabIndex={tabIndex}
      aria-expanded={open}
      aria-controls="site-menu"
      aria-label={open ? "Close menu" : "Open menu"}
      className={`group relative flex size-11 items-center justify-center rounded-full transition-colors ${className}`}
    >
      <span aria-hidden="true" className="relative block h-3.5 w-5">
        <span
          className={`absolute left-0 h-[2px] w-full rounded-full bg-current transition-all duration-300 ${
            open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
          }`}
        />
        <span
          className={`absolute top-1/2 left-0 h-[2px] w-full -translate-y-1/2 rounded-full bg-current transition-opacity duration-200 ${
            open ? "opacity-0" : ""
          }`}
        />
        <span
          className={`absolute left-0 h-[2px] rounded-full transition-all duration-300 ${
            open ? "bottom-1/2 w-full translate-y-1/2 -rotate-45 bg-current" : "bottom-0 w-3 bg-accent"
          }`}
        />
      </span>
    </button>
  );
}

/**
 * Site navigation, handled like the reference:
 *  - At the top, the full nav sits inside the hero card (links on desktop, menu button on mobile).
 *  - Once it scrolls out of view, a fixed bar fades in: the logo stays top-left and a menu
 *    button top-right, both aligned with where they sat in the nav.
 *  - The menu button opens an accent panel of links over a dimmed page. It closes with the ✕,
 *    a click outside, choosing a link, or Esc.
 */
export function Nav() {
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  // Show the fixed bar once the in-flow nav has scrolled out of view.
  useEffect(() => {
    const update = () => {
      const r = navRef.current?.getBoundingClientRect();
      setStuck(!!r && r.bottom < 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // While open: Esc closes, and focus moves into the panel (and back to the opener on close).
  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      // preventScroll: after choosing a link, don't jump back up to the opener button.
      openerRef.current?.focus({ preventScroll: true });
    };
  }, [open]);

  const toggle = (button: HTMLButtonElement) => {
    // Remember the exact button that opened the menu, to return focus to it on close
    // (Safari doesn't focus buttons on click, so document.activeElement isn't reliable).
    if (!open) openerRef.current = button;
    setOpen((o) => !o);
  };
  const close = () => setOpen(false);

  return (
    <>
      {/* In-flow nav inside the hero card */}
      <nav ref={navRef} aria-label="Main" className="relative flex items-center justify-between px-5 py-6 sm:px-8">
        <a href="#top" aria-label={homeLabel}>
          <Logo className="size-12 sm:size-14" />
        </a>

        <ul className="hidden items-center gap-5 text-[15px] lg:flex">
          {allLinks.map((link) => (
            <li key={link.href}>
              {/* Hover: an accent dot pops in on the left and a soft gradient pill fades in behind */}
              <a
                href={link.href}
                className="group relative isolate flex h-8 items-center rounded-lg pr-2.5 pl-5 text-paper/80 transition-colors duration-300 hover:text-paper focus-visible:text-paper"
              >
                <span className="absolute left-2 flex size-1.5 items-center justify-center" aria-hidden="true">
                  <span className="size-0 rounded-full bg-accent transition-all duration-300 ease-out group-hover:size-full group-focus-visible:size-full" />
                </span>
                {link.label}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 rounded-lg bg-[linear-gradient(315deg,rgba(235,255,85,0.16),rgba(235,255,85,0))] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                />
              </a>
            </li>
          ))}
        </ul>

        <MenuButton open={open} onClick={toggle} className="bg-ink text-paper lg:hidden" />
      </nav>

      {/* Fixed bar: fades in once the nav above has scrolled away. Offsets match the nav's logo position. */}
      <div
        aria-hidden={!stuck}
        className={`pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between px-9 pt-4 transition-all duration-300 sm:px-14 lg:px-16 ${
          stuck ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
        }`}
      >
        <a href="#top" aria-label={homeLabel} tabIndex={stuck ? 0 : -1} className={stuck ? "pointer-events-auto" : ""}>
          <Logo className="size-12" />
        </a>
        <MenuButton
          open={open}
          onClick={toggle}
          tabIndex={stuck ? 0 : -1}
          className={`bg-ink-deep/90 text-paper shadow-lg ring-1 ring-white/10 backdrop-blur ${stuck ? "pointer-events-auto" : ""}`}
        />
      </div>

      {/* Dimmed backdrop: click to close */}
      <div
        aria-hidden="true"
        onClick={close}
        className={`fixed inset-0 z-[55] bg-black/60 transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />

      {/* Menu panel (accent), anchored top-right like the reference */}
      <div
        id="site-menu"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        inert={!open}
        className={`fixed top-3 right-3 z-[60] w-[min(320px,calc(100vw-1.5rem))] origin-top-right rounded-3xl bg-accent p-7 pt-6 text-ink-deep shadow-2xl transition-all duration-300 sm:right-6 lg:right-8 ${
          open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        <div className="flex justify-end">
          <MenuButton open onClick={close} className="-mr-3 bg-ink-deep text-paper" />
        </div>
        <ul className="mt-2 space-y-1">
          {allLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={close}
                className="block rounded-xl py-1.5 font-display text-2xl leading-tight transition-opacity outline-offset-4 hover:opacity-60 focus-visible:outline-2 focus-visible:outline-ink-deep"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
