import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminFormField } from "@/components/admin/AdminFormField";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { updateEpisode } from "@/app/admin/_actions/episodes";
import type { Season } from "@/types/database";

export const metadata = { title: "Admin — Edit Episode" };

export default async function EditEpisodePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();
  const [{ data: episode }, { data: seasons }] = await Promise.all([
    supabase.from("episodes").select("*").eq("id", id).single(),
    supabase.from("seasons").select("id, title").order("number"),
  ]);

  if (!episode) notFound();

  const seasonList = (seasons as Pick<Season, "id" | "title">[] ?? []);

  const publishedLocal = episode.published_at
    ? new Date(episode.published_at).toISOString().slice(0, 16)
    : "";

  return (
    <div className="px-10 py-10 max-w-2xl">
      <h1 className="font-display text-[2rem] font-light text-cream leading-none mb-8">
        Edit Episode
      </h1>

      <form action={updateEpisode} encType="multipart/form-data" className="flex flex-col gap-6">
        <input type="hidden" name="id" value={episode.id} />

        <AdminFormField label="Season" name="season_id">
          <select
            id="season_id"
            name="season_id"
            required
            defaultValue={episode.season_id}
            className="form-input"
          >
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
              defaultValue={episode.number}
              className="form-input"
            />
          </AdminFormField>
          <AdminFormField label="Duration" name="duration" hint="e.g. 38 min">
            <input
              id="duration"
              name="duration"
              type="text"
              defaultValue={episode.duration ?? ""}
              className="form-input"
            />
          </AdminFormField>
        </div>

        <AdminFormField label="Title" name="title">
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={episode.title}
            className="form-input"
          />
        </AdminFormField>

        <AdminFormField label="Slug" name="slug" hint="URL-safe, unique within season">
          <input
            id="slug"
            name="slug"
            type="text"
            required
            defaultValue={episode.slug}
            className="form-input"
          />
        </AdminFormField>

        <AdminFormField label="Description" name="description">
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={episode.description ?? ""}
            className="form-input"
          />
        </AdminFormField>

        <AdminFormField label="Audio URL" name="audio_url">
          <input
            id="audio_url"
            name="audio_url"
            type="url"
            defaultValue={episode.audio_url ?? ""}
            className="form-input"
          />
        </AdminFormField>

        <AdminFormField label="Peaks JSON URL" name="peaks_json_url" hint="Waveform data URL">
          <input
            id="peaks_json_url"
            name="peaks_json_url"
            type="url"
            defaultValue={episode.peaks_json_url ?? ""}
            className="form-input"
          />
        </AdminFormField>

        <AdminFormField label="Featured Image" name="image_file">
          <ImageUploadField currentUrl={episode.image_url} />
        </AdminFormField>

        <AdminFormField label="Visibility" name="visibility">
          <select
            id="visibility"
            name="visibility"
            required
            defaultValue={episode.visibility}
            className="form-input"
          >
            <option value="public">Public</option>
            <option value="subscriber">Subscriber</option>
            <option value="patron">Patron</option>
          </select>
        </AdminFormField>

        <AdminFormField label="Published At" name="published_at">
          <input
            id="published_at"
            name="published_at"
            type="datetime-local"
            defaultValue={publishedLocal}
            className="form-input"
          />
        </AdminFormField>

        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            className="bg-amber text-bg-deep font-label text-[0.75rem] font-semibold tracking-[0.18em] uppercase px-6 py-3 transition-opacity hover:opacity-80"
          >
            Save Changes
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
