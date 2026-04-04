import { SectionHeader } from "@/components/ui/SectionHeader";
import { StoryForm } from "@/components/share-your-story/StoryForm";

export const metadata = {
  title: "Share Your Story — Barefoot Mary",
  description: "Submit your oral history or local legend to Barefoot Mary.",
};

export default function ShareYourStoryPage() {
  return (
    <section className="px-12 py-20 max-md:px-6 max-md:py-12">
      <SectionHeader label="Oral History Contribution" title="Share Your Story" />

      <div className="bg-bg-surface border border-border p-14 grid grid-cols-1 md:grid-cols-2 gap-16 items-start max-md:p-6">
        <div>
          <div className="font-display text-[2.6rem] font-light italic text-cream leading-[1.1] mb-3.5 max-md:text-[2rem]">
            Have you heard the stories?
          </div>
          <p className="text-[0.87rem] text-cream-dim leading-[1.88] mb-8 font-body">
            Barefoot Mary is built on the belief that the best history lives in
            living memory. If you have a story about Pensacola&apos;s tunnels—or
            any Gulf Coast legend—we want to hear it. Record directly in your
            browser, or upload a file. All submissions are reviewed before use,
            and you choose how you&apos;re credited.
          </p>

          <StoryForm />
        </div>

        {/* Visual column */}
        <div className="flex flex-col items-center justify-center gap-8 p-12 border border-border bg-bg-deep text-center min-h-[340px]">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <span className="absolute w-20 h-20 rounded-full border border-amber-dim opacity-50" />
            <span className="absolute w-[54px] h-[54px] rounded-full border border-amber-dim opacity-70" />
            <div className="w-9 h-9 rounded-full bg-[rgba(196,154,60,0.08)] flex items-center justify-center border border-amber-dim relative z-10">
              <div className="w-3.5 h-5 bg-amber rounded-t-full relative">
                <span className="absolute bottom-[-7px] left-1/2 -translate-x-1/2 w-px h-[7px] bg-amber" />
              </div>
            </div>
          </div>
          <p className="font-display text-[1.05rem] italic text-cream-dim leading-[1.55] max-w-[200px]">
            &ldquo;Every legend begins as someone&apos;s story.&rdquo;
          </p>
          <div className="font-label text-[0.6rem] tracking-[0.18em] uppercase text-[rgba(158,146,120,0.5)]">
            Stories received: 47
          </div>
        </div>
      </div>
    </section>
  );
}
