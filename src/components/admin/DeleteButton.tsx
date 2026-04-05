"use client";

interface DeleteButtonProps {
  id: string;
  deleteAction: (formData: FormData) => Promise<void>;
}

export function DeleteButton({ id, deleteAction }: DeleteButtonProps) {
  return (
    <form
      action={deleteAction}
      onSubmit={(e) => {
        if (!confirm("Delete this item? This cannot be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="font-label text-[0.65rem] tracking-[0.15em] uppercase text-[#e07070] hover:text-cream transition-colors"
      >
        Delete
      </button>
    </form>
  );
}
