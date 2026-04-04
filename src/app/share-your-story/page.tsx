import { SectionHeader } from "@/components/ui/SectionHeader";

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

          <form className="flex flex-col gap-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label className="font-label text-[0.62rem] font-medium tracking-[0.16em] uppercase text-amber">
                  Your Name
                </label>
                <input
                  className="form-input"
                  type="text"
                  name="name"
                  placeholder="How you'd like to be credited"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-label text-[0.62rem] font-medium tracking-[0.16em] uppercase text-amber">
                  Email (optional)
                </label>
                <input
                  className="form-input"
                  type="email"
                  name="email"
                  placeholder="For follow-up only"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label text-[0.62rem] font-medium tracking-[0.16em] uppercase text-amber">
                Briefly describe your story
              </label>
              <textarea
                className="form-input"
                name="description"
                placeholder="What will you tell us? Where does it take place?"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label text-[0.62rem] font-medium tracking-[0.16em] uppercase text-amber">
                Record Your Story
              </label>
              <button
                type="button"
                className="flex items-center justify-center gap-3.5 py-4 px-4 bg-bg-deep border border-dashed border-[rgba(196,154,60,0.35)] text-cream font-label text-[0.72rem] tracking-[0.18em] uppercase cursor-pointer transition-all duration-200 w-full hover:border-amber hover:bg-[rgba(196,154,60,0.03)]"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#c44c3c] shrink-0" />
                Record Now in Your Browser
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label text-[0.6rem] tracking-[0.06em] text-cream-dim">
                Or upload a file — .mp3, .wav, .m4a up to 100 MB
              </label>
              <input
                className="form-input italic text-[rgba(158,146,120,0.5)]"
                type="file"
                name="audio"
                accept=".mp3,.wav,.m4a"
              />
            </div>

            <button
              type="submit"
              className="bg-amber text-bg-deep border-none py-3.5 px-8 font-label text-[0.72rem] font-semibold tracking-[0.18em] uppercase cursor-pointer w-full transition-colors duration-200 hover:bg-amber-light mt-1"
            >
              Submit Your Story →
            </button>
            <p className="font-label text-[0.58rem] text-[rgba(158,146,120,0.55)] tracking-[0.06em] text-center">
              Submissions are reviewed before any use. Your privacy is respected.
              See our full consent policy.
            </p>
          </form>
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
