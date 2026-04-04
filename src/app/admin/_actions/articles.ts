"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createArticle(formData: FormData) {
  const supabase = await createClient();
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
    image_url: (formData.get("image_url") as string) || null,
    published_at: (formData.get("published_at") as string) || null,
  });
  if (error) throw new Error(error.message);
  redirect("/admin/articles");
}

export async function updateArticle(formData: FormData) {
  const supabase = await createClient();
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
      image_url: (formData.get("image_url") as string) || null,
      published_at: (formData.get("published_at") as string) || null,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  redirect("/admin/articles");
}

export async function deleteArticle(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) throw new Error(error.message);
  redirect("/admin/articles");
}
