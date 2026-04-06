import { createAdminClient } from "@/lib/supabase/admin";
import { AdminTable } from "@/components/admin/AdminTable";
import { deleteArticle } from "@/app/admin/_actions/articles";
import type { Article } from "@/types/database";

export const metadata = { title: "Admin — Articles" };

export default async function AdminArticlesPage() {
  const supabase = createAdminClient();
  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  const rows: Article[] = articles ?? [];

  return (
    <div className="px-4 py-6 sm:px-10 sm:py-10">
      <h1 className="font-display text-[2rem] font-light text-cream leading-none mb-8">
        Articles
      </h1>
      <AdminTable
        rows={rows}
        newHref="/admin/articles/new"
        editHref={(a) => `/admin/articles/${a.id}`}
        deleteAction={deleteArticle}
        columns={[
          { header: "Title", render: (a) => a.title },
          {
            header: "Tag",
            render: (a) => (
              <span className="font-label text-[0.6rem] tracking-[0.15em] uppercase text-teal-light">
                {a.tag}
              </span>
            ),
          },
          {
            header: "Visibility",
            render: (a) => (
              <span className="font-label text-[0.6rem] tracking-[0.15em] uppercase text-amber">
                {a.visibility}
              </span>
            ),
          },
          {
            header: "Featured",
            render: (a) =>
              a.featured ? (
                <span className="text-amber">★</span>
              ) : (
                <span className="text-cream-dim">—</span>
              ),
          },
          {
            header: "Published",
            render: (a) =>
              a.published_at
                ? new Date(a.published_at).toLocaleDateString()
                : <span className="text-cream-dim">Draft</span>,
          },
        ]}
        emptyMessage="No articles yet."
      />
    </div>
  );
}
