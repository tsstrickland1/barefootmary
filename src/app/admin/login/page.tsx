import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = {
  title: "Admin — Sign In",
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-bg-deep flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <div className="font-label text-[0.65rem] tracking-[0.25em] uppercase text-amber mb-3">
            Barefoot Mary
          </div>
          <h1 className="font-display text-[2rem] font-light text-cream leading-none">
            Admin
          </h1>
        </div>

        <div className="bg-bg-surface border border-border p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
