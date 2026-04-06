"use client";

import { useRef, useState } from "react";
import { createSignedArchiveUploadUrl } from "@/app/admin/_actions/storage";

function mimeToType(mime: string): string {
  if (mime === "application/pdf") return "pdf";
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("audio/")) return "audio";
  return "transcript";
}

interface ArchiveFileUploadFieldProps {
  currentPath?: string | null;
  currentType?: string | null;
}

/**
 * Uploads archive files directly from the browser to Supabase Storage via a
 * signed URL, bypassing Vercel's 4.5 MB serverless body limit.
 *
 * The file input has no `name` so it is never submitted in the form.
 * Hidden fields `file_path` and `type` carry the result to the server action.
 */
export function ArchiveFileUploadField({ currentPath, currentType }: ArchiveFileUploadFieldProps) {
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [filePath, setFilePath] = useState<string | null>(currentPath ?? null);
  const [fileType, setFileType] = useState<string | null>(currentType ?? null);
  const [displayName, setDisplayName] = useState<string | null>(currentPath ?? null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleClear() {
    if (inputRef.current) inputRef.current.value = "";
    setFilePath(null);
    setFileType(null);
    setDisplayName(null);
    setStatus("idle");
  }

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus("uploading");
    try {
      const { signedUrl, path } = await createSignedArchiveUploadUrl(file.name);
      const res = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });
      if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
      setFilePath(path);
      setFileType(mimeToType(file.type));
      setDisplayName(file.name);
      setStatus("done");
    } catch (err) {
      console.error("Archive upload error:", err);
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {displayName && (
        <div className="flex items-center gap-3">
          <p className="font-label text-[0.7rem] tracking-[0.1em] text-cream-dim truncate">
            {status === "uploading" ? "Uploading…" : displayName}
          </p>
          {status !== "uploading" && (
            <button
              type="button"
              onClick={handleClear}
              className="font-label text-[0.6rem] tracking-[0.15em] uppercase text-[#e07070] hover:opacity-80 transition-opacity shrink-0"
            >
              Clear
            </button>
          )}
        </div>
      )}
      <input type="hidden" name="file_path" value={filePath ?? ""} />
      <input type="hidden" name="type" value={fileType ?? ""} />
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,image/*,audio/*,text/*"
        className="form-input"
        onChange={handleChange}
        disabled={status === "uploading"}
      />
      {status === "error" && (
        <p className="text-[0.75rem] text-red-400">Upload failed. Please try again.</p>
      )}
      <span className="text-[0.75rem] text-cream-dim font-body">
        Type detected automatically from the file
      </span>
    </div>
  );
}
