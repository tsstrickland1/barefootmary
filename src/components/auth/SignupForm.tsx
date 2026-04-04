"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/account`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Sign in immediately after signup (Supabase auto-confirms if not using email confirmation)
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      // Account created but couldn't sign in — likely needs email confirmation
      router.push("/login?confirmed=false");
      return;
    }

    router.refresh();
    router.push(redirect);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="font-label text-[0.65rem] tracking-[0.18em] uppercase text-cream-dim"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-input"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="password"
          className="font-label text-[0.65rem] tracking-[0.18em] uppercase text-cream-dim"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-input"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="confirmPassword"
          className="font-label text-[0.65rem] tracking-[0.18em] uppercase text-cream-dim"
        >
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          required
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="form-input"
        />
      </div>

      {error && (
        <p className="text-[0.8rem] text-[#e07070] font-body">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-amber text-bg-deep font-label text-[0.75rem] font-semibold tracking-[0.18em] uppercase px-6 py-3 transition-opacity duration-200 hover:opacity-80 disabled:opacity-50"
      >
        {loading ? "Creating account…" : "Create Account"}
      </button>

      <p className="text-center text-[0.8rem] text-cream-dim font-body">
        Already have an account?{" "}
        <Link
          href={`/login${redirect !== "/account" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
          className="text-amber hover:opacity-80 transition-opacity"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
