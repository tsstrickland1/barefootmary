"use client";

import { useState } from "react";
import { createSignedAudioUploadUrl } from "@/app/admin/_actions/storage";

interface AudioUploadFieldProps {
  currentUrl?: string | null;
}

/**
 * Uploads audio directly from the browser to Supabase Storage via a
 * signed URL, bypassing Vercel's 4.5 MB serverless body limit.
 *
 * The file input has no `name` so it is never submitted in the form.
 * The hidden `audio_url` field carries the resulting public URL to the
 * server action after the upload completes.
 */
export function AudioUploadField({ currentUrl }: AudioUploadFieldProps) {
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [audioUrl, setAudioUrl] = useState<string | null>(currentUrl ?? null);
  const [filename, setFilename] = useState<string | null>(
    currentUrl ? (currentUrl.split("/").pop() ?? null) : null
  );

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus("uploading");
    try {
      const { signedUrl, publicUrl } = await createSignedAudioUploadUrl(file.name);
      const res = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });
      if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
      setAudioUrl(publicUrl);
      setFilename(file.name);
      setStatus("done");
    } catch (err) {
      console.error("Audio upload error:", err);
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {filename && (
        <p className="font-label text-[0.7rem] tracking-[0.1em] text-cream-dim truncate">
          {status === "uploading" ? "Uploading…" : filename}
        </p>
      )}
      <input type="hidden" name="audio_url" value={audioUrl ?? ""} />
      <input
        type="file"
        accept="audio/*"
        className="form-input"
        onChange={handleChange}
        disabled={status === "uploading"}
      />
      {status === "error" && (
        <p className="text-[0.75rem] text-red-400">Upload failed. Please try again.</p>
      )}
    </div>
  );
}
