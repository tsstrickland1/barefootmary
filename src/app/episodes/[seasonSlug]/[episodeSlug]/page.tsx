import Link from "next/link";
import { sampleEpisodes, sampleArchiveItems } from "@/lib/sample-data";

export const metadata = {
  title: "Episode — Barefoot Mary",
};

export default async function EpisodePage({
  params,
}: {
  params: Promise<{ seasonSlug: string; episodeSlug: string }>;
}) {
  const { episodeSlug } = await params;
  const episode = sampleEpisodes.find((ep) => ep.slug === episodeSlug);

  if (!episode) {
    return (
      <section className="px-12 py-20 text-center">
        <h1 className="font-display text-3xl text-cream">Episode not found</h1>
      </section>
    );
  }

  const isFree = episode.visibility === "public";
  const relatedArchive = sampleArchiveItems.filter(
    (item) => item.episode === `Episode ${episode.number}`
  );

  return (
    <article className="px-12 py-20 max-w-4xl mx-auto max-md:px-6 max-md:py-12">
      {/* Breadcrumb */}
      <div className="font-label text-[0.62rem] tracking-[0.18em] uppercase text-cream-dim mb-8 flex items-center gap-2">
        <Link href="/episodes" className="text-cream-dim no-underline hover:text-cream transition-colors duration-200">
          Episodes
        </Link>
        <span className="text-amber">/</span>
        <Link href={`/episodes/${episode.seasonSlug}`} className="text-cream-dim no-underline hover:text-cream transition-colors duration-200">
          Season One
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

      {/* Audio player placeholder */}
      <div className="bg-bg-surface border border-border p-8 mb-12">
        <div className="font-label text-[0.65rem] font-medium tracking-[0.22em] uppercase text-amber mb-4">
          Listen
        </div>
        <div className="h-16 bg-bg-deep border border-border flex items-center justify-center">
          <span className="font-label text-[0.72rem] tracking-[0.1em] text-cream-dim">
            Audio player · Wavesurfer.js waveform will render here
          </span>
        </div>
        <div className="flex gap-3 mt-4">
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
      {relatedArchive.length > 0 && (
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
