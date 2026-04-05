"use client";

import Link from "next/link";
import { useState } from "react";

type Article = {
  slug: string;
  title: string;
  excerpt: string | null;
  tag: string;
  visibility: "public" | "subscriber" | "patron";
  author: string;
  published_at: string | null;
  image_url: string | null;
  season_id: string | null;
};

type Season = {
  id: string;
  title: string;
  numeral: string;
};

const tagFilters = [
  "All",
  "Essay",
  "Primary Source",
  "Interview",
  "Deep Dive",
  "Analysis",
];

function tagMatches(article: Article, activeTag: string): boolean {
  if (activeTag === "All") return true;
  return article.tag.toLowerCase().replace("-", " ").includes(activeTag.toLowerCase());
}

function formatByline(article: Article): string {
  const parts: string[] = [article.author];
  if (article.published_at) {
    const date = new Date(article.published_at);
    parts.push(
      date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    );
  }
  return parts.join(" · ");
}

export function FieldNotesGrid({
  articles,
  seasons,
}: {
  articles: Article[];
  seasons: Season[];
}) {
  const [activeTag, setActiveTag] = useState("All");
  const [activeSeason, setActiveSeason] = useState("All");

  const filtered = articles.filter(
    (a) =>
      tagMatches(a, activeTag) &&
      (activeSeason === "All" || a.season_id === activeSeason)
  );

  return (
    <>
      {/* Season filter */}
      {seasons.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap mb-4">
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

      {/* Tag filter bar */}
      <div className="flex gap-3 flex-wrap mb-10">
        {tagFilters.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`font-label text-[0.62rem] font-medium tracking-[0.14em] uppercase px-4 py-2 border cursor-pointer transition-all duration-200 ${
              activeTag === tag
                ? "text-bg-deep bg-amber border-amber"
                : "text-cream-dim bg-transparent border-border hover:border-amber-dim hover:text-cream"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Articles grid */}
      {filtered.length === 0 ? (
        <div className="border border-border p-16 text-center">
          <p className="font-label text-[0.72rem] tracking-[0.1em] uppercase text-cream-dim">
            No articles in this category yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
          {filtered.map((article) => (
            <Link
              key={article.slug}
              href={`/field-notes/${article.slug}`}
              className="bg-bg-surface flex flex-col transition-colors duration-200 no-underline text-inherit hover:bg-bg-raised"
            >
              {/* Featured image */}
              {article.image_url && (
                <div className="h-40 overflow-hidden">
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </div>
              )}
              <div className="p-8 flex flex-col gap-3 flex-1">
                <div
                  className={`font-label text-[0.6rem] font-semibold tracking-[0.16em] uppercase flex items-center gap-1.5 ${
                    article.visibility === "public"
                      ? "text-teal-light"
                      : "text-amber"
                  }`}
                >
                  {article.visibility !== "public" && (
                    <span className="inline-flex items-center justify-center w-[13px] h-[13px] border border-amber-dim text-[8px] leading-none rounded-sm">
                      🔒
                    </span>
                  )}
                  {article.tag.replace(/-/g, " ")}
                </div>
                <div className="font-display text-[1.25rem] font-normal text-cream leading-[1.2]">
                  {article.title}
                </div>
                {article.excerpt && (
                  <p className="text-[0.82rem] text-cream-dim leading-[1.75] font-body line-clamp-3">
                    {article.excerpt}
                  </p>
                )}
                <div className="font-label text-[0.62rem] tracking-[0.1em] text-cream-dim mt-auto pt-2">
                  {formatByline(article)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
