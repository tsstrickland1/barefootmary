"use client";

import { useState } from "react";

interface DeleteButtonProps {
  id: string;
  deleteAction: (formData: FormData) => Promise<void>;
}

export function DeleteButton({ id, deleteAction }: DeleteButtonProps) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="font-label text-[0.75rem] tracking-[0.1em] uppercase text-cream-dim">
          Sure?
        </span>
        <form action={deleteAction} className="flex items-center">
          <input type="hidden" name="id" value={id} />
          <button
            type="submit"
            className="font-label text-[0.75rem] tracking-[0.15em] uppercase text-[#e07070] hover:text-cream transition-colors"
          >
            Yes
          </button>
        </form>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="font-label text-[0.75rem] tracking-[0.15em] uppercase text-cream-dim hover:text-cream transition-colors"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="font-label text-[0.75rem] tracking-[0.15em] uppercase text-[#e07070] hover:text-cream transition-colors"
    >
      Delete
    </button>
  );
}
