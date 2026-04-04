"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function loginAction(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return error?.message ?? "Login failed.";
  }

  if (!data.user.user_metadata?.is_admin) {
    await supabase.auth.signOut();
    return "Access denied.";
  }

  redirect("/admin");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
