"use client";

import { useAudio } from "./AudioProvider";

/** Adds 72px of document flow space when the sticky player is visible,
 *  preventing the footer from being obscured by the fixed player bar. */
export function AudioSpacer() {
  const { episode } = useAudio();
  return episode ? <div className="h-[72px]" /> : null;
}
