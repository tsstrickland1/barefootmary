import { createAdminClient } from "@/lib/supabase/admin";
import { AdminFormField } from "@/components/admin/AdminFormField";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { createEpisode } from "@/app/admin/_actions/episodes";
import type { Season } from "@/types/database";

export const metadata = { title: "Admin — New Episode" };

export default async function NewEpisodePage() {
  const supabase = createAdminClient();
  const { data: seasons } = await supabase
    .from("seasons")
    .select("id, title")
    .order("number");

  const seasonList = (seasons as Pick<Season, "id" | "title">[] ?? []);

  return (
    <div className="px-10 py-10 max-w-2xl">
      <h1 className="font-display text-[2rem] font-light text-cream leading-none mb-8">
        New Episode
      </h1>

      <form action={createEpisode} className="flex flex-col gap-6">
        <AdminFormField label="Season" name="season_id">
          <select id="season_id" name="season_id" required className="form-input">
            <option value="">Select a season…</option>
            {seasonList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </AdminFormField>

        <div className="grid grid-cols-2 gap-6">
          <AdminFormField label="Episode Number" name="number">
            <input
              id="number"
              name="number"
              type="number"
              min={1}
              required
              className="form-input"
            />
          </AdminFormField>
          <AdminFormField label="Duration" name="duration" hint="e.g. 38 min">
            <input id="duration" name="duration" type="text" className="form-input" />
          </AdminFormField>
        </div>

        <AdminFormField label="Title" name="title">
          <input id="title" name="title" type="text" required className="form-input" />
        </AdminFormField>

        <AdminFormField label="Slug" name="slug" hint="URL-safe, unique within season">
          <input id="slug" name="slug" type="text" required className="form-input" />
        </AdminFormField>

        <AdminFormField label="Description" name="description">
          <textarea id="description" name="description" rows={4} className="form-input" />
        </AdminFormField>

        <AdminFormField label="Audio URL" name="audio_url">
          <input id="audio_url" name="audio_url" type="url" className="form-input" />
        </AdminFormField>

        <AdminFormField label="Peaks JSON URL" name="peaks_json_url" hint="Waveform data URL">
          <input id="peaks_json_url" name="peaks_json_url" type="url" className="form-input" />
        </AdminFormField>

        <AdminFormField label="Featured Image" name="image_file">
          <ImageUploadField />
        </AdminFormField>

        <AdminFormField label="Visibility" name="visibility">
          <select id="visibility" name="visibility" required defaultValue="public" className="form-input">
            <option value="public">Public</option>
            <option value="subscriber">Subscriber</option>
            <option value="patron">Patron</option>
          </select>
        </AdminFormField>

        <AdminFormField label="Published At" name="published_at">
          <input id="published_at" name="published_at" type="datetime-local" className="form-input" />
        </AdminFormField>

        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            className="bg-amber text-bg-deep font-label text-[0.75rem] font-semibold tracking-[0.18em] uppercase px-6 py-3 transition-opacity hover:opacity-80"
          >
            Create Episode
          </button>
          <a
            href="/admin/episodes"
            className="font-label text-[0.75rem] tracking-[0.15em] uppercase text-cream-dim hover:text-cream transition-colors no-underline px-6 py-3"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
