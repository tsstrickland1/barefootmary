import { SectionHeader } from "@/components/ui/SectionHeader";
import { sampleArchiveItems } from "@/lib/sample-data";

export const metadata = {
  title: "The Archive — Barefoot Mary",
  description: "Primary sources: documents, maps, photographs, and recordings.",
};

const typeFilters = ["All", "PDF", "IMG", "AUD", "TXT"];

export default function ArchivePage() {
  return (
    <section className="px-12 py-20 max-md:px-6 max-md:py-12">
      <SectionHeader label="Primary Sources" title="The Archive" />

      {/* Intro */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start mb-12">
        <p className="font-display text-[1.85rem] font-light text-cream leading-[1.1] italic">
          Documents, maps, photographs, and recordings gathered in the course of
          investigation.
        </p>
        <p className="text-[0.88rem] text-cream-dim leading-[1.88] font-body italic">
          We believe in showing our work. The Archive holds the primary materials
          that drive each episode—survey plans, oral history recordings,
          newspaper clippings, and annotated photographs. Subscriber access
          unlocks full documents and audio; all users can browse the catalog.
        </p>
      </div>

      {/* Type filter + search */}
      <div className="flex items-center gap-4 flex-wrap mb-8">
        {typeFilters.map((t) => (
          <button
            key={t}
            className={`font-label text-[0.62rem] font-medium tracking-[0.14em] uppercase px-4 py-2 border cursor-pointer transition-all duration-200 ${
              t === "All"
                ? "text-bg-deep bg-amber border-amber"
                : "text-cream-dim bg-transparent border-border hover:border-amber-dim hover:text-cream"
            }`}
          >
            {t}
          </button>
        ))}

        <div className="ml-auto">
          <input
            type="text"
            placeholder="Search the archive..."
            className="form-input w-64 text-[0.82rem]"
          />
        </div>
      </div>

      {/* Archive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
        {sampleArchiveItems.map((item) => (
          <div
            key={item.id}
            className="bg-bg-surface p-6 flex flex-col gap-2 cursor-pointer transition-colors duration-200 min-h-[140px] hover:bg-bg-raised"
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
          </div>
        ))}
      </div>
    </section>
  );
}
