import { Suspense } from "react";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata = {
  title: "Create Account — Barefoot Mary",
};

export default function SignupPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <div className="font-label text-[0.65rem] tracking-[0.25em] uppercase text-amber mb-3">
            Barefoot Mary
          </div>
          <h1 className="font-display text-[2rem] font-light text-cream leading-none mb-2">
            Create Account
          </h1>
          <p className="text-[0.85rem] text-cream-dim font-body">
            Subscribe to access gated episodes and field notes.
          </p>
        </div>

        <div className="bg-bg-surface border border-border p-8">
          <Suspense>
            <SignupForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
