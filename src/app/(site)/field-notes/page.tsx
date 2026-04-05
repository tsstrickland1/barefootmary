import { createClient } from "@/lib/supabase/server";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FieldNotesGrid } from "@/components/field-notes/FieldNotesGrid";
import type { Season } from "@/types/database";

export const metadata = {
  title: "Field Notes — Barefoot Mary",
  description: "Research essays, reading lists, primary sources, and interviews.",
};

export default async function FieldNotesPage() {
  const supabase = await createClient();

  const [{ data: articles }, { data: seasons }] = await Promise.all([
    supabase
      .from("articles")
      .select("slug, title, excerpt, tag, visibility, author, published_at, image_url, season_id")
      .order("published_at", { ascending: false }),
    supabase
      .from("seasons")
      .select("id, title, numeral")
      .order("number"),
  ]);

  const seasonList = (seasons as Pick<Season, "id" | "title" | "numeral">[] ?? []);

  return (
    <section className="px-12 py-20 max-md:px-6 max-md:py-12">
      <SectionHeader label="Research & Writing" title="Field Notes" />
      <FieldNotesGrid articles={articles ?? []} seasons={seasonList} />
    </section>
  );
}
