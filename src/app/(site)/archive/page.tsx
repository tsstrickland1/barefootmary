import { createClient } from "@/lib/supabase/server";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ArchiveGrid } from "@/components/archive/ArchiveGrid";
import type { Season } from "@/types/database";

export const metadata = {
  title: "The Archive — Barefoot Mary",
  description: "Primary sources: documents, maps, photographs, and recordings.",
};

export default async function ArchivePage() {
  const supabase = await createClient();

  const [{ data: items }, { data: seasons }] = await Promise.all([
    supabase
      .from("archive_items")
      .select("id, title, type, visibility, season_id, episodes(title, number)")
      .order("created_at", { ascending: false }),
    supabase
      .from("seasons")
      .select("id, title, numeral")
      .order("number"),
  ]);

  const archiveItems = (items ?? []) as {
    id: string;
    title: string;
    type: string;
    visibility: "public" | "subscriber" | "patron";
    season_id: string | null;
    episodes: { title: string; number: number } | null;
  }[];

  const seasonList = (seasons as Pick<Season, "id" | "title" | "numeral">[] ?? []);

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

      <ArchiveGrid items={archiveItems} seasons={seasonList} />
    </section>
  );
}
