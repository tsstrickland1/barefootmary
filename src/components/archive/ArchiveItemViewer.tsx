"use client";

import { useState, useEffect, useRef } from "react";

type ArchiveItem = {
  id: string;
  type: string;
  title: string;
  description: string | null;
  visibility: "public" | "subscriber" | "patron";
  file_path: string;
};

function PdfViewer({ title, src }: { title: string; src: string }) {
  return (
    <div
      className="w-full bg-bg-deep border border-border"
      onContextMenu={(e) => e.preventDefault()}
    >
      <iframe
        src={src}
        title={title}
        className="w-full h-[70vh] border-0"
      />
    </div>
  );
}

function ImageViewer({ title, src }: { title: string; src: string }) {
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setZoomed(false);
    }
    if (zoomed) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [zoomed]);

  return (
    <>
      <div
        className="w-full bg-bg-deep border border-border flex items-center justify-center p-8 cursor-zoom-in"
        onClick={() => setZoomed(true)}
        onContextMenu={(e) => e.preventDefault()}
        title="Click to zoom"
      >
        <div className="flex flex-col items-center gap-6 py-8">
          <img
            src={src}
            alt={title}
            draggable={false}
            className="max-w-full max-h-[60vh] object-contain"
            onContextMenu={(e) => e.preventDefault()}
          />
          <p className="font-label text-[0.65rem] tracking-[0.12em] uppercase text-cream-dim">
            Click to view full size
          </p>
        </div>
      </div>

      {/* Zoom overlay */}
      {zoomed && (
        <div
          className="fixed inset-0 z-[70] bg-[rgba(14,12,10,0.96)] flex items-center justify-center cursor-zoom-out"
          onClick={() => setZoomed(false)}
        >
          <button
            className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center text-cream-dim hover:text-cream transition-colors duration-200"
            onClick={() => setZoomed(false)}
            aria-label="Close zoom"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <line x1="2" y1="2" x2="18" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="18" y1="2" x2="2" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <div
            className="max-w-[90vw] max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={src}
              alt={title}
              draggable={false}
              className="max-w-full max-h-[90vh] object-contain"
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
          <p className="absolute bottom-5 left-1/2 -translate-x-1/2 font-label text-[0.6rem] tracking-[0.14em] uppercase text-cream-dim">
            Press Esc or click outside to close
          </p>
        </div>
      )}
    </>
  );
}

const STATIC_BARS = Array.from({ length: 60 }, (_, i) =>
  0.15 + Math.abs(Math.sin(i * 0.8) * 0.25 + Math.sin(i * 0.3) * 0.3)
);

