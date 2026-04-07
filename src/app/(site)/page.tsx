import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EpisodeCard } from "@/components/episodes/EpisodeCard";
import { SubscribeButton } from "@/components/subscribe/SubscribeButton";
import { sampleArticles, sampleArchiveItems } from "@/lib/sample-data";
import { createClient } from "@/lib/supabase/server";
import type { Episode, Season } from "@/types/database";

const ordinalWords = ["One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten"];

function numberToWord(n: number): string {
  return ordinalWords[n - 1] ?? String(n);
}

export default async function HomePage() {
  const supabase = await createClient();

  const { data: currentSeason } = await supabase
    .from("seasons")
    .select("*")
    .eq("status", "airing")
    .order("number", { ascending: false })
    .limit(1)
    .maybeSingle() as { data: Season | null };

  const { data: dbEpisodes } = currentSeason
    ? await supabase
        .from("episodes")
        .select("*")
        .eq("season_id", currentSeason.id)
        .order("number", { ascending: true })
    : { data: null };

  const episodes = (dbEpisodes as Episode[] | null ?? []).map((ep) => ({
    number: ep.number,
    title: ep.title,
    description: ep.description,
    duration: ep.duration,
    visibility: ep.visibility,
    slug: ep.slug,
    seasonSlug: currentSeason!.slug,
    image_url: ep.image_url,
  }));

  const featured = sampleArticles.find((a) => a.featured);
  const sidebar = sampleArticles.filter((a) => !a.featured);

  return (
    <>
      {/* ── Hero (with current season) ── */}
      <header className="lg:min-h-[88vh] md:max-lg:min-h-[65vh] max-md:min-h-[60vh] flex flex-col justify-end px-12 pb-20 relative border-b border-rule overflow-hidden max-md:px-6 max-md:pt-16 md:mt-[73px]">
        <div className="absolute top-[-8%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse,rgba(196,154,60,0.05)_0%,transparent_68%)] pointer-events-none" />

        {/* Left-edge scrim — desktop/tablet only, fades text side of image */}
        <div className="absolute inset-0 pointer-events-none max-md:hidden z-[1] bg-[linear-gradient(to_right,rgba(14,12,10,0.65)_0%,transparent_60%)]" />

        {/* Season image — full-bleed on desktop/tablet, top band on mobile */}
        {currentSeason?.image_url && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: -1 }}>
            <img
              src={currentSeason.image_url}
              alt={currentSeason.title}
              className="w-full h-full object-cover object-center"
              draggable={false}
            />
          </div>
        )}

        {/* Mobile image fade — blends image band into dark background */}
        {currentSeason?.image_url && (
          <div className="absolute inset-0 pointer-events-none md:hidden z-[1] bg-[linear-gradient(to_bottom,transparent_40%,#0e0c0a_100%)]" />
        )}

        {/* Season numeral watermark */}
        {currentSeason && (
          <span className="absolute right-[-0.08em] top-[-0.2em] font-display text-[20rem] font-light text-[rgba(196,154,60,0.035)] leading-none pointer-events-none select-none max-md:text-[10rem] z-[2]">
            {currentSeason.numeral}
          </span>
        )}

        {/* Content — positioned above gradient overlays via z-index */}
        <div className="relative z-[2]">
        {currentSeason ? (
          <>
            <div className="font-label text-[0.68rem] font-medium tracking-[0.28em] uppercase text-amber mb-5">
              Now Airing · Season {numberToWord(currentSeason.number)}
            </div>
            <h1 className="font-display text-[clamp(3rem,7vw,7rem)] font-light leading-[0.92] text-cream tracking-[-0.015em] mb-5 max-w-[700px] max-md:text-[2.5rem]">
              {currentSeason.title}
            </h1>
            {currentSeason.subtitle && (
              <div className="font-display text-[1.1rem] font-light italic text-teal-light mb-8 max-w-[560px]">
                {currentSeason.subtitle}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="font-label text-[0.68rem] font-medium tracking-[0.28em] uppercase text-amber mb-5">
              Investigative History · Pensacola &amp; the Gulf Coast
            </div>
            <h1 className="font-display text-[clamp(4rem,9.5vw,9rem)] font-light leading-[0.88] text-cream tracking-[-0.015em] mb-9 max-w-[1000px] max-md:text-[3.5rem]">
              Barefoot
              <br />
              <em className="italic text-amber">Mary</em>
            </h1>
            <p className="font-body text-[0.95rem] font-light italic text-cream-dim max-w-[380px] leading-[1.6] mb-8">
              Half-remembered events, overlooked histories, and the persistent
              local legends that shape how communities understand themselves.
            </p>
          </>
        )}

        <div className="flex items-center gap-10 flex-wrap">
          {currentSeason && episodes.length > 0 && (
            <Link
              href={`/episodes/${currentSeason.slug}/${episodes[0].slug}`}
              className="flex items-center gap-5 no-underline px-7 py-[0.9rem] border border-amber-dim text-cream transition-all duration-[250ms] shrink-0 hover:bg-cream-faint hover:border-amber"
            >
              <div className="w-[38px] h-[38px] border-[1.5px] border-amber rounded-full flex items-center justify-center shrink-0">
                <span className="w-0 h-0 border-solid border-y-[5px] border-y-transparent border-l-[9px] border-l-amber ml-[2px]" />
              </div>
              <div className="flex flex-col gap-[2px]">
                <span className="font-label text-[0.6rem] tracking-[0.22em] uppercase text-amber font-medium">
                  Latest Episode
                </span>
                <span className="font-display text-[1.05rem] font-normal text-cream leading-[1.2]">
                  {episodes[0].title}
                </span>
              </div>
            </Link>
          )}

          <div className="flex gap-3 flex-wrap mt-1">
            {["Apple Podcasts", "Spotify", "RSS Feed"].map((platform) => (
              <a
                key={platform}
                href="#"
                className="font-label text-[0.63rem] font-medium tracking-[0.14em] uppercase text-cream-dim bg-[rgba(232,223,200,0.04)] border border-border px-3.5 py-1.5 no-underline transition-all duration-200 hover:text-cream hover:bg-[rgba(232,223,200,0.08)]"
              >
                {platform}
              </a>
            ))}
          </div>
        </div>
        </div>
      </header>

      {/* ── Episodes ── */}
      {currentSeason && episodes.length > 0 && (
        <section className="px-12 py-20 border-b border-border max-md:px-6 max-md:py-12">
          <SectionHeader
            label={`Season ${numberToWord(currentSeason.number)} · ${currentSeason.title}`}
            title="Episodes"
            linkText="All Episodes →"
            linkHref={`/episodes/${currentSeason.slug}`}
          />

          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-px bg-border border border-border">
            {episodes.slice(0, 6).map((ep) => (
              <EpisodeCard key={ep.slug} ep={ep} />
            ))}
          </div>
        </section>
      )}

      {/* ── Field Notes ── */}
      <section className="px-12 py-20 border-b border-border max-md:px-6 max-md:py-12">
        <SectionHeader
          label="Research & Writing"
          title="Field Notes"
          linkText="All Articles →"
          linkHref="/field-notes"
        />

        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-px bg-border border border-border">
          {featured && (
            <Link
              href={`/field-notes/${featured.slug}`}
              className="bg-bg-surface flex flex-col transition-colors duration-200 cursor-pointer no-underline text-inherit hover:bg-bg-raised"
            >
              {featured.image_url && (
                <div className="h-52 overflow-hidden">
                  <img
                    src={featured.image_url}
                    alt={featured.title}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </div>
              )}
              <div className="p-10 flex flex-col gap-4 flex-1">
                <div className="font-label text-[0.6rem] font-semibold tracking-[0.16em] uppercase text-teal-light">
                  {featured.tag}
                </div>
                <div className="font-display text-[1.55rem] font-normal text-cream leading-[1.2]">
                  {featured.title}
                </div>
                <p className="text-[0.84rem] text-cream-dim leading-[1.75] font-body">
                  {featured.excerpt}
                </p>
                <div className="font-label text-[0.62rem] tracking-[0.1em] text-cream-dim mt-auto">
                  {featured.byline}
                </div>
              </div>
            </Link>
          )}

          <div className="bg-bg-surface flex flex-col">
            {sidebar.map((article, i) => (
              <Link
                key={article.slug}
                href={`/field-notes/${article.slug}`}
                className={`p-6 flex flex-col gap-2 cursor-pointer transition-colors duration-200 no-underline text-inherit hover:bg-bg-raised ${
                  i < sidebar.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div
                  className={`font-label text-[0.6rem] font-semibold tracking-[0.16em] uppercase flex items-center gap-1.5 ${
                    article.tagType === "free"
                      ? "text-teal-light"
                      : "text-amber"
                  }`}
                >
                  {article.tagType === "locked" && (
                    <span className="inline-flex items-center justify-center w-[13px] h-[13px] border border-amber-dim text-[8px] leading-none rounded-sm">
                      🔒
                    </span>
                  )}
                  {article.tag}
                </div>
                <div className="font-display text-[1.05rem] font-normal text-cream leading-[1.25]">
                  {article.title}
                </div>
                <div className="font-label text-[0.62rem] tracking-[0.1em] text-cream-dim">
                  {article.byline}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── The Archive ── */}
      <section className="px-12 py-20 border-b border-border max-md:px-6 max-md:py-12">
        <SectionHeader
          label="Primary Sources"
          title="The Archive"
          linkText="Browse All →"
          linkHref="/archive"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start mb-12">
          <p className="font-display text-[1.85rem] font-light text-cream leading-[1.1] italic">
            Documents, maps, photographs, and recordings gathered in the course
            of investigation.
          </p>
          <div>
            <p className="text-[0.88rem] text-cream-dim leading-[1.88] font-body italic">
              We believe in showing our work. The Archive holds the primary
              materials that drive each episode—survey plans, oral history
              recordings, newspaper clippings, and annotated photographs.
              Subscriber access unlocks full documents and audio; all users can
              browse the catalog.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
          {sampleArchiveItems.map((item) => (
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
      </section>

      {/* ── Share Your Story ── */}
      <section className="px-12 py-20 border-b border-border max-md:px-6 max-md:py-12">
        <SectionHeader
          label="Oral History Contribution"
          title="Share Your Story"
        />

        <div className="bg-bg-surface border border-border p-14 grid grid-cols-1 md:grid-cols-2 gap-16 items-start max-md:p-6">
          <div>
            <div className="font-display text-[2.6rem] font-light italic text-cream leading-[1.1] mb-3.5">
              Have you heard the stories?
            </div>
            <p className="text-[0.87rem] text-cream-dim leading-[1.88] mb-8 font-body">
              Barefoot Mary is built on the belief that the best history lives
              in living memory. If you have a story about Pensacola&apos;s
              tunnels—or any Gulf Coast legend—we want to hear it.
            </p>
            <Link
              href="/share-your-story"
              className="inline-block bg-amber text-bg-deep border-none py-3.5 px-8 font-label text-[0.72rem] font-semibold tracking-[0.18em] uppercase cursor-pointer transition-colors duration-200 text-center no-underline hover:bg-amber-light"
            >
              Share Your Story →
            </Link>
          </div>

          <div className="flex flex-col items-center justify-center gap-8 p-12 border border-border bg-bg-deep text-center min-h-[340px]">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <span className="absolute w-20 h-20 rounded-full border border-amber-dim opacity-50" />
              <span className="absolute w-[54px] h-[54px] rounded-full border border-amber-dim opacity-70" />
              <div className="w-9 h-9 rounded-full bg-[rgba(196,154,60,0.08)] flex items-center justify-center border border-amber-dim relative z-10">
                <div className="w-3.5 h-5 bg-amber rounded-t-full relative">
                  <span className="absolute bottom-[-7px] left-1/2 -translate-x-1/2 w-px h-[7px] bg-amber" />
                </div>
              </div>
            </div>
            <p className="font-display text-[1.05rem] italic text-cream-dim leading-[1.55] max-w-[200px]">
              &ldquo;Every legend begins as someone&apos;s story.&rdquo;
            </p>
            <div className="font-label text-[0.6rem] tracking-[0.18em] uppercase text-[rgba(158,146,120,0.5)]">
              Stories received: 47
            </div>
          </div>
        </div>
      </section>

      {/* ── Subscribe CTA ── */}
      <section className="p-0 border-none">
        <div className="bg-bg-surface py-24 px-12 text-center flex flex-col items-center gap-6 relative overflow-hidden max-md:px-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(196,154,60,0.04)_0%,transparent_60%)] pointer-events-none" />

          <div className="font-label text-[0.65rem] font-medium tracking-[0.28em] uppercase text-amber">
            Support the Work
          </div>
          <h2 className="font-display text-[clamp(2.5rem,6vw,4.75rem)] font-light text-cream leading-[1.02] max-w-[680px]">
            Join the <em className="italic text-amber">Descent</em>
          </h2>
          <p className="text-[0.9rem] text-cream-dim max-w-[460px] leading-[1.78] font-body italic">
            Subscriber support makes investigative history possible. Access
            gated episodes, deep-dive field notes, primary source documents,
            and extended oral history recordings.
          </p>

          <div className="flex flex-wrap gap-px mt-8 bg-border border border-border max-w-2xl w-full">
            {[
              {
                label: "Descender",
                price: "$8",
                plan: "descender" as const,
                features: [
                  "All episodes, all seasons",
                  "Complete Field Notes archive",
                  "Full Archive access",
                  "Bonus content & research notes",
                  "Early access to new seasons",
                ],
                cta: "Subscribe Now",
                featured: true,
              },
              {
                label: "Patron",
                price: "$25",
                plan: "patron" as const,
                features: [
                  "Everything in Descender",
                  "Credit in episode roll",
                  "Quarterly SPOT session recordings",
                  "Direct line to the host",
                ],
                cta: "Become a Patron",
                featured: false,
              },
            ].map((tier) => (
              <div
                key={tier.label}
                className={`p-8 flex flex-col gap-3 min-w-[240px] text-left flex-1 ${
                  tier.featured
                    ? "bg-bg-raised border-t-2 border-t-amber"
                    : "bg-bg-deep"
                }`}
              >
                <div className="font-label text-[0.62rem] font-semibold tracking-[0.22em] uppercase text-amber">
                  {tier.label}
                </div>
                <div className="font-display text-[2.5rem] font-light text-cream leading-none">
                  {tier.price}{" "}
                  <span className="text-[0.95rem] text-cream-dim font-label font-normal tracking-[0.08em]">
                    / month
                  </span>
                </div>
                <ul className="list-none flex flex-col gap-1.5 my-2">
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      className="font-label text-[0.73rem] text-cream-dim flex items-center gap-2"
                    >
                      <span className="w-[5px] h-px bg-amber shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <SubscribeButton plan={tier.plan} label={tier.cta} featured={tier.featured} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
