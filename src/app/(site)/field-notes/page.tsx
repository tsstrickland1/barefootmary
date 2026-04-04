import { SectionHeader } from "@/components/ui/SectionHeader";
import { FieldNotesGrid } from "@/components/field-notes/FieldNotesGrid";
import { sampleArticles } from "@/lib/sample-data";

export const metadata = {
  title: "Field Notes — Barefoot Mary",
  description: "Research essays, reading lists, primary sources, and interviews.",
};

export default function FieldNotesPage() {
  return (
    <section className="px-12 py-20 max-md:px-6 max-md:py-12">
      <SectionHeader label="Research & Writing" title="Field Notes" />
      <FieldNotesGrid articles={sampleArticles} />
    </section>
  );
}
