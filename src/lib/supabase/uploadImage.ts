import { createAdminClient } from "./admin";

/**
 * Uploads an image file to the public `images` storage bucket and returns its
 * public URL. Uses the service role client, so this must only be called from
 * authenticated server actions.
 *
 * @param file   The image File from FormData.
 * @param folder A path prefix (e.g. "seasons", "episodes", "articles").
 */
export async function uploadImage(file: File, folder: string): Promise<string> {
  const supabase = createAdminClient();
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from("images")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) throw new Error(`Image upload failed: ${error.message}`);

  const { data } = supabase.storage.from("images").getPublicUrl(path);
  return data.publicUrl;
}
