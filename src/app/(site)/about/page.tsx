import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata = {
  title: "About — Barefoot Mary",
  description:
    "About the show, the SPOT methodology, and the team behind Barefoot Mary.",
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
                Barefoot Mary is an investigative history podcast that examines
                the half-remembered events, overlooked histories, and persistent
                local legends of Pensacola and the wider Gulf Coast. Each season
                takes a single thread of local folklore and follows it through
                archives, oral histories, and the landscapes where these stories
                live.
              </p>
              <p>
                The show is produced at WUWF, the NPR affiliate for Northwest
                Florida, and hosted by T.S. Strickland.
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-display text-[1.8rem] font-light italic text-cream mb-4">
              The SPOT Methodology
            </h2>
            <div className="text-[0.92rem] text-cream-dim leading-[1.95] font-body space-y-4">
              <p>
                SPOT stands for <strong className="text-cream font-normal">Site, People, Object, Text</strong>—the
                four lenses through which every investigation proceeds. Each
                episode visits a specific site, speaks to the people connected to
                it, examines the material objects that survive, and reads the
                texts (maps, deeds, letters, newspaper clippings) that document
                its history. This four-part framework ensures that no single
                source dominates the narrative.
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
              WUWF Partnership
            </h2>
            <div className="text-[0.92rem] text-cream-dim leading-[1.95] font-body space-y-4">
              <p>
                Barefoot Mary is produced in partnership with WUWF 88.1 FM, the
                NPR member station for Northwest Florida, licensed to the
                University of West Florida. WUWF provides editorial support,
                studio facilities, and distribution infrastructure.
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
