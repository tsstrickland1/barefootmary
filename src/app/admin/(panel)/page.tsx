import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Submission } from "@/types/database";

export const metadata = {
  title: "Admin — Dashboard",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "text-amber bg-[rgba(196,154,60,0.1)]",
  reviewed: "text-teal-light bg-[rgba(106,172,162,0.1)]",
  accepted: "text-[#6aaa6a] bg-[rgba(106,170,106,0.1)]",
  declined: "text-[#e07070] bg-[rgba(224,112,112,0.1)]",
};

async function getCounts() {
  const supabase = createAdminClient();
  const [seasons, episodes, articles, archive, submissions, subscribers] =
    await Promise.all([
      supabase.from("seasons").select("id", { count: "exact", head: true }),
      supabase.from("episodes").select("id", { count: "exact", head: true }),
      supabase.from("articles").select("id", { count: "exact", head: true }),
      supabase
        .from("archive_items")
        .select("id", { count: "exact", head: true }),
      supabase.from("submissions").select("id", { count: "exact", head: true }),
      supabase
        .from("subscribers")
        .select("id", { count: "exact", head: true }),
    ]);

  return {
    seasons: seasons.count ?? 0,
    episodes: episodes.count ?? 0,
    articles: articles.count ?? 0,
    archive: archive.count ?? 0,
    submissions: submissions.count ?? 0,
    subscribers: subscribers.count ?? 0,
  };
}

async function getRecentSubmissions(): Promise<Submission[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("submissions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);
  return data ?? [];
}

export default async function AdminDashboardPage() {
  const [counts, recentSubmissions] = await Promise.all([
    getCounts(),
    getRecentSubmissions(),
  ]);

  const stats = [
    { label: "Seasons", count: counts.seasons, href: "/admin/seasons" },
    { label: "Episodes", count: counts.episodes, href: "/admin/episodes" },
    { label: "Articles", count: counts.articles, href: "/admin/articles" },
    { label: "Archive Items", count: counts.archive, href: "/admin/archive" },
    {
      label: "Submissions",
      count: counts.submissions,
      href: "/admin/submissions",
    },
    {
      label: "Subscribers",
      count: counts.subscribers,
      href: "/admin/subscribers",
    },
  ];

  return (
    <div className="px-4 py-6 sm:px-10 sm:py-10">
      <h1 className="font-display text-[2rem] font-light text-cream leading-none mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-bg-surface border border-border p-6 no-underline hover:bg-bg-raised transition-colors duration-150"
          >
            <div className="font-display text-[2.5rem] font-light text-amber leading-none mb-1">
              {s.count}
            </div>
            <div className="font-label text-[0.65rem] tracking-[0.18em] uppercase text-cream-dim">
              {s.label}
            </div>
          </Link>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-label text-[0.7rem] tracking-[0.2em] uppercase text-cream-dim">
            Recent Submissions
          </h2>
          <Link
            href="/admin/submissions"
            className="font-label text-[0.65rem] tracking-[0.15em] uppercase text-amber hover:opacity-80 no-underline transition-opacity"
          >
            View All
          </Link>
        </div>

        {recentSubmissions.length === 0 ? (
          <p className="text-cream-dim font-body text-sm">No submissions yet.</p>
        ) : (
          <div className="border border-border">
            {recentSubmissions.map((sub, i) => (
              <div
                key={sub.id}
                className={`flex items-center justify-between px-5 py-4 border-b border-border last:border-0 ${
                  i % 2 === 0 ? "bg-bg-surface" : "bg-bg-deep"
                }`}
              >
                <div>
                  <div className="text-[0.9rem] text-cream font-body">
                    {sub.name}
                  </div>
                  <div className="text-[0.75rem] text-cream-dim font-body mt-0.5 line-clamp-1">
                    {sub.description}
                  </div>
                </div>
                <span
                  className={`font-label text-[0.6rem] tracking-[0.15em] uppercase px-2.5 py-1 ml-4 shrink-0 ${STATUS_COLORS[sub.status] ?? "text-cream-dim"}`}
                >
                  {sub.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
