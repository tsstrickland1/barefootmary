import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.user_metadata?.is_admin) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-bg-deep flex">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
