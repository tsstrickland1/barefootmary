import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EpisodeCard } from "@/components/episodes/EpisodeCard";
import { createClient } from "@/lib/supabase/server";
import type { Episode } from "@/types/database";

const ordinalWords = ["One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten"];

function numberToWord(n: number): string {
  return ordinalWords[n - 1] ?? String(n);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ seasonSlug: string }>;
}): Promise<Metadata> {
  const { seasonSlug } = await params;
  const supabase = await createClient();
  const { data: season } = await supabase
    .from("seasons")
    .select("title, number")
    .eq("slug", seasonSlug)
    .single();

  if (!season) return { title: "Season — Barefoot Mary" };

  return {
    title: `Season ${numberToWord(season.number)}: ${season.title} — Barefoot Mary`,
    description: `All episodes from Season ${numberToWord(season.number)} of Barefoot Mary.`,
  };
}

export default async function SeasonPage({
  params,
}: {
  params: Promise<{ seasonSlug: string }>;
}) {
  const { seasonSlug } = await params;
  const supabase = await createClient();

  const { data: season } = await supabase
    .from("seasons")
    .select("*")
    .eq("slug", seasonSlug)
    .single();

  if (!season) notFound();

  const { data: dbEpisodes } = await supabase
    .from("episodes")
    .select("*")
    .eq("season_id", season.id)
    .order("number", { ascending: true });

  const episodes = (dbEpisodes ?? []).map((ep: Episode) => ({
    number: ep.number,
    title: ep.title,
    description: ep.description,
    duration: ep.duration,
    visibility: ep.visibility,
    slug: ep.slug,
    seasonSlug: season.slug,
    image_url: ep.image_url,
  }));

  const seasonLabel = `Season ${numberToWord(season.number)}`;

  return (
    <>
      {/* Season banner */}
      <section className="px-12 py-20 border-b border-border max-md:px-6 max-md:py-12">
        <div className="bg-bg-surface border border-border p-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative overflow-hidden max-md:p-6">
          <span className="absolute right-[-0.08em] top-[-0.2em] font-display text-[20rem] font-light text-[rgba(196,154,60,0.035)] leading-none pointer-events-none select-none">
            {season.numeral}
          </span>

          <div>
            <div className="font-label text-[0.65rem] font-semibold tracking-[0.22em] uppercase text-teal-light mb-3">
              {seasonLabel}
            </div>
            <div className="font-display text-[3.5rem] font-light text-cream leading-none mb-3 max-md:text-[2.5rem]">
              {season.title}
            </div>
            <div className="font-display text-[1.1rem] font-light italic text-teal-light mb-6">
              {season.subtitle}
            </div>
            {season.description && (
              <p className="text-[0.88rem] text-cream-dim leading-[1.85] font-body max-w-[460px]">
                {season.description}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex items-baseline gap-5 py-5">
              <div className="font-display text-[3rem] font-light text-amber leading-none min-w-[72px]">
                {episodes.length}
              </div>
              <div className="font-label text-[0.78rem] tracking-[0.1em] uppercase text-cream-dim">
                {episodes.length === 1 ? "Episode" : "Episodes"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Episode list */}
      <section className="px-12 py-20 max-md:px-6 max-md:py-12">
        <SectionHeader
          label={`${seasonLabel} · ${season.title}`}
          title="Episodes"
          linkText="All Seasons →"
          linkHref="/episodes"
        />

        {episodes.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-px bg-border border border-border">
            {episodes.map((ep) => (
              <EpisodeCard key={ep.slug} ep={ep} />
            ))}
          </div>
        ) : (
          <p className="font-body text-[0.9rem] text-cream-dim italic">
            No episodes published yet.
          </p>
        )}
      </section>
    </>
  );
}
