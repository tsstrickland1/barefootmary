"use client";

import { useState } from "react";

interface ArchiveFileUploadFieldProps {
  /** Existing storage path shown as the current filename (edit forms only). */
  currentPath?: string | null;
}

/**
 * File-upload input for archive items. Renders the current storage path as
 * a filename hint (edit forms) and a file picker accepting all archive types.
 *
 * Emits two form fields:
 *   - archive_file — the selected File (empty when no new file chosen)
 *   - file_path    — hidden field preserving the current path so the server
 *                    action retains it when no new file is uploaded
 */
export function ArchiveFileUploadField({ currentPath }: ArchiveFileUploadFieldProps) {
  const [selectedName, setSelectedName] = useState<string | null>(null);

  const displayName = selectedName ?? currentPath ?? null;

  return (
    <div className="flex flex-col gap-2">
      {displayName && (
        <p className="font-label text-[0.7rem] tracking-[0.1em] text-cream-dim truncate">
          {displayName}
        </p>
      )}
      {/* Preserve existing path so the action keeps it when no new file is chosen */}
      <input type="hidden" name="file_path" value={currentPath ?? ""} />
      <input
        type="file"
        name="archive_file"
        accept="application/pdf,image/*,audio/*,text/*"
        className="form-input"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) setSelectedName(file.name);
        }}
      />
      <span className="text-[0.75rem] text-cream-dim font-body">
        Type detected automatically from the file
      </span>
    </div>
  );
}
