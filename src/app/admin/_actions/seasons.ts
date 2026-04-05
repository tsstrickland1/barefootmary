"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { uploadImage } from "@/lib/supabase/uploadImage";

async function resolveImageUrl(formData: FormData): Promise<string | null> {
  const file = formData.get("image_file") as File | null;
  if (file && file.size > 0) return uploadImage(file, "seasons");
  return (formData.get("image_url") as string) || null;
}

export async function createSeason(formData: FormData) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("seasons").insert({
    slug: formData.get("slug") as string,
    number: Number(formData.get("number")),
    title: formData.get("title") as string,
    subtitle: (formData.get("subtitle") as string) || null,
    description: (formData.get("description") as string) || null,
    numeral: (formData.get("numeral") as string) || null,
    status: formData.get("status") as string,
    image_url: await resolveImageUrl(formData),
  });
  if (error) throw new Error(error.message);
  redirect("/admin/seasons");
}

export async function updateSeason(formData: FormData) {
  const supabase = createAdminClient();
  const id = formData.get("id") as string;
  const { error } = await supabase
    .from("seasons")
    .update({
      slug: formData.get("slug") as string,
      number: Number(formData.get("number")),
      title: formData.get("title") as string,
      subtitle: (formData.get("subtitle") as string) || null,
      description: (formData.get("description") as string) || null,
      numeral: (formData.get("numeral") as string) || null,
      status: formData.get("status") as string,
      image_url: await resolveImageUrl(formData),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  redirect("/admin/seasons");
}

export async function deleteSeason(formData: FormData) {
  const supabase = createAdminClient();
  const id = formData.get("id") as string;
  const { error } = await supabase.from("seasons").delete().eq("id", id);
  if (error) throw new Error(error.message);
  redirect("/admin/seasons");
}
