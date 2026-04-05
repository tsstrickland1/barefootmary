"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { uploadArchiveFile } from "@/lib/supabase/uploadArchiveFile";
import type { ArchiveType } from "@/types/database";

function mimeToArchiveType(mimeType: string): ArchiveType {
  if (mimeType === "application/pdf") return "pdf";
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("audio/")) return "audio";
  // text/plain, text/markdown, and similar text formats
  if (mimeType.startsWith("text/")) return "transcript";
  throw new Error(`Unsupported file type: ${mimeType}`);
}

type Resolved = { file_path: string; type: ArchiveType };

async function resolveFileAndType(formData: FormData): Promise<Resolved> {
  const file = formData.get("archive_file") as File | null;
  if (file && file.size > 0) {
    return {
      file_path: await uploadArchiveFile(file),
      type: mimeToArchiveType(file.type),
    };
  }
  const file_path = (formData.get("file_path") as string) || "";
  const type = (formData.get("type") as ArchiveType) || null;
  if (!file_path || !type) throw new Error("A file is required");
  return { file_path, type };
}

export async function createArchiveItem(formData: FormData) {
  const supabase = createAdminClient();
  const { file_path, type } = await resolveFileAndType(formData);
  const { error } = await supabase.from("archive_items").insert({
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || null,
    type,
    file_path,
    visibility: formData.get("visibility") as string,
    episode_id: (formData.get("episode_id") as string) || null,
    season_id: (formData.get("season_id") as string) || null,
    article_id: (formData.get("article_id") as string) || null,
  });
  if (error) redirect(`/admin/archive?error=${encodeURIComponent(error.message)}`);
  redirect("/admin/archive?success=Archive+item+created");
}

export async function updateArchiveItem(formData: FormData) {
  const supabase = createAdminClient();
  const id = formData.get("id") as string;
  const { file_path, type } = await resolveFileAndType(formData);
  const { error } = await supabase
    .from("archive_items")
    .update({
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || null,
      type,
      file_path,
      visibility: formData.get("visibility") as string,
      episode_id: (formData.get("episode_id") as string) || null,
      season_id: (formData.get("season_id") as string) || null,
      article_id: (formData.get("article_id") as string) || null,
    })
    .eq("id", id);
  if (error) redirect(`/admin/archive/${id}?error=${encodeURIComponent(error.message)}`);
  redirect(`/admin/archive/${id}?success=Archive+item+saved`);
}

export async function deleteArchiveItem(formData: FormData) {
  const supabase = createAdminClient();
  const id = formData.get("id") as string;
  const { error } = await supabase.from("archive_items").delete().eq("id", id);
  if (error) redirect(`/admin/archive?error=${encodeURIComponent(error.message)}`);
  redirect("/admin/archive?success=Archive+item+deleted");
}
