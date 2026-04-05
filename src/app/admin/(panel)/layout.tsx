import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Toaster } from "sonner";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminShell } from "@/components/admin/AdminShell";
import { FlashToast } from "@/components/admin/FlashToast";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const adminClient = createAdminClient();
  const { data: profile } = await adminClient
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    redirect("/admin/login");
  }

  return (
    <AdminShell>
      <Suspense>
        <FlashToast />
      </Suspense>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#1e1a16",
            border: "1px solid rgba(232,223,200,0.09)",
            color: "#e8dfc8",
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
          },
        }}
      />
      {children}
    </AdminShell>
  );
}
