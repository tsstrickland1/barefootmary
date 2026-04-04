"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/episodes", label: "Episodes" },
  { href: "/field-notes", label: "Field Notes" },
  { href: "/archive", label: "The Archive" },
  { href: "/share-your-story", label: "Share Your Story" },
  { href: "/about", label: "About" },
];

export function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close menu on Escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <nav className="sticky top-0 z-50 grid grid-cols-[1fr_auto_1fr] items-center px-6 py-4 md:px-10 md:py-5 bg-[rgba(14,12,10,0.94)] backdrop-blur-[10px] border-b border-border">
        {/* Left: hamburger (mobile) or nav links (desktop) */}
        <div className="flex items-center">
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden flex flex-col justify-center gap-[5px] w-8 h-8 cursor-pointer"
            aria-label="Open navigation menu"
          >
            <span className="block w-5 h-px bg-cream transition-all duration-200" />
            <span className="block w-5 h-px bg-cream transition-all duration-200" />
            <span className="block w-3 h-px bg-cream transition-all duration-200" />
          </button>

          {/* Nav links — desktop only */}
          <ul className="hidden md:flex gap-8 list-none">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`font-label text-[0.72rem] font-medium tracking-[0.2em] uppercase no-underline transition-colors duration-200 ${
                    pathname.startsWith(link.href)
                      ? "text-cream"
                      : "text-cream-dim hover:text-cream"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Center: logo — always */}
        <Link href="/" className="no-underline justify-self-center">
          <Image src="/logo.svg" alt="Barefoot Mary" width={120} height={32} priority />
        </Link>

        {/* Right: CTA — always */}
        <div className="flex justify-end">
          <Link
            href="/subscribe"
            className="font-label text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-bg-deep bg-amber px-4 py-2 no-underline transition-colors duration-200 hover:bg-amber-light whitespace-nowrap"
          >
            Join the Descent
          </Link>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[60] bg-[rgba(14,12,10,0.97)] flex flex-col"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          {/* Close button + logo row */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <Link href="/" className="no-underline" onClick={() => setIsOpen(false)}>
              <Image src="/logo.svg" alt="Barefoot Mary" width={110} height={30} />
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center cursor-pointer text-cream-dim hover:text-cream transition-colors duration-200"
              aria-label="Close navigation menu"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="1" y1="1" x2="17" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="17" y1="1" x2="1" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col px-6 py-8 gap-1 flex-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-display text-[2rem] font-light text-cream no-underline py-3 border-b border-border transition-colors duration-200 hover:text-amber leading-none"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Bottom CTA */}
          <div className="px-6 py-8">
            <Link
              href="/subscribe"
              className="block w-full text-center font-label text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-bg-deep bg-amber py-4 no-underline transition-colors duration-200 hover:bg-amber-light"
              onClick={() => setIsOpen(false)}
            >
              Join the Descent
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
