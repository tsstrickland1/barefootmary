"use client";

import { useState, useRef } from "react";
import { VoiceRecorder } from "./VoiceRecorder";

type SubmitState = "idle" | "submitting" | "success" | "error";

export function StoryForm() {
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitState("submitting");

    const formData = new FormData(e.currentTarget);
    if (recordedBlob) {
      formData.append("audio_recording", recordedBlob, "recording.webm");
    }

    // TODO: POST to /api/submissions when Supabase storage is wired up
    // For now, simulate a successful submission
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitState("success");
    formRef.current?.reset();
    setRecordedBlob(null);
  }

  if (submitState === "success") {
    return (
      <div className="flex flex-col gap-5 py-10 text-center">
        <div className="font-label text-[0.65rem] tracking-[0.22em] uppercase text-teal-light">
          Story received
        </div>
        <div className="font-display text-[2rem] font-light italic text-cream leading-[1.1]">
          Thank you for sharing.
        </div>
        <p className="text-[0.87rem] text-cream-dim leading-[1.88] font-body max-w-[340px] mx-auto">
          Your submission will be reviewed before use. We&apos;ll be in touch if
          we have questions.
        </p>
        <button
          type="button"
          onClick={() => setSubmitState("idle")}
          className="font-label text-[0.65rem] tracking-[0.16em] uppercase text-cream-dim hover:text-cream transition-colors duration-200 mt-2"
        >
          Submit another story →
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-3.5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="flex flex-col gap-1.5">
          <label className="font-label text-[0.62rem] font-medium tracking-[0.16em] uppercase text-amber">
            Your Name
          </label>
          <input
            className="form-input"
            type="text"
            name="name"
            placeholder="How you'd like to be credited"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label text-[0.62rem] font-medium tracking-[0.16em] uppercase text-amber">
            Email (optional)
          </label>
          <input
            className="form-input"
            type="email"
            name="email"
            placeholder="For follow-up only"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-label text-[0.62rem] font-medium tracking-[0.16em] uppercase text-amber">
          Briefly describe your story
        </label>
        <textarea
          className="form-input"
          name="description"
          placeholder="What will you tell us? Where does it take place?"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-label text-[0.62rem] font-medium tracking-[0.16em] uppercase text-amber">
          Record Your Story
        </label>
        <VoiceRecorder
          onRecorded={(blob) => setRecordedBlob(blob)}
          onCleared={() => setRecordedBlob(null)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-label text-[0.6rem] tracking-[0.06em] text-cream-dim">
          Or upload a file — .mp3, .wav, .m4a up to 100 MB
        </label>
        <input
          className="form-input italic text-[rgba(158,146,120,0.5)]"
          type="file"
          name="audio"
          accept=".mp3,.wav,.m4a"
        />
      </div>

      <button
        type="submit"
        disabled={submitState === "submitting"}
        className="bg-amber text-bg-deep border-none py-3.5 px-8 font-label text-[0.72rem] font-semibold tracking-[0.18em] uppercase cursor-pointer w-full transition-colors duration-200 hover:bg-amber-light mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitState === "submitting" ? "Submitting…" : "Submit Your Story →"}
      </button>
      <p className="font-label text-[0.58rem] text-[rgba(158,146,120,0.55)] tracking-[0.06em] text-center">
        Submissions are reviewed before any use. Your privacy is respected.
        See our full consent policy.
      </p>
    </form>
  );
}
