import { createAdminClient } from "@/lib/supabase/admin";
import { updateSubmissionStatus } from "@/app/admin/_actions/submissions";
import type { Submission } from "@/types/database";

export const metadata = { title: "Admin — Submissions" };

const STATUS_OPTIONS = ["pending", "reviewed", "accepted", "declined"] as const;

const STATUS_COLORS: Record<string, string> = {
  pending: "text-amber",
  reviewed: "text-teal-light",
  accepted: "text-[#6aaa6a]",
  declined: "text-[#e07070]",
};

export default async function AdminSubmissionsPage() {
  const supabase = createAdminClient();
  const { data: submissions } = await supabase
    .from("submissions")
    .select("*")
    .order("created_at", { ascending: false });

  const rows: Submission[] = submissions ?? [];

  return (
    <div className="px-10 py-10">
      <h1 className="font-display text-[2rem] font-light text-cream leading-none mb-8">
        Submissions
      </h1>

      {rows.length === 0 ? (
        <p className="text-cream-dim font-body text-sm">No submissions yet.</p>
      ) : (
        <div className="border border-border overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-bg-raised border-b border-border">
                {["Name", "Email", "Description", "File", "Status", "Date", "Update"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 font-label text-[0.6rem] tracking-[0.2em] uppercase text-cream-dim"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((sub, i) => (
                <tr
                  key={sub.id}
                  className={`border-b border-border last:border-0 ${
                    i % 2 === 0 ? "bg-bg-surface" : "bg-bg-deep"
                  }`}
                >
                  <td className="px-4 py-3 text-[0.85rem] text-cream font-body whitespace-nowrap">
                    {sub.name}
                  </td>
                  <td className="px-4 py-3 text-[0.8rem] text-cream-dim font-body">
                    {sub.email ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-[0.8rem] text-cream font-body max-w-xs">
                    <span className="line-clamp-2">{sub.description}</span>
                  </td>
                  <td className="px-4 py-3 text-[0.75rem] text-cream-dim font-body">
                    {sub.file_path ? (
                      <code className="text-xs">{sub.file_path.split("/").pop()}</code>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`font-label text-[0.6rem] tracking-[0.15em] uppercase ${
                        STATUS_COLORS[sub.status] ?? "text-cream-dim"
                      }`}
                    >
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[0.75rem] text-cream-dim font-body whitespace-nowrap">
                    {new Date(sub.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <form action={updateSubmissionStatus} className="flex items-center gap-2">
                      <input type="hidden" name="id" value={sub.id} />
                      <select
                        name="status"
                        defaultValue={sub.status}
                        className="form-input text-[0.75rem] py-1 px-2"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        className="font-label text-[0.6rem] tracking-[0.15em] uppercase text-amber hover:opacity-80 transition-opacity whitespace-nowrap"
                      >
                        Save
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
