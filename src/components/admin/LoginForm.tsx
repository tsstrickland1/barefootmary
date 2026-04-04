"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction } from "@/app/admin/_actions/auth";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-amber text-bg-deep font-label text-[0.75rem] font-semibold tracking-[0.18em] uppercase px-6 py-3 transition-opacity duration-200 hover:opacity-80 disabled:opacity-50"
    >
      {pending ? "Signing in…" : "Sign In"}
    </button>
  );
}

export function LoginForm() {
  const [error, action] = useActionState(loginAction, null);

  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="font-label text-[0.65rem] tracking-[0.18em] uppercase text-cream-dim"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
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
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="form-input"
        />
      </div>

      {error && (
        <p className="text-[0.8rem] text-[#e07070] font-body">{error}</p>
      )}

      <SubmitButton />
    </form>
  );
}
