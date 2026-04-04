import Link from "next/link";
import { notFound } from "next/navigation";
import { sampleArchiveItems } from "@/lib/sample-data";
import { ArchiveItemViewer } from "@/components/archive/ArchiveItemViewer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = sampleArchiveItems.find((i) => i.id === id);
  return {
    title: item ? `${item.title} — The Archive — Barefoot Mary` : "Archive — Barefoot Mary",
  };
}

export default async function ArchiveItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = sampleArchiveItems.find((i) => i.id === id);

  if (!item) notFound();

  const isSubscriberOnly = item.visibility !== "public";

  return (
    <article className="px-12 py-20 max-w-5xl mx-auto max-md:px-6 max-md:py-12">
      {/* Breadcrumb */}
      <div className="font-label text-[0.62rem] tracking-[0.18em] uppercase text-cream-dim mb-8 flex items-center gap-2">
        <Link
          href="/archive"
          className="text-cream-dim no-underline hover:text-cream transition-colors duration-200"
        >
          The Archive
        </Link>
        <span className="text-amber">/</span>
        <span className="text-amber">{item.type}</span>
      </div>

      {/* Item header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="font-label text-[0.6rem] font-semibold tracking-[0.18em] uppercase text-amber bg-[rgba(196,154,60,0.08)] px-2 py-[3px]">
            {item.type}
          </span>
          <span
            className={`font-label text-[0.58rem] font-semibold tracking-[0.14em] uppercase ${
              item.visibility === "public" ? "text-teal-light" : "text-amber"
            }`}
          >
            {item.visibility === "public" ? "Free" : "🔒 Subscriber"}
          </span>
          <span className="font-label text-[0.62rem] text-cream-dim tracking-[0.05em] ml-auto">
            {item.episode}
          </span>
        </div>

        <h1 className="font-display text-[clamp(1.6rem,3.5vw,2.8rem)] font-light text-cream leading-[1.1] mb-5">
          {item.title}
        </h1>

        {item.description && (
          <p className="text-[0.9rem] text-cream-dim leading-[1.85] font-body max-w-[640px]">
            {item.description}
          </p>
        )}
      </div>

      {/* Access gate */}
      {isSubscriberOnly ? (
        <div className="bg-bg-surface border border-border p-12 text-center">
          <div className="font-label text-[0.6rem] font-semibold tracking-[0.22em] uppercase text-amber mb-4">
            Subscriber Access Required
          </div>
          <h2 className="font-display text-[1.8rem] font-light text-cream mb-3 leading-[1.1]">
            This document is for subscribers
          </h2>
          <p className="text-[0.88rem] text-cream-dim mb-8 max-w-[400px] mx-auto leading-[1.78] font-body italic">
            Subscribe to access the full Archive—original documents, photographs,
            oral history recordings, and annotated transcripts.
          </p>
          <Link
            href="/subscribe"
            className="inline-block bg-amber text-bg-deep py-3 px-10 font-label text-[0.72rem] font-semibold tracking-[0.18em] uppercase no-underline transition-colors duration-200 hover:bg-amber-light"
          >
            Subscribe Now
          </Link>
        </div>
      ) : (
        <ArchiveItemViewer item={item} />
      )}

      {/* Back link */}
      <div className="mt-10 pt-8 border-t border-rule">
        <Link
          href="/archive"
          className="font-label text-[0.65rem] tracking-[0.16em] uppercase text-cream-dim no-underline hover:text-cream transition-colors duration-200 flex items-center gap-2"
        >
          <span>←</span>
          <span>Back to the Archive</span>
        </Link>
      </div>
    </article>
  );
}
