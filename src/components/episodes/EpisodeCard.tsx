import Link from "next/link";
import { Waveform } from "@/components/ui/Waveform";

export interface EpisodeCardData {
  number: number;
  title: string;
  description: string;
  duration: string;
  visibility: "public" | "subscriber" | "patron";
  slug: string;
  seasonSlug: string;
}

export function EpisodeCard({ ep }: { ep: EpisodeCardData }) {
  const isFree = ep.visibility === "public";

  return (
    <Link
      href={`/episodes/${ep.seasonSlug}/${ep.slug}`}
      className="bg-bg-surface p-7 flex flex-col gap-3 transition-colors duration-200 cursor-pointer no-underline text-inherit hover:bg-bg-raised"
    >
      <div className="flex items-center gap-3.5">
        <span className="font-label text-[0.6rem] font-semibold tracking-[0.18em] uppercase text-amber bg-[rgba(196,154,60,0.08)] px-2 py-[3px]">
          Ep. {ep.number}
        </span>
        <span
          className={`font-label text-[0.58rem] font-semibold tracking-[0.14em] uppercase ${
            isFree ? "text-teal-light" : "text-amber"
          }`}
        >
          {isFree ? "Free" : "🔒 Subscriber"}
        </span>
        <span className="font-label text-[0.62rem] text-cream-dim tracking-[0.05em] ml-auto">
          {ep.duration}
        </span>
      </div>

      <div className="font-display text-[1.4rem] font-normal text-cream leading-[1.15]">
        {ep.title}
      </div>

      <p className="text-[0.82rem] text-cream-dim leading-[1.68] font-body">
        {ep.description}
      </p>

      <Waveform />
    </Link>
  );
}
