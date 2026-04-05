import { createAdminClient } from "@/lib/supabase/admin";
import { AdminFormField } from "@/components/admin/AdminFormField";
import { createArchiveItem } from "@/app/admin/_actions/archive";
import type { Season, Episode } from "@/types/database";

export const metadata = { title: "Admin — New Archive Item" };

export default async function NewArchiveItemPage() {
  const supabase = createAdminClient();
  const [{ data: seasons }, { data: episodes }] = await Promise.all([
    supabase.from("seasons").select("id, title").order("number"),
    supabase.from("episodes").select("id, title, season_id").order("number"),
  ]);

  const seasonList = (seasons as Pick<Season, "id" | "title">[] ?? []);
  const episodeList = (episodes as Pick<Episode, "id" | "title" | "season_id">[] ?? []);

  return (
    <div className="px-10 py-10 max-w-2xl">
      <h1 className="font-display text-[2rem] font-light text-cream leading-none mb-8">
        New Archive Item
      </h1>

      <form action={createArchiveItem} className="flex flex-col gap-6">
        <AdminFormField label="Title" name="title">
          <input id="title" name="title" type="text" required className="form-input" />
        </AdminFormField>

        <AdminFormField label="Description" name="description">
          <textarea id="description" name="description" rows={3} className="form-input" />
        </AdminFormField>

        <div className="grid grid-cols-2 gap-6">
          <AdminFormField label="Type" name="type">
            <select id="type" name="type" required defaultValue="pdf" className="form-input">
              <option value="pdf">PDF</option>
              <option value="image">Image</option>
              <option value="audio">Audio</option>
              <option value="transcript">Transcript</option>
            </select>
          </AdminFormField>

          <AdminFormField label="Visibility" name="visibility">
            <select id="visibility" name="visibility" required defaultValue="subscriber" className="form-input">
              <option value="public">Public</option>
              <option value="subscriber">Subscriber</option>
              <option value="patron">Patron</option>
            </select>
          </AdminFormField>
        </div>

        <AdminFormField label="File Path" name="file_path" hint="Storage path, e.g. archive/document.pdf">
          <input id="file_path" name="file_path" type="text" required className="form-input" />
        </AdminFormField>

        <AdminFormField label="Related Season" name="season_id">
          <select id="season_id" name="season_id" className="form-input">
            <option value="">None</option>
            {seasonList.map((s) => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>
        </AdminFormField>

        <AdminFormField label="Related Episode" name="episode_id">
          <select id="episode_id" name="episode_id" className="form-input">
            <option value="">None</option>
            {episodeList.map((e) => (
              <option key={e.id} value={e.id}>{e.title}</option>
            ))}
          </select>
        </AdminFormField>

        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            className="bg-amber text-bg-deep font-label text-[0.75rem] font-semibold tracking-[0.18em] uppercase px-6 py-3 transition-opacity hover:opacity-80"
          >
            Create Item
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
