import { createClient } from "@/lib/supabase/server";
import { AdminTable } from "@/components/admin/AdminTable";
import { deleteEpisode } from "@/app/admin/_actions/episodes";
import type { Episode, Season } from "@/types/database";

export const metadata = { title: "Admin — Episodes" };

export default async function AdminEpisodesPage() {
  const supabase = await createClient();
  const [{ data: episodes }, { data: seasons }] = await Promise.all([
    supabase
      .from("episodes")
      .select("*")
      .order("season_id")
      .order("number", { ascending: true }),
    supabase.from("seasons").select("id, title").order("number"),
  ]);

  const rows: Episode[] = episodes ?? [];
  const seasonMap = Object.fromEntries(
    (seasons as Pick<Season, "id" | "title">[] ?? []).map((s) => [s.id, s.title])
  );

  return (
    <div className="px-10 py-10">
      <h1 className="font-display text-[2rem] font-light text-cream leading-none mb-8">
        Episodes
      </h1>
      <AdminTable
        rows={rows}
        newHref="/admin/episodes/new"
        editHref={(e) => `/admin/episodes/${e.id}`}
        deleteAction={deleteEpisode}
        columns={[
          {
            header: "Season",
            render: (e) => (
              <span className="text-cream-dim">
                {seasonMap[e.season_id] ?? "—"}
              </span>
            ),
          },
          { header: "#", render: (e) => e.number },
          { header: "Title", render: (e) => e.title },
          { header: "Duration", render: (e) => e.duration ?? "—" },
          {
            header: "Visibility",
            render: (e) => (
              <span className="font-label text-[0.6rem] tracking-[0.15em] uppercase text-amber">
                {e.visibility}
              </span>
            ),
          },
        ]}
        emptyMessage="No episodes yet."
      />
    </div>
  );
}
