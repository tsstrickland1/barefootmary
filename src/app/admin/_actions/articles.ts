"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { uploadImage } from "@/lib/supabase/uploadImage";

async function resolveImageUrl(formData: FormData): Promise<string | null> {
  const file = formData.get("image_file") as File | null;
  if (file && file.size > 0) return uploadImage(file, "articles");
  return (formData.get("image_url") as string) || null;
}

export async function createArticle(formData: FormData) {
  const supabase = createAdminClient();
  const bodyRaw = formData.get("body_json") as string;
  const body_json = bodyRaw ? JSON.parse(bodyRaw) : null;

  const { error } = await supabase.from("articles").insert({
    slug: formData.get("slug") as string,
    title: formData.get("title") as string,
    excerpt: (formData.get("excerpt") as string) || null,
    body_json,
    tag: formData.get("tag") as string,
    visibility: formData.get("visibility") as string,
    author: (formData.get("author") as string) || "T.S. Strickland",
    featured: formData.get("featured") === "true",
    image_url: await resolveImageUrl(formData),
    published_at: (formData.get("published_at") as string) || null,
    season_id: (formData.get("season_id") as string) || null,
  });
  if (error) throw new Error(error.message);
  redirect("/admin/articles");
}

export async function updateArticle(formData: FormData) {
  const supabase = createAdminClient();
  const id = formData.get("id") as string;
  const bodyRaw = formData.get("body_json") as string;
  const body_json = bodyRaw ? JSON.parse(bodyRaw) : null;

  const { error } = await supabase
    .from("articles")
    .update({
      slug: formData.get("slug") as string,
      title: formData.get("title") as string,
      excerpt: (formData.get("excerpt") as string) || null,
      body_json,
      tag: formData.get("tag") as string,
      visibility: formData.get("visibility") as string,
      author: (formData.get("author") as string) || "T.S. Strickland",
      featured: formData.get("featured") === "true",
      image_url: await resolveImageUrl(formData),
      published_at: (formData.get("published_at") as string) || null,
      season_id: (formData.get("season_id") as string) || null,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  redirect("/admin/articles");
}

export async function deleteArticle(formData: FormData) {
  const supabase = createAdminClient();
  const id = formData.get("id") as string;
  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) throw new Error(error.message);
  redirect("/admin/articles");
}
