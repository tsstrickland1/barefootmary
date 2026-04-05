import { createAdminClient } from "./admin";

/**
 * Uploads a file to the private `archive` storage bucket and returns the
 * storage path (bucket-relative key). The path is stored in `archive_items.file_path`
 * and used by the RLS policies to gate access and generate signed URLs at
 * request time.
 *
 * Must only be called from authenticated server actions (uses service role key).
 */
export async function uploadArchiveFile(file: File): Promise<string> {
  const supabase = createAdminClient();
  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from("archive")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) throw new Error(`Archive upload failed: ${error.message}`);

  return path;
}
