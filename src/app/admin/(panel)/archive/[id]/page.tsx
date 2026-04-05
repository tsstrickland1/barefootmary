import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminFormField } from "@/components/admin/AdminFormField";
import { ArchiveFileUploadField } from "@/components/admin/ArchiveFileUploadField";
import { updateArchiveItem } from "@/app/admin/_actions/archive";
import type { Season, Episode, Article } from "@/types/database";

export const metadata = { title: "Admin — Edit Archive Item" };

export default async function EditArchiveItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();
  const [{ data: item }, { data: seasons }, { data: episodes }, { data: articles }] =
    await Promise.all([
      supabase.from("archive_items").select("*").eq("id", id).single(),
      supabase.from("seasons").select("id, title").order("number"),
      supabase.from("episodes").select("id, title, season_id").order("number"),
      supabase.from("articles").select("id, title").order("created_at", { ascending: false }),
    ]);

  if (!item) notFound();

  const seasonList = (seasons as Pick<Season, "id" | "title">[] ?? []);
  const episodeList = (episodes as Pick<Episode, "id" | "title" | "season_id">[] ?? []);
  const articleList = (articles as Pick<Article, "id" | "title">[] ?? []);

  return (
    <div className="px-10 py-10 max-w-2xl">
      <h1 className="font-display text-[2rem] font-light text-cream leading-none mb-8">
        Edit Archive Item
      </h1>

      <form action={updateArchiveItem} encType="multipart/form-data" className="flex flex-col gap-6">
        <input type="hidden" name="id" value={item.id} />

        <AdminFormField label="Title" name="title">
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={item.title}
            className="form-input"
          />
        </AdminFormField>

        <AdminFormField label="Description" name="description">
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={item.description ?? ""}
            className="form-input"
          />
        </AdminFormField>

        {/* type is derived from the uploaded file; preserved here when no new file is chosen */}
        <input type="hidden" name="type" value={item.type} />

        <AdminFormField label="Visibility" name="visibility">
          <select
            id="visibility"
            name="visibility"
            required
            defaultValue={item.visibility}
            className="form-input"
          >
            <option value="public">Public</option>
            <option value="subscriber">Subscriber</option>
            <option value="patron">Patron</option>
          </select>
        </AdminFormField>

        <AdminFormField label="File" name="archive_file">
          <ArchiveFileUploadField currentPath={item.file_path} />
        </AdminFormField>

        <AdminFormField label="Related Season" name="season_id">
          <select
            id="season_id"
            name="season_id"
            defaultValue={item.season_id ?? ""}
            className="form-input"
          >
            <option value="">None</option>
            {seasonList.map((s) => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>
        </AdminFormField>

        <AdminFormField label="Related Episode" name="episode_id">
          <select
            id="episode_id"
            name="episode_id"
            defaultValue={item.episode_id ?? ""}
            className="form-input"
          >
            <option value="">None</option>
            {episodeList.map((e) => (
              <option key={e.id} value={e.id}>{e.title}</option>
            ))}
          </select>
        </AdminFormField>

        <AdminFormField label="Related Field Note" name="article_id" hint="Associate this archive item with a field note">
          <select
            id="article_id"
            name="article_id"
            defaultValue={item.article_id ?? ""}
            className="form-input"
          >
            <option value="">None</option>
            {articleList.map((a) => (
              <option key={a.id} value={a.id}>{a.title}</option>
            ))}
          </select>
        </AdminFormField>

        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            className="bg-amber text-bg-deep font-label text-[0.75rem] font-semibold tracking-[0.18em] uppercase px-6 py-3 transition-opacity hover:opacity-80"
          >
            Save Changes
          </button>
          <a
            href="/admin/archive"
            className="font-label text-[0.75rem] tracking-[0.15em] uppercase text-cream-dim hover:text-cream transition-colors no-underline px-6 py-3"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
