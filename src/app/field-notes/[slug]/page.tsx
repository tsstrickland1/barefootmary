import Link from "next/link";
import { sampleArticles } from "@/lib/sample-data";

export const metadata = {
  title: "Field Note — Barefoot Mary",
};

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = sampleArticles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <section className="px-12 py-20 text-center">
        <h1 className="font-display text-3xl text-cream">Article not found</h1>
      </section>
    );
  }

  return (
    <article className="px-12 py-20 max-w-3xl mx-auto max-md:px-6 max-md:py-12">
      {/* Breadcrumb */}
      <div className="font-label text-[0.62rem] tracking-[0.18em] uppercase text-cream-dim mb-8 flex items-center gap-2">
        <Link href="/field-notes" className="text-cream-dim no-underline hover:text-cream transition-colors duration-200">
          Field Notes
        </Link>
        <span className="text-amber">/</span>
        <span className="text-amber">{article.tag}</span>
      </div>

      <div
        className={`font-label text-[0.6rem] font-semibold tracking-[0.16em] uppercase mb-4 flex items-center gap-1.5 ${
          article.tagType === "free" ? "text-teal-light" : "text-amber"
        }`}
      >
        {article.tagType === "locked" && (
          <span className="inline-flex items-center justify-center w-[13px] h-[13px] border border-amber-dim text-[8px] leading-none rounded-sm">
            🔒
          </span>
        )}
        {article.tag}
      </div>

      <h1 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-light text-cream leading-[1.08] mb-6">
        {article.title}
      </h1>

      <div className="font-label text-[0.72rem] tracking-[0.1em] text-cream-dim mb-10 pb-6 border-b border-rule">
        {article.byline}
      </div>

      {/* Article body placeholder */}
      <div className="text-[1rem] text-cream-dim leading-[2] font-body space-y-6">
        {article.excerpt ? (
          <p className="text-[1.05rem] text-cream leading-[1.88] italic font-light">
            {article.excerpt}
          </p>
        ) : null}
        <p>
          Full article content will be rendered here from the TipTap JSON
          stored in Supabase. The block editor supports rich text, embedded
          images, pull quotes, audio clips, and footnotes.
        </p>
        {article.tagType === "locked" && (
          <div className="bg-bg-surface border border-border p-8 text-center my-8">
            <div className="font-display text-[1.5rem] font-light text-cream mb-2">
              This is subscriber-only content
            </div>
            <p className="text-[0.88rem] text-cream-dim mb-6">
              Subscribe to access the full article and all Field Notes.
            </p>
            <Link
              href="/subscribe"
              className="inline-block bg-amber text-bg-deep py-3 px-8 font-label text-[0.72rem] font-semibold tracking-[0.18em] uppercase no-underline transition-colors duration-200 hover:bg-amber-light"
            >
              Subscribe Now
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
