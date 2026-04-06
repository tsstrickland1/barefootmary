"use client";

import { useAudio } from "./AudioProvider";

function formatTime(s: number): string {
  if (!isFinite(s) || isNaN(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

export function StickyPlayer() {
  const { episode, playing, currentTime, audioDuration, togglePlay, seek, dismiss } = useAudio();

  if (!episode) return null;

  const progress = audioDuration > 0 ? currentTime / audioDuration : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[rgba(14,12,10,0.97)] border-t border-border">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-[72px] flex items-center gap-4 sm:gap-5">
        {/* Episode title */}
        <p className="font-display text-[0.85rem] sm:text-[0.9rem] text-cream leading-tight truncate flex-1 min-w-0">
          {episode.title}
        </p>

        {/* Play / Pause */}
        <button
          onClick={togglePlay}
          className="w-9 h-9 border border-amber-dim flex items-center justify-center text-amber hover:border-amber transition-colors duration-200 shrink-0"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? (
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

        {/* Time + Seek + Duration — hidden on very small screens */}
        <div className="hidden sm:flex items-center gap-3 flex-1 min-w-0 max-w-sm">
          <span className="font-label text-[0.6rem] tracking-[0.08em] text-cream-dim tabular-nums w-8 text-right shrink-0">
            {formatTime(currentTime)}
          </span>

          {/* Seek bar */}
          <div
            className="flex-1 h-px bg-[rgba(196,154,60,0.15)] relative cursor-pointer group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              seek((e.clientX - rect.left) / rect.width);
            }}
          >
            <div
              className="absolute inset-y-0 left-0 bg-amber-dim"
              style={{ width: `${progress * 100}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 bg-amber rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-150"
              style={{ left: `${progress * 100}%` }}
            />
          </div>

          <span className="font-label text-[0.6rem] tracking-[0.08em] text-cream-dim tabular-nums w-8 shrink-0">
            {audioDuration > 0 ? formatTime(audioDuration) : episode.duration}
          </span>
        </div>

        {/* Dismiss */}
        <button
          onClick={dismiss}
          className="w-7 h-7 flex items-center justify-center text-cream-dim hover:text-cream transition-colors duration-200 shrink-0"
          aria-label="Close player"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="1" y1="1" x2="13" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="13" y1="1" x2="1" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
