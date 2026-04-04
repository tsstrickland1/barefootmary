import { createClient } from "@/lib/supabase/server";
import { AdminTable } from "@/components/admin/AdminTable";
import { deleteSeason } from "@/app/admin/_actions/seasons";
import type { Season } from "@/types/database";

export const metadata = { title: "Admin — Seasons" };

export default async function AdminSeasonsPage() {
  const supabase = await createClient();
  const { data: seasons } = await supabase
    .from("seasons")
    .select("*")
    .order("number", { ascending: true });

  const rows: Season[] = seasons ?? [];

  return (
    <div className="px-10 py-10">
      <h1 className="font-display text-[2rem] font-light text-cream leading-none mb-8">
        Seasons
      </h1>
      <AdminTable
        rows={rows}
        newHref="/admin/seasons/new"
        editHref={(s) => `/admin/seasons/${s.id}`}
        deleteAction={deleteSeason}
        columns={[
          { header: "#", render: (s) => s.number },
          { header: "Title", render: (s) => s.title },
          { header: "Slug", render: (s) => <code className="text-xs">{s.slug}</code> },
          {
            header: "Status",
            render: (s) => (
              <span className="font-label text-[0.6rem] tracking-[0.15em] uppercase text-amber">
                {s.status}
              </span>
            ),
          },
        ]}
        emptyMessage="No seasons yet."
      />
    </div>
  );
}
