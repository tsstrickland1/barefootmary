import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { createClient } from "@/lib/supabase/server";
import type { Season } from "@/types/database";

const ordinalWords = ["One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten"];

function numberToWord(n: number): string {
  return ordinalWords[n - 1] ?? String(n);
}

function statusLabel(status: Season["status"]): string {
  if (status === "airing") return "Now Airing";
  if (status === "upcoming") return "Upcoming";
  return "Complete";
}

export const metadata = {
  title: "Episodes — Barefoot Mary",
  description: "Browse all seasons and episodes of Barefoot Mary.",
};

export default async function EpisodesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("seasons")
    .select("*")
    .order("number", { ascending: true });
  const seasons: Season[] = data ?? [];

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
                Season {numberToWord(season.number)}
              </div>
              <div className="font-display text-[2.5rem] font-light text-cream leading-none mb-2">
                {season.title}
              </div>
              <div className="font-display text-[1rem] font-light italic text-teal-light">
                {season.subtitle}
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="font-label text-[0.62rem] font-semibold tracking-[0.18em] uppercase text-amber bg-[rgba(196,154,60,0.08)] px-3 py-1.5">
                {statusLabel(season.status)}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
