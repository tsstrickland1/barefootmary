import Link from "next/link";

export const metadata = {
  title: "Subscribe — Barefoot Mary",
  description: "Join the Descent. Support investigative history.",
};

const tiers = [
  {
    label: "Free",
    price: "$0",
    features: [
      "First two episodes per season",
      "Free Field Notes articles",
      "Archive catalog preview",
      "Submit oral histories",
    ],
    cta: "Listen for Free",
    featured: false,
  },
  {
    label: "Descender",
    price: "$8",
    features: [
      "All episodes, all seasons",
      "Complete Field Notes archive",
      "Full Archive access",
      "Bonus content & research notes",
      "Early access to new seasons",
    ],
    cta: "Subscribe Now",
    featured: true,
  },
  {
    label: "Patron",
    price: "$25",
    features: [
      "Everything in Descender",
      "Credit in episode roll",
      "Quarterly SPOT session recordings",
      "Direct line to the host",
    ],
    cta: "Become a Patron",
    featured: false,
  },
];

export default function SubscribePage() {
  return (
    <section className="py-24 px-12 max-md:px-6">
      <div className="text-center flex flex-col items-center gap-6 mb-16">
        <div className="font-label text-[0.65rem] font-medium tracking-[0.28em] uppercase text-amber">
          Support the Work
        </div>
        <h1 className="font-display text-[clamp(2.5rem,6vw,4.75rem)] font-light text-cream leading-[1.02] max-w-[680px]">
          Join the <em className="italic text-amber">Descent</em>
        </h1>
        <p className="text-[0.9rem] text-cream-dim max-w-[460px] leading-[1.78] font-body italic">
          Subscriber support makes investigative history possible. Access gated
          episodes, deep-dive field notes, primary source documents, and
          extended oral history recordings.
        </p>
      </div>

      {/* Tier cards */}
      <div className="flex flex-wrap justify-center gap-px bg-border border border-border max-w-3xl mx-auto">
        {tiers.map((tier) => (
          <div
            key={tier.label}
            className={`p-10 flex flex-col gap-3 min-w-[210px] flex-1 text-left ${
              tier.featured
                ? "bg-bg-raised border-t-2 border-t-amber"
                : "bg-bg-deep"
            }`}
          >
            <div className="font-label text-[0.62rem] font-semibold tracking-[0.22em] uppercase text-amber">
              {tier.label}
            </div>
            <div className="font-display text-[2.5rem] font-light text-cream leading-none">
              {tier.price}{" "}
              <span className="text-[0.95rem] text-cream-dim font-label font-normal tracking-[0.08em]">
                / month
              </span>
            </div>
            <ul className="list-none flex flex-col gap-1.5 my-3">
              {tier.features.map((f) => (
                <li
                  key={f}
                  className="font-label text-[0.73rem] text-cream-dim flex items-center gap-2"
                >
                  <span className="w-[5px] h-px bg-amber shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              className={`block w-full py-3 px-4 text-center font-label text-[0.68rem] font-semibold tracking-[0.15em] uppercase cursor-pointer transition-all duration-200 mt-auto ${
                tier.featured
                  ? "bg-amber text-bg-deep border border-amber hover:bg-amber-light"
                  : "bg-transparent text-cream-dim border border-border hover:border-amber hover:text-amber"
              }`}
            >
              {tier.cta}
            </button>
          </div>
        ))}
      </div>

      {/* FAQ / Additional info */}
      <div className="max-w-2xl mx-auto mt-20 space-y-8">
        <h2 className="font-display text-[1.6rem] font-light italic text-cream text-center">
          Frequently Asked Questions
        </h2>

        {[
          {
            q: "Can I cancel anytime?",
            a: "Yes. You can cancel your subscription at any time through the Stripe Customer Portal. You'll retain access until the end of your current billing period.",
          },
          {
            q: "What payment methods do you accept?",
            a: "We accept all major credit cards through Stripe. Your payment information is never stored on our servers.",
          },
          {
            q: "Is there a yearly option?",
            a: "Not yet, but we're considering it. If you'd like an annual plan, let us know at hello@barefootmary.com.",
          },
          {
            q: "Can I gift a subscription?",
            a: "We'd love to support that. Contact us and we'll set it up manually while we build out the feature.",
          },
        ].map((faq) => (
          <div key={faq.q} className="border-b border-border pb-6">
            <h3 className="font-label text-[0.78rem] font-medium tracking-[0.08em] text-cream mb-2">
              {faq.q}
            </h3>
            <p className="text-[0.88rem] text-cream-dim leading-[1.78] font-body">
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
