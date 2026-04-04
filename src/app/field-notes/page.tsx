import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { sampleArticles } from "@/lib/sample-data";

export const metadata = {
  title: "Field Notes — Barefoot Mary",
  description: "Research essays, reading lists, primary sources, and interviews.",
};

const tags = ["All", "Essay", "Primary Source", "Interview", "Deep Dive", "Analysis"];

export default function FieldNotesPage() {
  return (
    <section className="px-12 py-20 max-md:px-6 max-md:py-12">
      <SectionHeader label="Research & Writing" title="Field Notes" />

      {/* Tag filter bar */}
      <div className="flex gap-3 flex-wrap mb-10">
        {tags.map((tag) => (
          <button
            key={tag}
            className={`font-label text-[0.62rem] font-medium tracking-[0.14em] uppercase px-4 py-2 border cursor-pointer transition-all duration-200 ${
              tag === "All"
                ? "text-bg-deep bg-amber border-amber"
                : "text-cream-dim bg-transparent border-border hover:border-amber-dim hover:text-cream"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Articles grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
        {sampleArticles.map((article) => (
          <Link
            key={article.slug}
            href={`/field-notes/${article.slug}`}
            className="bg-bg-surface p-8 flex flex-col gap-3 transition-colors duration-200 no-underline text-inherit hover:bg-bg-raised"
          >
            <div
              className={`font-label text-[0.6rem] font-semibold tracking-[0.16em] uppercase flex items-center gap-1.5 ${
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
            <div className="font-display text-[1.25rem] font-normal text-cream leading-[1.2]">
              {article.title}
            </div>
            {article.excerpt && (
              <p className="text-[0.82rem] text-cream-dim leading-[1.75] font-body line-clamp-3">
                {article.excerpt}
              </p>
            )}
            <div className="font-label text-[0.62rem] tracking-[0.1em] text-cream-dim mt-auto pt-2">
              {article.byline}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
