"use client";

import { useRef, useState } from "react";

interface ImageUploadFieldProps {
  /** Existing storage URL shown as a preview (edit forms only). */
  currentUrl?: string | null;
}

/**
 * File-upload input for featured images. Renders a preview of the current image
 * (when editing) and a file picker for selecting a replacement.
 *
 * Emits two form fields:
 *   - image_file  — the selected File (empty when no new file chosen)
 *   - image_url   — the current URL preserved as a hidden field so server
 *                   actions can retain it when no new file is uploaded.
 *                   Set to "" when the user clicks Clear.
 */
export function ImageUploadField({ currentUrl }: ImageUploadFieldProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [sentUrl, setSentUrl] = useState<string>(currentUrl ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleClear() {
    if (inputRef.current) inputRef.current.value = "";
    setPreview(null);
    setSentUrl("");
  }

  return (
    <div className="flex flex-col gap-2">
      {preview && (
        <div className="flex items-start gap-3">
          <img
            src={preview}
            alt="Featured image preview"
            className="w-40 h-28 object-cover rounded-sm"
          />
          <button
            type="button"
            onClick={handleClear}
            className="font-label text-[0.6rem] tracking-[0.15em] uppercase text-[#e07070] hover:opacity-80 transition-opacity"
          >
            Clear
          </button>
        </div>
      )}
      {/* Preserve existing URL so the action can keep it when no new file is chosen.
          Cleared to "" when the user removes the image. */}
      <input type="hidden" name="image_url" value={sentUrl} />
      <input
        ref={inputRef}
        type="file"
        name="image_file"
        accept="image/*"
        className="form-input"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setPreview(URL.createObjectURL(file));
            setSentUrl("");
          }
        }}
      />
    </div>
  );
}
