import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EpisodePlayer } from "@/components/episodes/EpisodePlayer";

const ordinalWords = ["One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten"];

function numberToWord(n: number): string {
  return ordinalWords[n - 1] ?? String(n);
}

export default async function EpisodePage({
  params,
}: {
  params: Promise<{ seasonSlug: string; episodeSlug: string }>;
}) {
  const { seasonSlug, episodeSlug } = await params;
  const supabase = await createClient();

  const { data: season } = await supabase
    .from("seasons")
    .select("id, title, number, slug")
    .eq("slug", seasonSlug)
    .single();

  const { data: episode } = season
    ? await supabase
        .from("episodes")
        .select("*")
        .eq("slug", episodeSlug)
        .eq("season_id", season.id)
        .single()
    : { data: null };

  if (!season || !episode) notFound();

  const { data: relatedArchive } = await supabase
    .from("archive_items")
    .select("id, title, type, visibility")
    .eq("episode_id", episode.id);

  const isFree = episode.visibility === "public";
  const seasonLabel = `Season ${numberToWord(season.number)}`;

  return (
    <article className="px-12 py-20 max-w-4xl mx-auto max-md:px-6 max-md:py-12">
      {/* Breadcrumb */}
      <div className="font-label text-[0.62rem] tracking-[0.18em] uppercase text-cream-dim mb-8 flex items-center gap-2">
        <Link href="/episodes" className="text-cream-dim no-underline hover:text-cream transition-colors duration-200">
          Episodes
        </Link>
        <span className="text-amber">/</span>
        <Link href={`/episodes/${season.slug}`} className="text-cream-dim no-underline hover:text-cream transition-colors duration-200">
          {seasonLabel}
        </Link>
        <span className="text-amber">/</span>
        <span className="text-amber">Ep. {episode.number}</span>
      </div>

      {/* Episode header */}
      <div className="mb-8">
        <div className="flex items-center gap-3.5 mb-4">
          <span className="font-label text-[0.6rem] font-semibold tracking-[0.18em] uppercase text-amber bg-[rgba(196,154,60,0.08)] px-2 py-[3px]">
            Ep. {episode.number}
          </span>
          <span
            className={`font-label text-[0.58rem] font-semibold tracking-[0.14em] uppercase ${
              isFree ? "text-teal-light" : "text-amber"
            }`}
          >
            {isFree ? "Free" : "🔒 Subscriber"}
          </span>
          <span className="font-label text-[0.62rem] text-cream-dim tracking-[0.05em] ml-auto">
            {episode.duration}
          </span>
        </div>

        <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] font-light text-cream leading-[1.05] mb-6">
          {episode.title}
        </h1>

        <p className="text-[1rem] text-cream-dim leading-[1.85] font-body max-w-[640px]">
          {episode.description}
        </p>
      </div>

      {/* Audio player */}
      <EpisodePlayer
        title={episode.title}
        audioUrl={episode.audio_url}
        duration={episode.duration}
      />

      {/* Podcast links */}
      <div className="flex gap-3 mb-12">
        {["Apple Podcasts", "Spotify", "RSS"].map((p) => (
          <a
            key={p}
            href="#"
            className="font-label text-[0.6rem] font-medium tracking-[0.14em] uppercase text-cream-dim bg-[rgba(232,223,200,0.04)] border border-border px-3 py-1 no-underline transition-all duration-200 hover:text-cream"
          >
            {p}
          </a>
        ))}
      </div>

      {/* Show notes placeholder */}
      <div className="mb-12">
        <h2 className="font-label text-[0.67rem] font-semibold tracking-[0.24em] uppercase text-amber mb-4">
          Show Notes
        </h2>
        <div className="text-[0.9rem] text-cream-dim leading-[1.88] font-body border-t border-rule pt-6">
          <p className="italic">
            Show notes, transcript, and credits will appear here once the
            episode content is loaded from the CMS.
          </p>
        </div>
      </div>

      {/* Related archive items */}
      {relatedArchive && relatedArchive.length > 0 && (
        <div>
          <h2 className="font-label text-[0.67rem] font-semibold tracking-[0.24em] uppercase text-amber mb-4">
            Related Archive Items
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border border border-border">
            {relatedArchive.map((item) => (
              <Link
                key={item.id}
                href={`/archive/${item.id}`}
                className="bg-bg-surface p-5 flex flex-col gap-2 transition-colors duration-200 hover:bg-bg-raised no-underline text-inherit"
              >
                <div
                  className={`font-label text-[0.58rem] font-semibold tracking-[0.15em] uppercase ${
                    item.visibility === "public" ? "text-teal-light" : "text-amber"
                  }`}
                >
                  {item.visibility === "public"
                    ? `Free · ${item.type}`
                    : `🔒 Subscriber · ${item.type}`}
                </div>
                <div className="font-display text-[0.95rem] text-cream leading-[1.35]">
                  {item.title}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
