import { createClient } from "@/lib/supabase/server";
import type { Subscriber } from "@/types/database";

export const metadata = { title: "Admin — Subscribers" };

const PLAN_COLORS: Record<string, string> = {
  free: "text-cream-dim",
  descender: "text-teal-light",
  patron: "text-amber",
};

const STATUS_COLORS: Record<string, string> = {
  active: "text-[#6aaa6a]",
  canceled: "text-[#e07070]",
  past_due: "text-amber",
};

export default async function AdminSubscribersPage() {
  const supabase = await createClient();
  const { data: subscribers } = await supabase
    .from("subscribers")
    .select("*")
    .order("created_at", { ascending: false });

  const rows: Subscriber[] = subscribers ?? [];

  return (
    <div className="px-10 py-10">
      <div className="flex items-baseline gap-4 mb-8">
        <h1 className="font-display text-[2rem] font-light text-cream leading-none">
          Subscribers
        </h1>
        <span className="font-label text-[0.65rem] tracking-[0.18em] uppercase text-cream-dim">
          {rows.length} total
        </span>
      </div>

      <div className="flex gap-6 mb-8">
        {(["active", "canceled", "past_due"] as const).map((s) => {
          const count = rows.filter((r) => r.status === s).length;
          return (
            <div key={s} className="bg-bg-surface border border-border px-6 py-4">
              <div className={`font-display text-[1.8rem] font-light leading-none mb-1 ${STATUS_COLORS[s]}`}>
                {count}
              </div>
              <div className="font-label text-[0.6rem] tracking-[0.18em] uppercase text-cream-dim">
                {s.replace("_", " ")}
              </div>
            </div>
          );
        })}
      </div>

      {rows.length === 0 ? (
        <p className="text-cream-dim font-body text-sm">No subscribers yet.</p>
      ) : (
        <div className="border border-border overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-bg-raised border-b border-border">
                {[
                  "User ID",
                  "Plan",
                  "Status",
                  "Period Ends",
                  "Stripe Customer",
                  "Joined",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 font-label text-[0.6rem] tracking-[0.2em] uppercase text-cream-dim"
                  >
                    {h}
                  </th>
                ))}
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
                  <td className="px-4 py-3">
                    <code className="text-[0.7rem] text-cream-dim">
                      {sub.user_id.slice(0, 8)}…
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`font-label text-[0.65rem] tracking-[0.15em] uppercase ${
                        PLAN_COLORS[sub.plan] ?? "text-cream-dim"
                      }`}
                    >
                      {sub.plan}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`font-label text-[0.65rem] tracking-[0.15em] uppercase ${
                        STATUS_COLORS[sub.status] ?? "text-cream-dim"
                      }`}
                    >
                      {sub.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[0.8rem] text-cream-dim font-body whitespace-nowrap">
                    {sub.current_period_end
                      ? new Date(sub.current_period_end).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-[0.7rem] text-cream-dim">
                      {sub.stripe_customer_id ?? "—"}
                    </code>
                  </td>
                  <td className="px-4 py-3 text-[0.8rem] text-cream-dim font-body whitespace-nowrap">
                    {new Date(sub.created_at).toLocaleDateString()}
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
