import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";

const seasons = [
  {
    slug: "season-1",
    number: "One",
    numeral: "I",
    title: "Tunnel Vision",
    subtitle: "A descent through Pensacola's hidden underground",
    episodes: 9,
    status: "Now Airing",
  },
];

export const metadata = {
  title: "Episodes — Barefoot Mary",
  description: "Browse all seasons and episodes of Barefoot Mary.",
};

export default function EpisodesPage() {
  return (
    <section className="px-12 py-20 max-md:px-6 max-md:py-12">
      <SectionHeader label="Browse" title="All Seasons" />

      <div className="flex flex-col gap-4">
        {seasons.map((season) => (
          <Link
            key={season.slug}
            href={`/episodes/${season.slug}`}
            className="bg-bg-surface border border-border p-12 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center relative overflow-hidden no-underline text-inherit transition-colors duration-200 hover:bg-bg-raised max-md:p-6"
          >
            <span className="absolute right-[-0.08em] top-[-0.2em] font-display text-[16rem] font-light text-[rgba(196,154,60,0.035)] leading-none pointer-events-none select-none">
              {season.numeral}
            </span>

            <div>
              <div className="font-label text-[0.65rem] font-semibold tracking-[0.22em] uppercase text-teal-light mb-2">
                Season {season.number}
              </div>
              <div className="font-display text-[2.5rem] font-light text-cream leading-none mb-2">
                {season.title}
              </div>
              <div className="font-display text-[1rem] font-light italic text-teal-light">
                {season.subtitle}
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="font-label text-[0.72rem] tracking-[0.1em] uppercase text-cream-dim">
                {season.episodes} Episodes
              </div>
              <div className="font-label text-[0.62rem] font-semibold tracking-[0.18em] uppercase text-amber bg-[rgba(196,154,60,0.08)] px-3 py-1.5">
                {season.status}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
