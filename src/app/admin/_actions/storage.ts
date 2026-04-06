"use server";

import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Generates a signed upload URL for the private `audio` bucket.
 * The browser can PUT the file directly to `signedUrl` — it never
 * passes through Vercel, so there is no 4.5 MB serverless body limit.
 */
export async function createSignedAudioUploadUrl(filename: string) {
  const supabase = createAdminClient();
  const ext = filename.split(".").pop() ?? "mp3";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { data, error } = await supabase.storage.from("audio").createSignedUploadUrl(path);
  if (error) throw new Error(error.message);
  const publicUrl = supabase.storage.from("audio").getPublicUrl(path).data.publicUrl;
  return { signedUrl: data.signedUrl, path, publicUrl };
}

/**
 * Generates a signed upload URL for the private `archive` bucket.
 * Returns the storage path (used as `file_path` in archive_items).
 */
export async function createSignedArchiveUploadUrl(filename: string) {
  const supabase = createAdminClient();
  const ext = filename.split(".").pop() ?? "bin";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { data, error } = await supabase.storage.from("archive").createSignedUploadUrl(path);
  if (error) throw new Error(error.message);
  return { signedUrl: data.signedUrl, path };
}
