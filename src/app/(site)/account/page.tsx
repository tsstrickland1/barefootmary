import { redirect } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { AccountNotice } from "@/components/auth/AccountNotice";
import type { Subscriber } from "@/types/database";

export const metadata = {
  title: "Account — Barefoot Mary",
};

const PLAN_LABELS: Record<string, string> = {
  free: "Free",
  descender: "Descender",
  patron: "Patron",
};

const STATUS_STYLES: Record<string, string> = {
  active: "text-[#6aaa6a] bg-[rgba(106,170,106,0.1)]",
  canceled: "text-[#e07070] bg-[rgba(224,112,112,0.1)]",
  past_due: "text-amber bg-[rgba(196,154,60,0.1)]",
};

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: subscriber } = await supabase
    .from("subscribers")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const sub = subscriber as Subscriber | null;
  const hasActiveSubscription =
    sub && (sub.status === "active" || sub.status === "past_due");

  return (
    <section className="px-12 py-20 max-w-2xl mx-auto max-md:px-6">
      <Suspense>
        <AccountNotice />
      </Suspense>

      <div className="mb-12">
        <div className="font-label text-[0.65rem] tracking-[0.25em] uppercase text-amber mb-3">
          Account
        </div>
        <h1 className="font-display text-[2.5rem] font-light text-cream leading-none">
          Your Account
        </h1>
      </div>

      {/* Profile */}
      <div className="bg-bg-surface border border-border p-8 mb-6">
        <h2 className="font-label text-[0.65rem] tracking-[0.2em] uppercase text-cream-dim mb-4">
          Profile
        </h2>
        <p className="text-cream font-body">{user.email}</p>
      </div>

      {/* Subscription */}
      <div className="bg-bg-surface border border-border p-8 mb-6">
        <h2 className="font-label text-[0.65rem] tracking-[0.2em] uppercase text-cream-dim mb-4">
          Subscription
        </h2>

        {sub ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-display text-[1.5rem] font-light text-cream leading-none mb-1">
                  {PLAN_LABELS[sub.plan] ?? sub.plan}
                </div>
                <div className="text-[0.8rem] text-cream-dim font-body">
                  {sub.plan === "descender" ? "$8 / month" : sub.plan === "patron" ? "$25 / month" : "Free"}
                </div>
              </div>
              <span
                className={`font-label text-[0.62rem] tracking-[0.15em] uppercase px-3 py-1.5 ${
                  STATUS_STYLES[sub.status] ?? "text-cream-dim"
                }`}
              >
                {sub.status.replace("_", " ")}
              </span>
            </div>

            {sub.current_period_end && (
              <p className="text-[0.82rem] text-cream-dim font-body border-t border-border pt-4">
                {sub.status === "canceled"
                  ? `Access until ${new Date(sub.current_period_end).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`
                  : `Renews ${new Date(sub.current_period_end).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`}
              </p>
            )}

            {sub.status === "past_due" && (
              <p className="text-[0.82rem] text-[#e07070] font-body bg-[rgba(224,112,112,0.06)] border border-[rgba(224,112,112,0.2)] px-4 py-3">
                Your payment is past due. Please update your payment method to
                retain access.
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-[0.88rem] text-cream-dim font-body leading-[1.7]">
              You don&apos;t have an active subscription. Subscribe to access gated
              episodes, field notes, and archive materials.
            </p>
            <Link
              href="/subscribe"
              className="inline-block bg-amber text-bg-deep font-label text-[0.72rem] font-semibold tracking-[0.18em] uppercase px-6 py-3 no-underline transition-opacity hover:opacity-80 w-fit"
            >
              View Plans
            </Link>
          </div>
        )}
      </div>

      {/* Manage via Stripe */}
      {hasActiveSubscription && sub?.stripe_customer_id && (
        <div className="bg-bg-surface border border-border p-8 mb-6">
          <h2 className="font-label text-[0.65rem] tracking-[0.2em] uppercase text-cream-dim mb-4">
            Manage Billing
          </h2>
          <p className="text-[0.85rem] text-cream-dim font-body mb-4 leading-[1.7]">
            Update payment methods, view invoices, or cancel your subscription
            through the Stripe billing portal.
          </p>
          <a
            href="/api/billing-portal"
            className="inline-block bg-transparent border border-border text-cream-dim font-label text-[0.7rem] tracking-[0.15em] uppercase px-5 py-2.5 no-underline transition-colors hover:border-amber hover:text-amber"
          >
            Open Billing Portal
          </a>
        </div>
      )}

      {/* Sign out */}
      <div className="flex justify-end">
        <a
          href="/api/auth/signout"
          className="font-label text-[0.65rem] tracking-[0.15em] uppercase text-cream-dim hover:text-cream transition-colors"
        >
          Sign Out
        </a>
      </div>
    </section>
  );
}
