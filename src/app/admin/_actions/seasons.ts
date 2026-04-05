"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

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
    image_url: (formData.get("image_url") as string) || null,
  });
  if (error) redirect(`/admin/seasons?error=${encodeURIComponent(error.message)}`);
  redirect("/admin/seasons?success=Season+created");
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
      image_url: (formData.get("image_url") as string) || null,
    })
    .eq("id", id);
  if (error) redirect(`/admin/seasons/${id}?error=${encodeURIComponent(error.message)}`);
  redirect(`/admin/seasons/${id}?success=Season+saved`);
}

export async function deleteSeason(formData: FormData) {
  const supabase = createAdminClient();
  const id = formData.get("id") as string;
  const { error } = await supabase.from("seasons").delete().eq("id", id);
  if (error) redirect(`/admin/seasons?error=${encodeURIComponent(error.message)}`);
  redirect("/admin/seasons?success=Season+deleted");
}
