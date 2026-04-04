interface AdminFormFieldProps {
  label: string;
  name: string;
  children: React.ReactNode;
  hint?: string;
}

export function AdminFormField({
  label,
  name,
  children,
  hint,
}: AdminFormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={name}
        className="font-label text-[0.65rem] tracking-[0.18em] uppercase text-cream-dim"
      >
        {label}
      </label>
      {children}
      {hint && (
        <span className="text-[0.75rem] text-cream-dim font-body">{hint}</span>
      )}
    </div>
  );
}
