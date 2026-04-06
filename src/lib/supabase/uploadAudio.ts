import { createAdminClient } from "./admin";

/**
 * Uploads an audio file to the private `audio` storage bucket and returns its
 * public URL. The bucket has a public-read RLS policy so the URL is directly
 * accessible without signing. Uses the service role client, so this must only
 * be called from authenticated server actions.
 *
 * @param file The audio File from FormData.
 */
export async function uploadAudio(file: File): Promise<string> {
  const supabase = createAdminClient();
  const ext = file.name.split(".").pop() ?? "mp3";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from("audio")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) throw new Error(`Audio upload failed: ${error.message}`);

  const { data } = supabase.storage.from("audio").getPublicUrl(path);
  return data.publicUrl;
}
