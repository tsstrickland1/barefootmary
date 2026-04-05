import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminFormField } from "@/components/admin/AdminFormField";
import { ArticleBodyEditor } from "@/components/admin/ArticleBodyEditor";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { updateArticle } from "@/app/admin/_actions/articles";
import type { Season } from "@/types/database";

export const metadata = { title: "Admin — Edit Article" };

const TAGS = [
  "essay",
  "primary-source",
  "interview",
  "reading-list",
  "research-note",
  "analysis",
  "deep-dive",
];

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();
  const [{ data: article }, { data: seasons }] = await Promise.all([
    supabase.from("articles").select("*").eq("id", id).single(),
    supabase.from("seasons").select("id, title, numeral").order("number"),
  ]);

  if (!article) notFound();

  const seasonList = (seasons as Pick<Season, "id" | "title" | "numeral">[] ?? []);

  const publishedLocal = article.published_at
    ? new Date(article.published_at).toISOString().slice(0, 16)
    : "";

  return (
    <div className="px-10 py-10 max-w-3xl">
      <h1 className="font-display text-[2rem] font-light text-cream leading-none mb-8">
        Edit Article
      </h1>

      <form action={updateArticle} encType="multipart/form-data" className="flex flex-col gap-6">
        <input type="hidden" name="id" value={article.id} />

        <AdminFormField label="Title" name="title">
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={article.title}
            className="form-input"
          />
        </AdminFormField>

        <AdminFormField label="Slug" name="slug" hint="URL-safe unique identifier">
          <input
            id="slug"
            name="slug"
            type="text"
            required
            defaultValue={article.slug}
            className="form-input"
          />
        </AdminFormField>

        <AdminFormField label="Excerpt" name="excerpt">
          <textarea
            id="excerpt"
            name="excerpt"
            rows={2}
            defaultValue={article.excerpt ?? ""}
            className="form-input"
          />
        </AdminFormField>

        <AdminFormField label="Body" name="body_json">
          <ArticleBodyEditor initialContent={article.body_json} />
        </AdminFormField>

        <div className="grid grid-cols-2 gap-6">
          <AdminFormField label="Tag" name="tag">
            <select
              id="tag"
              name="tag"
              required
              defaultValue={article.tag}
              className="form-input"
            >
              {TAGS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </AdminFormField>

          <AdminFormField label="Visibility" name="visibility">
            <select
              id="visibility"
              name="visibility"
              required
              defaultValue={article.visibility}
              className="form-input"
            >
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
              defaultValue={article.author}
              className="form-input"
            />
          </AdminFormField>

          <AdminFormField label="Featured Image" name="image_file">
            <ImageUploadField currentUrl={article.image_url} />
          </AdminFormField>
        </div>

        <AdminFormField label="Published At" name="published_at">
          <input
            id="published_at"
            name="published_at"
            type="datetime-local"
            defaultValue={publishedLocal}
            className="form-input"
          />
        </AdminFormField>

        <AdminFormField label="Featured" name="featured">
          <select
            id="featured"
            name="featured"
            defaultValue={article.featured ? "true" : "false"}
            className="form-input"
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </AdminFormField>

        <AdminFormField label="Season" name="season_id" hint="Associate this field note with a season">
          <select
            id="season_id"
            name="season_id"
            defaultValue={article.season_id ?? ""}
            className="form-input"
          >
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
            Save Changes
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
