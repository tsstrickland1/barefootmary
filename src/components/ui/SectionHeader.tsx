export function SectionHeader({
  label,
  title,
  linkText,
  linkHref,
}: {
  label: string;
  title: string;
  linkText?: string;
  linkHref?: string;
}) {
  return (
    <div className="flex items-baseline justify-between mb-12 pb-4 border-b border-rule">
      <div>
        <div className="font-label text-[0.67rem] font-semibold tracking-[0.24em] uppercase text-amber mb-1">
          {label}
        </div>
        <div className="font-display text-[clamp(2rem,4vw,3rem)] font-light italic text-cream leading-[1.05]">
          {title}
        </div>
      </div>
      {linkText && linkHref && (
        <a
          href={linkHref}
          className="font-label text-[0.67rem] tracking-[0.18em] uppercase text-cream-dim no-underline border-b border-border pb-[2px] transition-colors duration-200 hover:text-amber hover:border-amber-dim whitespace-nowrap"
        >
          {linkText}
        </a>
      )}
    </div>
  );
}
