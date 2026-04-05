"use client";

import Link from "next/link";
import { useState } from "react";

type ArchiveItem = {
  id: string;
  type: string;
  title: string;
  visibility: "public" | "subscriber" | "patron";
  season_id: string | null;
  episodes: { title: string; number: number } | null;
};

type Season = {
  id: string;
  title: string;
  numeral: string;
};

const typeFilters = ["All", "PDF", "Image", "Audio", "Transcript"] as const;

export function ArchiveGrid({
  items,
  seasons,
}: {
  items: ArchiveItem[];
  seasons: Season[];
}) {
  const [activeType, setActiveType] = useState<string>("All");
  const [activeSeason, setActiveSeason] = useState<string>("All");
  const [query, setQuery] = useState("");

  const filtered = items.filter((item) => {
    const matchesType =
      activeType === "All" ||
      item.type.toLowerCase() === activeType.toLowerCase();
    const matchesSeason =
      activeSeason === "All" || item.season_id === activeSeason;
    const matchesQuery = item.title
      .toLowerCase()
      .includes(query.toLowerCase());
    return matchesType && matchesSeason && matchesQuery;
  });

  return (
    <>
      {/* Filters */}
      <div className="flex flex-col gap-4 mb-8">
        {/* Season filter */}
        {seasons.length > 0 && (
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-label text-[0.58rem] tracking-[0.14em] uppercase text-cream-dim">
              Season
            </span>
            <button
              onClick={() => setActiveSeason("All")}
              className={`font-label text-[0.62rem] font-medium tracking-[0.14em] uppercase px-4 py-2 border cursor-pointer transition-all duration-200 ${
                activeSeason === "All"
                  ? "text-bg-deep bg-amber border-amber"
                  : "text-cream-dim bg-transparent border-border hover:border-amber-dim hover:text-cream"
              }`}
            >
              All
            </button>
            {seasons.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSeason(s.id)}
                className={`font-label text-[0.62rem] font-medium tracking-[0.14em] uppercase px-4 py-2 border cursor-pointer transition-all duration-200 ${
                  activeSeason === s.id
                    ? "text-bg-deep bg-amber border-amber"
                    : "text-cream-dim bg-transparent border-border hover:border-amber-dim hover:text-cream"
                }`}
              >
                Season {s.numeral}
              </button>
            ))}
          </div>
        )}

        {/* Type filter + search */}
        <div className="flex items-center gap-4 flex-wrap">
          {typeFilters.map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`font-label text-[0.62rem] font-medium tracking-[0.14em] uppercase px-4 py-2 border cursor-pointer transition-all duration-200 ${
                activeType === t
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
              {item.episodes && (
                <div className="font-label text-[0.58rem] text-cream-dim mt-auto">
                  Ep. {item.episodes.number} — {item.episodes.title}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
