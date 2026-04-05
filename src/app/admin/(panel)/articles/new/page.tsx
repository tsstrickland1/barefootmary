import { createAdminClient } from "@/lib/supabase/admin";
import { AdminFormField } from "@/components/admin/AdminFormField";
import { ArticleBodyEditor } from "@/components/admin/ArticleBodyEditor";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { createArticle } from "@/app/admin/_actions/articles";
import type { Season } from "@/types/database";

export const metadata = { title: "Admin — New Article" };

const TAGS = [
  "essay",
  "primary-source",
  "interview",
  "reading-list",
  "research-note",
  "analysis",
  "deep-dive",
];

export default async function NewArticlePage() {
  const supabase = createAdminClient();
  const { data: seasons } = await supabase.from("seasons").select("id, title, numeral").order("number");
  const seasonList = (seasons as Pick<Season, "id" | "title" | "numeral">[] ?? []);

  return (
    <div className="px-10 py-10 max-w-3xl">
      <h1 className="font-display text-[2rem] font-light text-cream leading-none mb-8">
        New Article
      </h1>

      <form action={createArticle} className="flex flex-col gap-6">
        <AdminFormField label="Title" name="title">
          <input id="title" name="title" type="text" required className="form-input" />
        </AdminFormField>

        <AdminFormField label="Slug" name="slug" hint="URL-safe unique identifier">
          <input id="slug" name="slug" type="text" required className="form-input" />
        </AdminFormField>

        <AdminFormField label="Excerpt" name="excerpt">
          <textarea id="excerpt" name="excerpt" rows={2} className="form-input" />
        </AdminFormField>

        <AdminFormField label="Body" name="body_json">
          <ArticleBodyEditor />
        </AdminFormField>

        <div className="grid grid-cols-2 gap-6">
          <AdminFormField label="Tag" name="tag">
            <select id="tag" name="tag" required defaultValue="essay" className="form-input">
              {TAGS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </AdminFormField>

          <AdminFormField label="Visibility" name="visibility">
            <select id="visibility" name="visibility" required defaultValue="public" className="form-input">
              <option value="public">Public</option>
              <option value="subscriber">Subscriber</option>
              <option value="patron">Patron</option>
            </select>
          </AdminFormField>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <AdminFormField label="Author" name="author">
            <input
              id="author"
              name="author"
              type="text"
              defaultValue="T.S. Strickland"
              className="form-input"
            />
          </AdminFormField>

          <AdminFormField label="Featured Image" name="image_file">
            <ImageUploadField />
          </AdminFormField>
        </div>

        <AdminFormField label="Published At" name="published_at">
          <input id="published_at" name="published_at" type="datetime-local" className="form-input" />
        </AdminFormField>

        <AdminFormField label="Featured" name="featured">
          <select id="featured" name="featured" defaultValue="false" className="form-input">
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </AdminFormField>

        <AdminFormField label="Season" name="season_id" hint="Associate this field note with a season">
          <select id="season_id" name="season_id" className="form-input">
            <option value="">None</option>
            {seasonList.map((s) => (
              <option key={s.id} value={s.id}>Season {s.numeral} — {s.title}</option>
            ))}
          </select>
        </AdminFormField>

        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            className="bg-amber text-bg-deep font-label text-[0.75rem] font-semibold tracking-[0.18em] uppercase px-6 py-3 transition-opacity hover:opacity-80"
          >
            Create Article
          </button>
          <a
            href="/admin/articles"
            className="font-label text-[0.75rem] tracking-[0.15em] uppercase text-cream-dim hover:text-cream transition-colors no-underline px-6 py-3"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
