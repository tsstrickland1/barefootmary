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

function PdfViewer({ title }: { title: string }) {
  return (
    <div
      className="w-full bg-bg-deep border border-border"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Placeholder: in production, file_path would be a signed Supabase URL */}
      <div className="flex items-center justify-center h-[70vh] flex-col gap-4">
        <div className="w-16 h-16 border border-amber-dim flex items-center justify-center font-label text-[0.72rem] tracking-[0.1em] text-amber uppercase">
          PDF
        </div>
        <p className="font-label text-[0.7rem] tracking-[0.1em] uppercase text-cream-dim text-center max-w-[320px]">
          {title}
        </p>
        <p className="font-body text-[0.8rem] italic text-cream-dim text-center max-w-[400px] leading-[1.7]">
          Document viewer will render here. The PDF is streamed directly from
          secure storage without a downloadable link.
        </p>
      </div>
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
        {/* Placeholder image — in production this is a signed Supabase URL */}
        <div className="flex flex-col items-center gap-6 py-16">
          <div className="w-64 h-48 border border-amber-dim flex items-center justify-center font-label text-[0.72rem] tracking-[0.1em] text-amber uppercase bg-[rgba(196,154,60,0.03)]">
            IMG
          </div>
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
            {/* In production: <img src={signedUrl} alt={title} draggable={false} className="max-w-full max-h-[90vh] object-contain" onContextMenu={(e) => e.preventDefault()} /> */}
            <div className="w-[600px] h-[450px] border border-amber-dim flex items-center justify-center font-label text-[0.72rem] tracking-[0.1em] text-amber uppercase bg-bg-deep">
              Full-resolution image · {title}
            </div>
          </div>
          <p className="absolute bottom-5 left-1/2 -translate-x-1/2 font-label text-[0.6rem] tracking-[0.14em] uppercase text-cream-dim">
            Press Esc or click outside to close
          </p>
        </div>
      )}
    </>
  );
}

function AudioViewer({ title }: { title: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);

  return (
    <div
      className="w-full bg-bg-deep border border-border p-10"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="max-w-xl mx-auto flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 border border-amber-dim flex items-center justify-center font-label text-[0.65rem] tracking-[0.1em] text-amber uppercase shrink-0">
            AUD
          </div>
          <div>
            <p className="font-display text-[1rem] text-cream leading-[1.3]">{title}</p>
          </div>
        </div>

        {/* Waveform visualization placeholder */}
        <div className="h-14 bg-[rgba(196,154,60,0.04)] border border-border flex items-center justify-center gap-[2px] px-4">
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className="w-[2px] bg-amber-dim rounded-full shrink-0"
              style={{
                height: `${8 + Math.sin(i * 0.8) * 10 + Math.sin(i * 0.3) * 12}px`,
                opacity: 0.4 + Math.abs(Math.sin(i * 0.5)) * 0.6,
              }}
            />
          ))}
        </div>

        {/* Audio element — in production src would be a signed Supabase URL */}
        <audio
          ref={audioRef}
          controls
          controlsList="nodownload"
          onContextMenu={(e) => e.preventDefault()}
          className="w-full"
          style={{ colorScheme: "dark" }}
        >
          <source src="" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>

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

export function ArchiveItemViewer({ item }: { item: ArchiveItem }) {
  return (
    <div className="flex flex-col gap-0">
      {item.type === "pdf" && <PdfViewer title={item.title} />}
      {item.type === "image" && (
        <ImageViewer title={item.title} src={item.file_path} />
      )}
      {item.type === "audio" && <AudioViewer title={item.title} />}
      {item.type === "transcript" && <TranscriptViewer title={item.title} />}
    </div>
  );
}
