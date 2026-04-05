"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen bg-bg-deep flex overflow-hidden">
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 h-14 bg-bg-surface border-b border-border">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="flex flex-col gap-1.5 p-1"
          aria-label="Open menu"
        >
          <span className="block w-5 h-px bg-cream" />
          <span className="block w-5 h-px bg-cream" />
          <span className="block w-5 h-px bg-cream" />
        </button>
        <div className="flex flex-col items-end">
          <div className="font-label text-[0.65rem] tracking-[0.25em] uppercase text-amber leading-none mb-0.5">
            Barefoot Mary
          </div>
          <div className="font-display text-[0.9rem] font-light text-cream leading-none">
            Admin
          </div>
        </div>
      </div>

      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — fixed drawer on mobile, static on desktop */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-in-out lg:transform-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <AdminSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto pt-14 lg:pt-0">{children}</main>
    </div>
  );
}
