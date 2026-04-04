import { SectionHeader } from "@/components/ui/SectionHeader";
import { EpisodeCard } from "@/components/episodes/EpisodeCard";
import { sampleEpisodes } from "@/lib/sample-data";

export const metadata = {
  title: "Season One: Tunnel Vision — Barefoot Mary",
  description: "All episodes from Season One of Barefoot Mary.",
};

export default async function SeasonPage({
  params,
}: {
  params: Promise<{ seasonSlug: string }>;
}) {
  const { seasonSlug } = await params;
  const episodes = sampleEpisodes.filter((ep) => ep.seasonSlug === seasonSlug);

  return (
    <>
      {/* Season banner */}
      <section className="px-12 py-20 border-b border-border max-md:px-6 max-md:py-12">
        <div className="bg-bg-surface border border-border p-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative overflow-hidden max-md:p-6">
          <span className="absolute right-[-0.08em] top-[-0.2em] font-display text-[20rem] font-light text-[rgba(196,154,60,0.035)] leading-none pointer-events-none select-none">
            I
          </span>

          <div>
            <div className="font-label text-[0.65rem] font-semibold tracking-[0.22em] uppercase text-teal-light mb-3">
              Season One
            </div>
            <div className="font-display text-[3.5rem] font-light text-cream leading-none mb-3 max-md:text-[2.5rem]">
              Tunnel Vision
            </div>
            <div className="font-display text-[1.1rem] font-light italic text-teal-light mb-6">
              A descent through Pensacola&apos;s hidden underground
            </div>
            <p className="text-[0.88rem] text-cream-dim leading-[1.85] font-body max-w-[460px]">
              Stories of secret passageways surface again and again in local
              memory—beneath forts, waterfront homes, and civic buildings.
              Tunnel Vision follows these legends site by site.
            </p>
          </div>

          <div className="flex flex-col">
            {[
              { num: "9", label: "Episodes in the descent" },
              { num: "7", label: "Sites investigated" },
              { num: "~42", label: "Minutes per episode" },
            ].map((stat, i, arr) => (
              <div
                key={stat.label}
                className={`flex items-baseline gap-5 py-5 ${
                  i < arr.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="font-display text-[3rem] font-light text-amber leading-none min-w-[72px]">
                  {stat.num}
                </div>
                <div className="font-label text-[0.78rem] tracking-[0.1em] uppercase text-cream-dim">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Episode list */}
      <section className="px-12 py-20 max-md:px-6 max-md:py-12">
        <SectionHeader
          label="Season One · Tunnel Vision"
          title="Episodes"
          linkText="All Seasons →"
          linkHref="/episodes"
        />

        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-px bg-border border border-border">
          {episodes.map((ep) => (
            <EpisodeCard key={ep.slug} ep={ep} />
          ))}
        </div>
      </section>
    </>
  );
}
