"use client";

import { useState } from "react";

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
 *                   actions can retain it when no new file is uploaded
 */
export function ImageUploadField({ currentUrl }: ImageUploadFieldProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);

  return (
    <div className="flex flex-col gap-2">
      {preview && (
        <img
          src={preview}
          alt="Featured image preview"
          className="w-40 h-28 object-cover rounded-sm"
        />
      )}
      {/* Preserve existing URL so the action can keep it when no new file is chosen */}
      <input type="hidden" name="image_url" value={currentUrl ?? ""} />
      <input
        type="file"
        name="image_file"
        accept="image/*"
        className="form-input"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) setPreview(URL.createObjectURL(file));
        }}
      />
    </div>
  );
}
