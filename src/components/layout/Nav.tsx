import Image from "next/image";
import Link from "next/link";

export function Nav() {
  return (
    <nav className="sticky top-0 z-100 flex items-center justify-between px-12 py-5 bg-[rgba(14,12,10,0.94)] backdrop-blur-[10px] border-b border-border">
      <Link href="/" className="no-underline">
        <Image src="/logo.svg" alt="Barefoot Mary" width={130} height={35} priority />
      </Link>

      <ul className="hidden md:flex gap-10 list-none">
        {[
          { href: "/episodes", label: "Episodes" },
          { href: "/field-notes", label: "Field Notes" },
          { href: "/archive", label: "The Archive" },
          { href: "/share-your-story", label: "Share Your Story" },
          { href: "/about", label: "About" },
        ].map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="font-label text-[0.76rem] font-medium tracking-[0.2em] uppercase text-cream-dim no-underline transition-colors duration-200 hover:text-cream"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href="/subscribe"
        className="font-label text-[0.7rem] font-semibold tracking-[0.18em] uppercase text-bg-deep bg-amber px-5 py-2 no-underline transition-colors duration-200 hover:bg-amber-light whitespace-nowrap"
      >
        Join the Descent
      </Link>
    </nav>
  );
}
