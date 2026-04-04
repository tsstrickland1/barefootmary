"use client";

import Link from "next/link";
import { useState } from "react";

type ArchiveItem = {
  id: string;
  type: string;
  title: string;
  visibility: "public" | "subscriber" | "patron";
  episode: string;
  slug: string;
};

const typeFilters = ["All", "PDF", "IMG", "AUD", "TXT"] as const;

export function ArchiveGrid({ items }: { items: ArchiveItem[] }) {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [query, setQuery] = useState("");

  const filtered = items.filter((item) => {
    const matchesType = activeFilter === "All" || item.type === activeFilter;
    const matchesQuery = item.title.toLowerCase().includes(query.toLowerCase());
    return matchesType && matchesQuery;
  });

  return (
    <>
      {/* Type filter + search */}
      <div className="flex items-center gap-4 flex-wrap mb-8">
        {typeFilters.map((t) => (
          <button
            key={t}
            onClick={() => setActiveFilter(t)}
            className={`font-label text-[0.62rem] font-medium tracking-[0.14em] uppercase px-4 py-2 border cursor-pointer transition-all duration-200 ${
              activeFilter === t
                ? "text-bg-deep bg-amber border-amber"
                : "text-cream-dim bg-transparent border-border hover:border-amber-dim hover:text-cream"
            }`}
          >
            {t}
          </button>
        ))}

        <div className="ml-auto">
          <input
            type="text"
            placeholder="Search the archive..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="form-input w-64 text-[0.82rem]"
          />
        </div>
      </div>

      {/* Archive grid */}
      {filtered.length === 0 ? (
        <div className="border border-border p-16 text-center">
          <p className="font-label text-[0.72rem] tracking-[0.1em] uppercase text-cream-dim">
            No items match your search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
          {filtered.map((item) => (
            <Link
              key={item.id}
              href={`/archive/${item.id}`}
              className="bg-bg-surface p-6 flex flex-col gap-2 transition-colors duration-200 min-h-[140px] hover:bg-bg-raised no-underline text-inherit"
            >
              <div
                className={`font-label text-[0.58rem] font-semibold tracking-[0.15em] uppercase flex items-center gap-1.5 ${
                  item.visibility === "public" ? "text-teal-light" : "text-amber"
                }`}
              >
                {item.visibility === "public" ? (
                  <>Free · {item.type}</>
                ) : (
                  <>🔒 Subscriber · {item.type}</>
                )}
              </div>
              <div className="font-display text-[0.95rem] font-normal text-cream leading-[1.35]">
                {item.title}
              </div>
              <div className="font-label text-[0.58rem] text-cream-dim mt-auto">
                Ref: {item.episode}
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
