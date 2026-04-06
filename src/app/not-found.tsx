import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="font-display text-[clamp(8rem,20vw,16rem)] font-light leading-none text-[rgba(196,154,60,0.12)] select-none">
          404
        </div>
        <div className="font-label text-[0.67rem] font-semibold tracking-[0.28em] uppercase text-amber mb-3 -mt-6">
          Page Not Found
        </div>
        <h1 className="font-display text-[clamp(1.5rem,3vw,2.2rem)] font-light italic text-cream leading-[1.15] mb-4 max-w-lg">
          This record does not appear in the archive.
        </h1>
        <p className="font-body text-[0.88rem] text-cream-dim italic leading-[1.85] max-w-md mb-10">
          The document you are looking for may have been moved, removed, or never
          filed here to begin with.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link
            href="/"
            className="inline-block bg-amber text-bg-deep py-3 px-8 font-label text-[0.72rem] font-semibold tracking-[0.18em] uppercase no-underline transition-colors duration-200 hover:bg-amber-light"
          >
            Return Home
          </Link>
          <Link
            href="/archive"
            className="inline-block border border-border text-cream-dim py-3 px-8 font-label text-[0.72rem] font-semibold tracking-[0.18em] uppercase no-underline transition-colors duration-200 hover:text-cream hover:border-amber-dim"
          >
            Browse the Archive
          </Link>
        </div>
    </main>
  );
}