function AudioViewer({ title, src }: { title: string; src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animRef = useRef<number>(0);
  // Smoothed bar values persist between frames so bars decay gracefully
  const smoothedRef = useRef<number[]>(STATIC_BARS.slice());

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bars, setBars] = useState<number[]>(STATIC_BARS);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration);
    const onEnded = () => {
      setPlaying(false);
      cancelAnimationFrame(animRef.current);
      smoothedRef.current = STATIC_BARS.slice();
      setBars(STATIC_BARS);
    };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnded);
      cancelAnimationFrame(animRef.current);
      audioCtxRef.current?.close();
    };
  }, []);

  function initAudioContext() {
    if (audioCtxRef.current) return;
    const audio = audioRef.current!;
    const ctx = new AudioContext();
    const source = ctx.createMediaElementSource(audio);
    const analyser = ctx.createAnalyser();
    // Large fftSize gives more time-domain samples to work with (2048 → 2048 samples)
    analyser.fftSize = 2048;
    source.connect(analyser);
    analyser.connect(ctx.destination);
    audioCtxRef.current = ctx;
    analyserRef.current = analyser;
  }

  function startAnimation() {
    const analyser = analyserRef.current!;
    // Time-domain data: raw PCM amplitude values (0–255, 128 = silence)
    const data = new Uint8Array(analyser.fftSize);
    const BAR_COUNT = 60;
    const chunkSize = Math.floor(data.length / BAR_COUNT);
    const DECAY = 0.88; // bars fall off at ~12% per frame rather than snapping to zero

    function tick() {
      analyser.getByteTimeDomainData(data);

      const next = smoothedRef.current.map((prev, i) => {
        // RMS amplitude for this bar's chunk of samples
        let sum = 0;
        for (let j = 0; j < chunkSize; j++) {
          const s = (data[i * chunkSize + j] - 128) / 128; // −1 to 1
          sum += s * s;
        }
        const rms = Math.sqrt(sum / chunkSize);
        // Hold the peak, decay if the new value is quieter
        return Math.max(rms, prev * DECAY);
      });

      smoothedRef.current = next;
      setBars([...next]);
      animRef.current = requestAnimationFrame(tick);
    }
    tick();
  }

  async function togglePlay() {
    const audio = audioRef.current!;
    if (playing) {
      audio.pause();
      setPlaying(false);
      cancelAnimationFrame(animRef.current);
      smoothedRef.current = STATIC_BARS.slice();
      setBars(STATIC_BARS);
    } else {
      initAudioContext();
      // Always resume — Safari and some Chrome versions start AudioContext
      // in "suspended" even during a user gesture.
      await audioCtxRef.current!.resume();
      await audio.play();
      setPlaying(true);
      startAnimation();
    }
  }

  function seek(ratio: number) {
    const audio = audioRef.current!;
    if (!duration) return;
    audio.currentTime = Math.max(0, Math.min(1, ratio)) * duration;
  }

  function formatTime(s: number) {
    if (!isFinite(s) || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  }

  const progress = duration > 0 ? currentTime / duration : 0;

  return (
    <div
      className="w-full bg-bg-deep border border-border p-10"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* crossOrigin is required for createMediaElementSource on a cross-origin URL */}
      <audio ref={audioRef} src={src} preload="metadata" crossOrigin="anonymous" />

      <div className="max-w-xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 border border-amber-dim flex items-center justify-center font-label text-[0.65rem] tracking-[0.1em] text-amber uppercase shrink-0">
            AUD
          </div>
          <p className="font-display text-[1rem] text-cream leading-[1.3]">
            {title}
          </p>
        </div>

        {/* Waveform — clickable to seek */}
        <div
          className="relative h-14 bg-[rgba(196,154,60,0.04)] border border-border flex items-center gap-[2px] px-4 cursor-pointer overflow-hidden"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            seek((e.clientX - rect.left) / rect.width);
          }}
        >
          {/* Played region overlay */}
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
          {bars.map((amp, i) => {
            const isPlayed = (i + 0.5) / bars.length < progress;
            return (
              <div
                key={i}
                className="w-[2px] rounded-full shrink-0 relative z-10"
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

        {/* Controls */}
        <div className="flex items-center gap-4">
          {/* Play / Pause */}
          <button
            onClick={togglePlay}
            className="w-10 h-10 border border-amber-dim flex items-center justify-center text-amber hover:border-amber transition-colors duration-200 shrink-0"
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

          {/* Elapsed */}
          <span className="font-label text-[0.65rem] tracking-[0.08em] text-cream-dim tabular-nums w-10 text-right shrink-0">
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

          {/* Duration */}
          <span className="font-label text-[0.65rem] tracking-[0.08em] text-cream-dim tabular-nums w-10 shrink-0">
            {formatTime(duration)}
          </span>
        </div>

        <p className="font-label text-[0.6rem] tracking-[0.1em] uppercase text-cream-dim text-center">
          Streaming from secure storage · download not available
        </p>
      </div>
    </div>
  );
}

function TranscriptViewer({ title }: { title: string }) {
  return (
    <div className="w-full bg-bg-deep border border-border p-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-rule">
          <div className="w-10 h-10 border border-amber-dim flex items-center justify-center font-label text-[0.6rem] tracking-[0.1em] text-amber uppercase shrink-0">
            TXT
          </div>
          <p className="font-label text-[0.65rem] tracking-[0.1em] uppercase text-cream-dim">
            {title}
          </p>
        </div>
        <div className="font-body text-[0.9rem] text-cream-dim leading-[2] space-y-5 italic">
          <p>
            Transcript content will render here from the text stored in Supabase.
            The viewer supports long-form text with preserved paragraph breaks.
          </p>
        </div>
      </div>
    </div>
  );
}

export function ArchiveItemViewer({ item, fileUrl }: { item: ArchiveItem; fileUrl: string }) {
  return (
    <div className="flex flex-col gap-0">
      {item.type === "pdf" && <PdfViewer title={item.title} src={fileUrl} />}
      {item.type === "image" && (
        <ImageViewer title={item.title} src={fileUrl} />
      )}
      {item.type === "audio" && <AudioViewer title={item.title} src={fileUrl} />}
      {item.type === "transcript" && <TranscriptViewer title={item.title} />}
    </div>
  );
}
