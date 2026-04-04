import { createClient } from "@/lib/supabase/server";
import { AdminTable } from "@/components/admin/AdminTable";
import { deleteArchiveItem } from "@/app/admin/_actions/archive";
import type { ArchiveItem } from "@/types/database";

export const metadata = { title: "Admin — Archive" };

export default async function AdminArchivePage() {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("archive_items")
    .select("*")
    .order("created_at", { ascending: false });

  const rows: ArchiveItem[] = items ?? [];

  return (
    <div className="px-10 py-10">
      <h1 className="font-display text-[2rem] font-light text-cream leading-none mb-8">
        Archive
      </h1>
      <AdminTable
        rows={rows}
        newHref="/admin/archive/new"
        editHref={(a) => `/admin/archive/${a.id}`}
        deleteAction={deleteArchiveItem}
        columns={[
          { header: "Title", render: (a) => a.title },
          {
            header: "Type",
            render: (a) => (
              <span className="font-label text-[0.6rem] tracking-[0.15em] uppercase text-teal-light">
                {a.type}
              </span>
            ),
          },
          {
            header: "Visibility",
            render: (a) => (
              <span className="font-label text-[0.6rem] tracking-[0.15em] uppercase text-amber">
                {a.visibility}
              </span>
            ),
          },
          {
            header: "File Path",
            render: (a) => (
              <code className="text-xs text-cream-dim truncate max-w-xs block">
                {a.file_path}
              </code>
            ),
          },
        ]}
        emptyMessage="No archive items yet."
      />
    </div>
  );
}
