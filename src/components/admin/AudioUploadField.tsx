"use client";

import { useState } from "react";

interface AudioUploadFieldProps {
  /** Existing public URL shown as a filename hint (edit forms only). */
  currentUrl?: string | null;
}

/**
 * File-upload input for episode audio. Renders a filename hint for the current
 * audio (when editing) and a file picker for selecting a replacement.
 *
 * Emits two form fields:
 *   - audio_file — the selected File (empty when no new file chosen)
 *   - audio_url  — the current URL preserved as a hidden field so server
 *                  actions can retain it when no new file is uploaded
 */
export function AudioUploadField({ currentUrl }: AudioUploadFieldProps) {
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const displayName = selectedName ?? (currentUrl ? currentUrl.split("/").pop() : null);

  return (
    <div className="flex flex-col gap-2">
      {displayName && (
        <p className="font-label text-[0.7rem] tracking-[0.1em] text-cream-dim truncate">
          {displayName}
        </p>
      )}
      {/* Preserve existing URL so the action can keep it when no new file is chosen */}
      <input type="hidden" name="audio_url" value={currentUrl ?? ""} />
      <input
        type="file"
        name="audio_file"
        accept="audio/*"
        className="form-input"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) setSelectedName(file.name);
        }}
      />
    </div>
  );
}
