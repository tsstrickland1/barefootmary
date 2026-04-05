import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata = {
  title: "About — Barefoot Mary",
  description:
    "About Barefoot Mary, an investigative history podcast rooted in Pensacola and the wider Gulf Coast.",
};

export default function AboutPage() {
  return (
    <section className="px-12 py-20 max-md:px-6 max-md:py-12">
      <SectionHeader label="The Show" title="About Barefoot Mary" />

      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-16">
        {/* Main content */}
        <div className="space-y-10">
          <div>
            <h2 className="font-display text-[1.8rem] font-light italic text-cream mb-4">
              What is Barefoot Mary?
            </h2>
            <div className="text-[0.92rem] text-cream-dim leading-[1.95] font-body space-y-4">
              <p>
                Barefoot Mary is an investigative history podcast rooted in
                Pensacola and the wider Gulf Coast. It takes its name from Mary
                "Barefoot Mary" Thorsen, a waterfront fixture in the late 19th
                and early 20th centuries who became known—according to local
                legend—as a keeper of the city's secrets.
              </p>
              <p>
                Mary occupied a liminal space between respectability and rumor.
                Stories cast her as a figure who moved through Pensacola's
                red-light district, observing the powerful and trading in
                discretion. When she died, her passing was marked in the
                newspapers and memorialized in verse, fixing her in the city's
                oral memory as someone who bridged official history and whispered
                story.
              </p>
              <p>
                The podcast adopts this same stance. Barefoot Mary examines the
                half-remembered events, overlooked histories, and persistent
                local legends that shape how communities understand themselves.
                Each season focuses on a single theme and unfolds across multiple
                episodes, combining investigative reporting, archival research,
                oral history, and cultural analysis—not to debunk for its own
                sake, but to understand why certain stories endure, even when
                certainty does not.
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-display text-[1.8rem] font-light italic text-cream mb-4">
              About the Host
            </h2>
            <div className="text-[0.92rem] text-cream-dim leading-[1.95] font-body space-y-4">
              <p>
                T.S. Strickland is a writer, researcher, and oral historian
                based in Pensacola, Florida. His work sits at the intersection
                of public history, folklore studies, and investigative
                journalism—listening for the stories that official records leave
                out and asking what those stories do for the communities that
                keep telling them.
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-display text-[1.8rem] font-light italic text-cream mb-4">
              A Production of WUWF
            </h2>
            <div className="text-[0.92rem] text-cream-dim leading-[1.95] font-body space-y-4">
              <p>
                Barefoot Mary is a production of WUWF 88.1 FM, the NPR member
                station for Northwest Florida, licensed to the University of West
                Florida.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-bg-surface border border-border p-8">
            <div className="font-label text-[0.62rem] font-semibold tracking-[0.22em] uppercase text-amber mb-4">
              Contact & Press
            </div>
            <div className="text-[0.85rem] text-cream-dim leading-[1.85] font-body space-y-3">
              <p>
                For press inquiries, collaboration proposals, or general
                questions, reach out via email.
              </p>
              <a
                href="mailto:hello@barefootmary.com"
                className="font-label text-[0.72rem] tracking-[0.1em] text-amber no-underline hover:text-amber-light transition-colors duration-200"
              >
                hello@barefootmary.com
              </a>
            </div>
          </div>

          <div className="bg-bg-surface border border-border p-8">
            <div className="font-label text-[0.62rem] font-semibold tracking-[0.22em] uppercase text-amber mb-4">
              Support the Show
            </div>
            <p className="text-[0.85rem] text-cream-dim leading-[1.85] font-body mb-4">
              Barefoot Mary is listener-supported. Subscribers get access to
              gated episodes, the full Archive, and extended Field Notes.
            </p>
            <Link
              href="/subscribe"
              className="inline-block bg-amber text-bg-deep py-2.5 px-6 font-label text-[0.68rem] font-semibold tracking-[0.15em] uppercase no-underline transition-colors duration-200 hover:bg-amber-light"
            >
              Subscribe
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
