import Image from "next/image";
import Link from "next/link";

const footerColumns = [
  {
    title: "Listen",
    links: [
      { href: "/episodes", label: "Episodes" },
      { href: "#", label: "Apple Podcasts" },
      { href: "#", label: "Spotify" },
      { href: "#", label: "RSS Feed" },
    ],
  },
  {
    title: "Explore",
    links: [
      { href: "/field-notes", label: "Field Notes" },
      { href: "/archive", label: "The Archive" },
      { href: "/about", label: "About the Show" },
      { href: "/share-your-story", label: "Share Your Story" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/subscribe", label: "Subscribe" },
      { href: "#", label: "WUWF Membership" },
      { href: "#", label: "Contact" },
      { href: "#", label: "Press" },
    ],
  },
];

export function Footer() {
  return (
    <>
      <footer className="px-12 pt-16 pb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-12 border-t border-border">
        <div>
          <div className="font-display text-[1.35rem] font-semibold text-amber tracking-[0.06em] mb-3">
            Barefoot Mary
          </div>
          <p className="font-body text-[0.82rem] italic text-cream-dim leading-[1.75] max-w-[240px] mb-4">
            An investigative history podcast rooted in Pensacola and the wider
            Gulf Coast, produced at WUWF.
          </p>
          <div className="font-label text-[0.6rem] tracking-[0.2em] uppercase text-cream-dim flex items-center gap-2">
            <span className="block w-[18px] h-px bg-amber-dim" />
            A production of WUWF · NPR Northwest Florida
          </div>
        </div>

        {footerColumns.map((col) => (
          <div key={col.title}>
            <div className="font-label text-[0.62rem] font-semibold tracking-[0.22em] uppercase text-amber mb-4">
              {col.title}
            </div>
            <ul className="list-none flex flex-col gap-[0.45rem]">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-label text-[0.78rem] text-cream-dim no-underline transition-colors duration-200 hover:text-cream"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </footer>

      {/* WUWF partnership strip */}
      <div className="mx-12 mb-6 border border-border px-8 py-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="shrink-0">
          <Image src="/wuwf-logo.svg" alt="WUWF 88.1 Public Media" width={100} height={38} className="opacity-90" />
        </div>
        <p className="font-body text-[0.78rem] italic text-cream-dim leading-[1.7]">
          <span className="not-italic font-semibold text-cream">A production of WUWF 88.1.</span>{" "}
          Barefoot Mary is produced in partnership with WUWF Public Media at the University of West Florida, NPR for Florida&rsquo;s Great Northwest.
        </p>
        <a
          href="https://wuwf.org"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 font-label text-[0.62rem] tracking-[0.15em] uppercase text-amber no-underline hover:text-amber-light transition-colors duration-200 whitespace-nowrap"
        >
          WUWF.ORG ↗
        </a>
      </div>

      <div className="px-12 py-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="font-label text-[0.62rem] tracking-[0.1em] text-[rgba(158,146,120,0.55)]">
          © {new Date().getFullYear()} Barefoot Mary · All rights reserved
        </div>
        <div className="flex gap-6">
          {["Privacy", "Terms", "Accessibility"].map((item) => (
            <Link
              key={item}
              href="#"
              className="font-label text-[0.62rem] tracking-[0.08em] text-[rgba(158,146,120,0.55)] no-underline transition-colors duration-200 hover:text-cream-dim"
            >
              {item}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
