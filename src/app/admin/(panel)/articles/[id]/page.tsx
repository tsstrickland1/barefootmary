import { notFound } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminFormField } from "@/components/admin/AdminFormField";
import { ArticleBodyEditor } from "@/components/admin/ArticleBodyEditor";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { updateArticle } from "@/app/admin/_actions/articles";
import type { Season, ArchiveItem } from "@/types/database";

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
  const [{ data: article }, { data: seasons }, { data: archiveItems }] = await Promise.all([
    supabase.from("articles").select("*").eq("id", id).single(),
    supabase.from("seasons").select("id, title, numeral").order("number"),
    supabase
      .from("archive_items")
      .select("id, title, type, visibility")
      .eq("article_id", id)
      .order("created_at"),
  ]);

  if (!article) notFound();

  const seasonList = (seasons as Pick<Season, "id" | "title" | "numeral">[] ?? []);
  const itemList = (archiveItems as Pick<ArchiveItem, "id" | "title" | "type" | "visibility">[] ?? []);

  const publishedLocal = article.published_at
    ? new Date(article.published_at).toISOString().slice(0, 16)
    : "";

  return (
    <div className="px-10 py-10 max-w-3xl">
      <h1 className="font-display text-[2rem] font-light text-cream leading-none mb-8">
        Edit Article
      </h1>

      <form action={updateArticle} className="flex flex-col gap-6">
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

      {/* Archive Items */}
      <div className="mt-12 pt-10 border-t border-border">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-display text-[1.3rem] font-light text-cream leading-none">
            Archive Items
          </h2>
          <Link
            href={`/admin/archive/new?article_id=${article.id}`}
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
                    <td className="px-4 py-3 font-label text-[0.7rem] tracking-[0.1em] uppercase text-cream-dim">{item.type}</td>
                    <td className="px-4 py-3 font-label text-[0.7rem] tracking-[0.1em] uppercase text-cream-dim">{item.visibility}</td>
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
