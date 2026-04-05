"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import type { SubmissionStatus } from "@/types/database";

export async function updateSubmissionStatus(formData: FormData) {
  const supabase = createAdminClient();
  const id = formData.get("id") as string;
  const status = formData.get("status") as SubmissionStatus;

  const { error } = await supabase
    .from("submissions")
    .update({ status })
    .eq("id", id);

  if (error) redirect(`/admin/submissions?error=${encodeURIComponent(error.message)}`);
  redirect("/admin/submissions?success=Status+updated");
}
