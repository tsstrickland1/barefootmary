"use client";

import { useAudio } from "@/components/audio/AudioProvider";

// Same static waveform shape used by ArchiveItemViewer when not playing
const STATIC_BARS = Array.from({ length: 60 }, (_, i) =>
  0.15 + Math.abs(Math.sin(i * 0.8) * 0.25 + Math.sin(i * 0.3) * 0.3)
);

interface EpisodePlayerProps {
  title: string;
  audioUrl: string | null;
  duration: string;
}

function formatTime(s: number): string {
  if (!isFinite(s) || isNaN(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

export function EpisodePlayer({ title, audioUrl, duration }: EpisodePlayerProps) {
  const { episode, playing, currentTime, audioDuration, play, togglePlay, seek } = useAudio();

  const isActive = episode?.audioUrl === audioUrl && audioUrl !== null;
  const progress = isActive && audioDuration > 0 ? currentTime / audioDuration : 0;

  if (!audioUrl) {
    return (
      <div className="bg-bg-deep border border-border p-10 mb-12">
        <div className="font-label text-[0.65rem] font-medium tracking-[0.22em] uppercase text-amber mb-6">
          Listen
        </div>
        <div className="h-14 bg-[rgba(196,154,60,0.04)] border border-border flex items-center justify-center">
          <span className="font-label text-[0.72rem] tracking-[0.1em] text-cream-dim">
            Audio coming soon
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-deep border border-border p-10 mb-12">
      <div className="font-label text-[0.65rem] font-medium tracking-[0.22em] uppercase text-amber mb-6">
        Listen
      </div>

      <div className="flex flex-col gap-6">
        {/* Waveform — click to seek when active, or to start playback when inactive */}
        <div
          className="relative h-14 bg-[rgba(196,154,60,0.04)] border border-border flex items-center gap-[2px] px-4 cursor-pointer overflow-hidden"
          onClick={(e) => {
            if (isActive) {
              const rect = e.currentTarget.getBoundingClientRect();
              seek((e.clientX - rect.left) / rect.width);
            } else {
              play({ title, audioUrl, duration });
            }
          }}
        >
          {/* Played-region tint */}
          <div
            className="absolute inset-y-0 left-0 bg-[rgba(196,154,60,0.07)] pointer-events-none"
            style={{ width: `${progress * 100}%` }}
          />
          {/* Playhead */}
          {progress > 0 && (
            <div
              className="absolute inset-y-0 w-px bg-[rgba(196,154,60,0.5)] pointer-events-none"
              style={{ left: `${progress * 100}%` }}
            />
          )}
          {/* Bars */}
          {STATIC_BARS.map((amp, i) => {
            const isPlayed = isActive && (i + 0.5) / STATIC_BARS.length < progress;
            return (
              <div
                key={i}
                className="flex-1 rounded-full relative z-10"
                style={{
                  height: `${Math.max(3, amp * 44)}px`,
                  backgroundColor: isPlayed
                    ? "rgba(196,154,60,0.85)"
                    : "rgba(196,154,60,0.25)",
                }}
              />
            );
          })}
        </div>

        {/* Controls row */}
        <div className="flex items-center gap-4">
          <button
            onClick={async () => {
              if (isActive) {
                await togglePlay();
              } else {
                await play({ title, audioUrl, duration });
              }
            }}
            className="w-10 h-10 border border-amber-dim flex items-center justify-center text-amber hover:border-amber transition-colors duration-200 shrink-0"
            aria-label={isActive && playing ? "Pause" : "Play"}
          >
            {isActive && playing ? (
              <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
                <rect x="0" y="0" width="3.5" height="12" rx="0.5" />
                <rect x="6.5" y="0" width="3.5" height="12" rx="0.5" />
              </svg>
            ) : (
              <svg width="11" height="13" viewBox="0 0 11 13" fill="currentColor">
                <path d="M0.5 0.5 L10.5 6.5 L0.5 12.5 Z" />
              </svg>
            )}
          </button>

          <span className="font-label text-[0.65rem] tracking-[0.08em] text-cream-dim tabular-nums w-10 text-right shrink-0">
            {isActive ? formatTime(currentTime) : "0:00"}
          </span>

          <div
            className={`flex-1 h-px bg-[rgba(196,154,60,0.15)] relative group ${isActive ? "cursor-pointer" : "cursor-default"}`}
            onClick={(e) => {
              if (!isActive) return;
              const rect = e.currentTarget.getBoundingClientRect();
              seek((e.clientX - rect.left) / rect.width);
            }}
          >
            <div
              className="absolute inset-y-0 left-0 bg-amber-dim transition-[width] duration-100"
              style={{ width: `${progress * 100}%` }}
            />
            {isActive && (
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 bg-amber rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                style={{ left: `${progress * 100}%` }}
              />
            )}
          </div>

          <span className="font-label text-[0.65rem] tracking-[0.08em] text-cream-dim tabular-nums w-10 shrink-0">
            {isActive && audioDuration > 0 ? formatTime(audioDuration) : duration}
          </span>
        </div>

        {!isActive && (
          <p className="font-label text-[0.6rem] tracking-[0.1em] uppercase text-cream-dim text-center">
            Press play · continues in background while you browse
          </p>
        )}
      </div>
    </div>
  );
}
