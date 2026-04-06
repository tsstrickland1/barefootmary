"use client";

import { useRef, useState } from "react";

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
 *                    action retains it when no new file is uploaded.
 *                    Set to "" when the user clicks Clear.
 */
export function ArchiveFileUploadField({ currentPath }: ArchiveFileUploadFieldProps) {
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [sentPath, setSentPath] = useState<string>(currentPath ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  const displayName = selectedName ?? (sentPath || null);

  function handleClear() {
    if (inputRef.current) inputRef.current.value = "";
    setSelectedName(null);
    setSentPath("");
  }

  return (
    <div className="flex flex-col gap-2">
      {displayName && (
        <div className="flex items-center gap-3">
          <p className="font-label text-[0.7rem] tracking-[0.1em] text-cream-dim truncate">
            {displayName}
          </p>
          <button
            type="button"
            onClick={handleClear}
            className="font-label text-[0.6rem] tracking-[0.15em] uppercase text-[#e07070] hover:opacity-80 transition-opacity shrink-0"
          >
            Clear
          </button>
        </div>
      )}
      {/* Preserve existing path so the action keeps it when no new file is chosen.
          Cleared to "" when the user removes the file. */}
      <input type="hidden" name="file_path" value={sentPath} />
      <input
        ref={inputRef}
        type="file"
        name="archive_file"
        accept="application/pdf,image/*,audio/*,text/*"
        className="form-input"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setSelectedName(file.name);
            setSentPath("");
          }
        }}
      />
      <span className="text-[0.75rem] text-cream-dim font-body">
        Type detected automatically from the file
      </span>
    </div>
  );
}
