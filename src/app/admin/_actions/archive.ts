"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

export async function createArchiveItem(formData: FormData) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("archive_items").insert({
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || null,
    type: formData.get("type") as string,
    file_path: formData.get("file_path") as string,
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
  const { error } = await supabase
    .from("archive_items")
    .update({
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || null,
      type: formData.get("type") as string,
      file_path: formData.get("file_path") as string,
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
