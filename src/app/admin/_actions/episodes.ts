"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { uploadImage } from "@/lib/supabase/uploadImage";

async function resolveImageUrl(formData: FormData): Promise<string | null> {
  const file = formData.get("image_file") as File | null;
  if (file && file.size > 0) return uploadImage(file, "episodes");
  return (formData.get("image_url") as string) || null;
}

export async function createEpisode(formData: FormData) {
  const supabase = createAdminClient();

  const audio_url = (formData.get("audio_url") as string) || null;

  const { error } = await supabase.from("episodes").insert({
    season_id: formData.get("season_id") as string,
    slug: formData.get("slug") as string,
    number: Number(formData.get("number")),
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || null,
    duration: (formData.get("duration") as string) || null,
    audio_url,
    peaks_json_url: (formData.get("peaks_json_url") as string) || null,
    image_url: await resolveImageUrl(formData),
    visibility: formData.get("visibility") as string,
    published_at: (formData.get("published_at") as string) || null,
  });
  if (error) redirect(`/admin/episodes?error=${encodeURIComponent(error.message)}`);
  redirect("/admin/episodes?success=Episode+created");
}

export async function updateEpisode(formData: FormData) {
  const supabase = createAdminClient();
  const id = formData.get("id") as string;

  const audio_url = (formData.get("audio_url") as string) || null;

  const { error } = await supabase
    .from("episodes")
    .update({
      season_id: formData.get("season_id") as string,
      slug: formData.get("slug") as string,
      number: Number(formData.get("number")),
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || null,
      duration: (formData.get("duration") as string) || null,
      audio_url,
      peaks_json_url: (formData.get("peaks_json_url") as string) || null,
      image_url: await resolveImageUrl(formData),
      visibility: formData.get("visibility") as string,
      published_at: (formData.get("published_at") as string) || null,
    })
    .eq("id", id);
  if (error) redirect(`/admin/episodes/${id}?error=${encodeURIComponent(error.message)}`);
  redirect(`/admin/episodes/${id}?success=Episode+saved`);
}

export async function deleteEpisode(formData: FormData) {
  const supabase = createAdminClient();
  const id = formData.get("id") as string;
  const { error } = await supabase.from("episodes").delete().eq("id", id);
  if (error) redirect(`/admin/episodes?error=${encodeURIComponent(error.message)}`);
  redirect("/admin/episodes?success=Episode+deleted");
}
