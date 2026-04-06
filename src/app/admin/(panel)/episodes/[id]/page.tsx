import { notFound } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminFormField } from "@/components/admin/AdminFormField";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { AudioUploadField } from "@/components/admin/AudioUploadField";
import { updateEpisode } from "@/app/admin/_actions/episodes";
import type { Season, ArchiveItem } from "@/types/database";

export const metadata = { title: "Admin — Edit Episode" };

export default async function EditEpisodePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();
  const [{ data: episode }, { data: seasons }, { data: archiveItems }] = await Promise.all([
    supabase.from("episodes").select("*").eq("id", id).single(),
    supabase.from("seasons").select("id, title").order("number"),
    supabase
      .from("archive_items")
      .select("id, title, type, visibility")
      .eq("episode_id", id)
      .order("created_at"),
  ]);

  if (!episode) notFound();

  const seasonList = (seasons as Pick<Season, "id" | "title">[] ?? []);
  const itemList = (archiveItems as Pick<ArchiveItem, "id" | "title" | "type" | "visibility">[] ?? []);

  const publishedLocal = episode.published_at
    ? new Date(episode.published_at).toISOString().slice(0, 16)
    : "";

  return (
    <div className="px-10 py-10 max-w-2xl">
      <h1 className="font-display text-[2rem] font-light text-cream leading-none mb-8">
        Edit Episode
      </h1>

      <form action={updateEpisode} className="flex flex-col gap-6">
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

        <AdminFormField label="Audio" name="audio_file">
          <AudioUploadField currentUrl={episode.audio_url} />
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

      {/* Archive Items */}
      <div className="mt-12 pt-10 border-t border-border">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-display text-[1.3rem] font-light text-cream leading-none">
            Archive Items
          </h2>
          <Link
            href={`/admin/archive/new?episode_id=${episode.id}`}
            className="bg-amber text-bg-deep font-label text-[0.7rem] font-semibold tracking-[0.18em] uppercase px-4 py-2 transition-opacity hover:opacity-80 no-underline"
          >
            + Add Archive Item
          </Link>
        </div>

        {itemList.length === 0 ? (
          <p className="text-cream-dim font-body text-sm">No archive items yet.</p>
        ) : (
          <div className="border border-border overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-bg-raised border-b border-border">
                  <th className="text-left px-4 py-3 font-label text-[0.7rem] tracking-[0.2em] uppercase text-cream-dim">Title</th>
                  <th className="text-left px-4 py-3 font-label text-[0.7rem] tracking-[0.2em] uppercase text-cream-dim">Type</th>
                  <th className="text-left px-4 py-3 font-label text-[0.7rem] tracking-[0.2em] uppercase text-cream-dim">Visibility</th>
                  <th className="px-4 py-3 font-label text-[0.7rem] tracking-[0.2em] uppercase text-cream-dim text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {itemList.map((item, i) => (
                  <tr
                    key={item.id}
                    className={`border-b border-border last:border-0 ${i % 2 === 0 ? "bg-bg-surface" : "bg-bg-deep"}`}
                  >
                    <td className="px-4 py-3 text-[0.85rem] text-cream font-body">{item.title}</td>
                    <td className="px-4 py-3 text-[0.85rem] text-cream-dim font-label text-[0.7rem] tracking-[0.1em] uppercase">{item.type}</td>
                    <td className="px-4 py-3 text-[0.85rem] text-cream-dim font-label text-[0.7rem] tracking-[0.1em] uppercase">{item.visibility}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/archive/${item.id}`}
                        className="font-label text-[0.75rem] tracking-[0.15em] uppercase text-teal-light hover:text-cream transition-colors no-underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
