"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/admin/_actions/auth";

const navItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Seasons", href: "/admin/seasons" },
  { label: "Episodes", href: "/admin/episodes" },
  { label: "Articles", href: "/admin/articles" },
  { label: "Archive", href: "/admin/archive" },
  { label: "Submissions", href: "/admin/submissions" },
  { label: "Subscribers", href: "/admin/subscribers" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <aside className="w-56 shrink-0 min-h-screen bg-bg-surface border-r border-border flex flex-col">
      <div className="px-6 py-8 border-b border-border">
        <div className="font-label text-[0.6rem] tracking-[0.25em] uppercase text-amber mb-1">
          Barefoot Mary
        </div>
        <div className="font-display text-[1.1rem] font-light text-cream leading-none">
          Admin
        </div>
      </div>

      <nav className="flex-1 py-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-6 py-2.5 font-label text-[0.7rem] tracking-[0.15em] uppercase transition-colors duration-150 no-underline ${
              isActive(item.href)
                ? "text-amber bg-[rgba(196,154,60,0.08)] border-r-2 border-amber"
                : "text-cream-dim hover:text-cream"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="px-6 py-6 border-t border-border">
        <form action={logoutAction}>
          <button
            type="submit"
            className="font-label text-[0.65rem] tracking-[0.15em] uppercase text-cream-dim hover:text-cream transition-colors duration-150"
          >
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
