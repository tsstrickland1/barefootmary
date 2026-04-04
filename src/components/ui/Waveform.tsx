"use client";

import { useEffect, useRef } from "react";

export function Waveform() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || el.children.length > 0) return;
    for (let i = 0; i < 38; i++) {
      const bar = document.createElement("span");
      bar.className = "block w-[2px] shrink-0 rounded-sm bg-amber";
      bar.style.height = `${4 + Math.random() * 20}px`;
      el.appendChild(bar);
    }
  }, []);

  return (
    <div
      ref={ref}
      className="flex items-center gap-[2px] h-[26px] mt-auto pt-3 opacity-35"
    />
  );
}
