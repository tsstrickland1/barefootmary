"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const navLinks = [
  { href: "/episodes", label: "Episodes" },
  { href: "/field-notes", label: "Field Notes" },
  { href: "/archive", label: "The Archive" },
  { href: "/share-your-story", label: "Share Your Story" },
  { href: "/about", label: "About" },
];

const leftNavLinks = navLinks.slice(0, 2);
const rightNavLinks = navLinks.slice(2);

export function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();

    async function loadUser(userId: string | undefined) {
      if (!userId) {
        setIsAdmin(false);
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", userId)
        .single();
      setIsAdmin(profile?.is_admin ?? false);
    }

    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user ?? null;
      setUser(u);
      loadUser(u?.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      loadUser(u?.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close menu and dropdown on route change
  useEffect(() => {
    setIsOpen(false);
    setIsDropdownOpen(false);
  }, [pathname]);

  // Close menu and dropdown on Escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
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
      <nav className="sticky top-0 z-50 grid grid-cols-[1fr_auto_1fr] gap-x-4 md:gap-x-8 items-center px-6 py-4 md:px-10 md:py-5 bg-[rgba(14,12,10,0.94)] backdrop-blur-[10px] border-b border-border">
        {/* Left: hamburger (mobile) or nav links (desktop) */}
        <div className="flex items-center justify-end">
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
            {leftNavLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`font-label text-xs font-medium tracking-[0.2em] uppercase no-underline whitespace-nowrap transition-colors duration-200 ${
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

        {/* Right: nav links + CTA — desktop only; hidden on mobile */}
        <div className="hidden md:flex items-center gap-6">
          {/* Nav links — left-anchored (close to logo) */}
          {rightNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-label text-xs font-medium tracking-[0.2em] uppercase no-underline whitespace-nowrap transition-colors duration-200 ${
                pathname.startsWith(link.href)
                  ? "text-cream"
                  : "text-cream-dim hover:text-cream"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Utility — right-anchored */}
          <div className="ml-auto flex items-center gap-4">
            {user ? (
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setIsDropdownOpen((v) => !v)}
                  className="w-8 h-8 rounded-full bg-amber flex items-center justify-center font-label text-xs font-semibold text-bg-deep uppercase tracking-wide cursor-pointer transition-opacity duration-200 hover:opacity-80"
                  aria-label="User menu"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                >
                  {user.email?.[0]?.toUpperCase() ?? "U"}
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 min-w-[160px] bg-[rgba(14,12,10,0.98)] border border-border py-1 z-10">
                    <Link
                      href="/account"
                      className="block px-4 py-2 font-label text-xs tracking-[0.15em] uppercase text-cream-dim hover:text-cream transition-colors duration-200 no-underline"
                    >
                      Account
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 font-label text-xs tracking-[0.15em] uppercase text-amber hover:text-amber-light transition-colors duration-200 no-underline"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <a
                      href="/api/auth/signout"
                      className="block px-4 py-2 font-label text-xs tracking-[0.15em] uppercase text-cream-dim hover:text-cream transition-colors duration-200 no-underline border-t border-border mt-1 pt-2"
                    >
                      Sign Out
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={`/login?redirect=${encodeURIComponent(pathname)}`}
                className="font-label text-xs font-medium tracking-[0.2em] uppercase no-underline whitespace-nowrap text-cream-dim hover:text-cream transition-colors duration-200"
              >
                Sign In
              </Link>
            )}
            <Link
              href="/subscribe"
              className="font-label text-[0.7rem] font-semibold tracking-[0.18em] uppercase text-bg-deep bg-amber px-5 py-2 no-underline transition-colors duration-200 hover:bg-amber-light whitespace-nowrap"
            >
              Subscribe
            </Link>
          </div>
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

          {/* Bottom CTAs */}
          <div className="px-6 py-8 flex flex-col gap-3">
            <Link
              href="/subscribe"
              className="block w-full text-center font-label text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-bg-deep bg-amber py-4 no-underline transition-colors duration-200 hover:bg-amber-light"
              onClick={() => setIsOpen(false)}
            >
              Subscribe
            </Link>
            {user ? (
              <>
                <Link
                  href="/account"
                  className="block w-full text-center font-label text-[0.7rem] tracking-[0.18em] uppercase text-cream-dim border border-border py-3 no-underline hover:text-cream transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Account
                </Link>
                <a
                  href="/api/auth/signout"
                  className="block w-full text-center font-label text-[0.7rem] tracking-[0.18em] uppercase text-cream-dim border border-border py-3 no-underline hover:text-cream transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Out
                </a>
              </>
            ) : (
              <Link
                href="/login"
                className="block w-full text-center font-label text-[0.7rem] tracking-[0.18em] uppercase text-cream-dim border border-border py-3 no-underline hover:text-cream transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
            )}
            {user && isAdmin && (
              <Link
                href="/admin"
                className="block w-full text-center font-label text-[0.7rem] tracking-[0.18em] uppercase text-amber border border-amber py-3 no-underline hover:text-amber-light hover:border-amber-light transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
