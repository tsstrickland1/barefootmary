"use client";

import { useState, useRef, useEffect } from "react";

type RecorderState = "idle" | "requesting" | "recording" | "preview";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

interface VoiceRecorderProps {
  onRecorded: (blob: Blob) => void;
  onCleared: () => void;
}

export function VoiceRecorder({ onRecorded, onCleared }: VoiceRecorderProps) {
  const [state, setState] = useState<RecorderState>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  async function startRecording() {
    setError(null);
    setState("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/ogg";
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        onRecorded(blob);
        setState("preview");
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start(200);
      setState("recording");
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    } catch {
      setState("idle");
      setError("Microphone access denied. Please allow microphone access and try again.");
    }
  }

  function stopRecording() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    mediaRecorderRef.current?.stop();
  }

  function reset() {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setElapsed(0);
    setState("idle");
    onCleared();
  }

  if (state === "idle") {
    return (
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={startRecording}
          className="flex items-center justify-center gap-3.5 py-4 px-4 bg-bg-deep border border-dashed border-[rgba(196,154,60,0.35)] text-cream font-label text-[0.72rem] tracking-[0.18em] uppercase cursor-pointer transition-all duration-200 w-full hover:border-amber hover:bg-[rgba(196,154,60,0.03)]"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#c44c3c] shrink-0" />
          Record Now in Your Browser
        </button>
        {error && (
          <p className="font-label text-[0.62rem] tracking-[0.08em] text-[#c44c3c]">{error}</p>
        )}
      </div>
    );
  }

  if (state === "requesting") {
    return (
      <div className="flex items-center justify-center gap-3 py-4 px-4 bg-bg-deep border border-dashed border-[rgba(196,154,60,0.35)] w-full">
        <span className="w-2 h-2 rounded-full bg-amber animate-pulse" />
        <span className="font-label text-[0.72rem] tracking-[0.18em] uppercase text-cream-dim">
          Requesting microphone access…
        </span>
      </div>
    );
  }

  if (state === "recording") {
    return (
      <div className="flex flex-col gap-3 py-4 px-5 bg-bg-deep border border-[rgba(196,60,60,0.4)] w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c44c3c] shrink-0 animate-pulse" />
            <span className="font-label text-[0.72rem] tracking-[0.18em] uppercase text-cream">
              Recording
            </span>
          </div>
          <span className="font-label text-[0.78rem] tracking-[0.12em] text-cream tabular-nums">
            {formatTime(elapsed)}
          </span>
        </div>

        {/* Live waveform bars (decorative) */}
        <div className="h-8 flex items-center gap-[2px]">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="w-[2px] bg-[#c44c3c] rounded-full shrink-0"
              style={{
                height: `${6 + Math.random() * 20}px`,
                opacity: 0.5 + Math.random() * 0.5,
                animation: `pulse ${0.4 + Math.random() * 0.6}s ease-in-out infinite alternate`,
              }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={stopRecording}
          className="flex items-center justify-center gap-2.5 py-2.5 px-4 border border-[rgba(196,60,60,0.5)] text-[#c44c3c] font-label text-[0.65rem] tracking-[0.18em] uppercase cursor-pointer transition-all duration-200 hover:bg-[rgba(196,60,60,0.06)] w-full"
        >
          <span className="w-2.5 h-2.5 bg-[#c44c3c] shrink-0" />
          Stop Recording
        </button>
      </div>
    );
  }

  // preview
  return (
    <div className="flex flex-col gap-3 py-4 px-5 bg-bg-deep border border-amber-dim w-full">
      <div className="flex items-center gap-2 mb-1">
        <span className="font-label text-[0.6rem] tracking-[0.18em] uppercase text-teal-light">
          ✓ Recording ready
        </span>
        <span className="font-label text-[0.6rem] tracking-[0.1em] text-cream-dim ml-auto">
          {formatTime(elapsed)}
        </span>
      </div>
      {audioUrl && (
        <audio
          src={audioUrl}
          controls
          controlsList="nodownload"
          onContextMenu={(e) => e.preventDefault()}
          className="w-full"
          style={{ colorScheme: "dark" }}
        />
      )}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={reset}
          className="flex-1 py-2 px-3 border border-border text-cream-dim font-label text-[0.62rem] tracking-[0.14em] uppercase cursor-pointer transition-all duration-200 hover:border-amber hover:text-amber"
        >
          Re-record
        </button>
        <div className="flex-1 py-2 px-3 border border-teal text-teal-light font-label text-[0.62rem] tracking-[0.14em] uppercase text-center">
          ✓ Using this recording
        </div>
      </div>
    </div>
  );
}
