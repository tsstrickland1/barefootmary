import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: article } = await supabase
    .from("articles")
    .select("title")
    .eq("slug", slug)
    .single();
  return {
    title: article
      ? `${article.title} — Barefoot Mary`
      : "Field Note — Barefoot Mary",
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!article) notFound();

  const { data: relatedItems } = await supabase
    .from("archive_items")
    .select("id, title, type, visibility, description")
    .eq("article_id", article.id)
    .order("created_at");

  const isSubscriberOnly = article.visibility !== "public";

  const bylineParts: string[] = [article.author];
  if (article.published_at) {
    const date = new Date(article.published_at);
    bylineParts.push(
      date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    );
  }
  const byline = bylineParts.join(" · ");

  return (
    <article className="px-12 py-20 max-w-3xl mx-auto max-md:px-6 max-md:py-12">
      {/* Breadcrumb */}
      <div className="font-label text-[0.62rem] tracking-[0.18em] uppercase text-cream-dim mb-8 flex items-center gap-2">
        <Link
          href="/field-notes"
          className="text-cream-dim no-underline hover:text-cream transition-colors duration-200"
        >
          Field Notes
        </Link>
        <span className="text-amber">/</span>
        <span className="text-amber">{article.tag.replace(/-/g, " ")}</span>
      </div>

      <div
        className={`font-label text-[0.6rem] font-semibold tracking-[0.16em] uppercase mb-4 flex items-center gap-1.5 ${
          article.visibility === "public" ? "text-teal-light" : "text-amber"
        }`}
      >
        {article.visibility !== "public" && (
          <span className="inline-flex items-center justify-center w-[13px] h-[13px] border border-amber-dim text-[8px] leading-none rounded-sm">
            🔒
          </span>
        )}
        {article.tag.replace(/-/g, " ")}
      </div>

      <h1 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-light text-cream leading-[1.08] mb-6">
        {article.title}
      </h1>

      <div className="font-label text-[0.72rem] tracking-[0.1em] text-cream-dim mb-10 pb-6 border-b border-rule">
        {byline}
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
        {isSubscriberOnly && (
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

      {/* Related archive items */}
      {relatedItems && relatedItems.length > 0 && (
        <div className="mt-16 pt-10 border-t border-rule">
          <div className="font-label text-[0.62rem] tracking-[0.18em] uppercase text-cream-dim mb-6">
            Primary Sources
          </div>
          <div className="flex flex-col gap-px bg-border border border-border">
            {relatedItems.map((item) => (
              <Link
                key={item.id}
                href={`/archive/${item.id}`}
                className="bg-bg-surface px-6 py-5 flex items-start gap-4 hover:bg-bg-raised transition-colors duration-200 no-underline text-inherit"
              >
                <span className="font-label text-[0.58rem] font-semibold tracking-[0.15em] uppercase text-amber bg-[rgba(196,154,60,0.08)] px-2 py-[3px] shrink-0 mt-0.5">
                  {item.type}
                </span>
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="font-display text-[0.92rem] text-cream leading-[1.3]">
                    {item.title}
                  </div>
                  {item.description && (
                    <p className="font-body text-[0.78rem] text-cream-dim leading-[1.6] line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  <div
                    className={`font-label text-[0.56rem] font-semibold tracking-[0.14em] uppercase mt-1 ${
                      item.visibility === "public"
                        ? "text-teal-light"
                        : "text-amber"
                    }`}
                  >
                    {item.visibility === "public" ? "Free" : "🔒 Subscriber"}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
