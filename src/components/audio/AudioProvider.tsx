"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export interface ActiveEpisode {
  title: string;
  audioUrl: string;
  duration: string;
}

interface AudioContextValue {
  episode: ActiveEpisode | null;
  playing: boolean;
  currentTime: number;
  audioDuration: number;
  play: (ep: ActiveEpisode) => Promise<void>;
  togglePlay: () => Promise<void>;
  seek: (ratio: number) => void;
  dismiss: () => void;
}

const AudioCtx = createContext<AudioContextValue | null>(null);

export function useAudio(): AudioContextValue {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error("useAudio must be used within AudioProvider");
  return ctx;
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [episode, setEpisode] = useState<ActiveEpisode | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);

  // Wire up audio element event listeners once on mount
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setAudioDuration(audio.duration);
    const onEnded = () => setPlaying(false);
    const onPause = () => setPlaying(false);
    const onPlay = () => setPlaying(true);

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("durationchange", onMeta);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("play", onPlay);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("durationchange", onMeta);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("play", onPlay);
    };
  }, []);

  // Pause this player when an external audio source (e.g. archive viewer) starts
  useEffect(() => {
    function onExternalPlay() {
      const audio = audioRef.current;
      if (audio && !audio.paused) {
        audio.pause();
      }
    }
    window.addEventListener("barefoot:external-audio-play", onExternalPlay);
    return () => window.removeEventListener("barefoot:external-audio-play", onExternalPlay);
  }, []);

  const play = useCallback(async (ep: ActiveEpisode) => {
    const audio = audioRef.current;
    if (!audio) return;

    // Notify archive viewers (or other external players) to pause
    window.dispatchEvent(new Event("barefoot:global-audio-play"));

    if (episode?.audioUrl !== ep.audioUrl) {
      // New episode — load it
      audio.src = ep.audioUrl;
      setEpisode(ep);
      setCurrentTime(0);
      setAudioDuration(0);
    } else {
      // Same episode — just update metadata in case title changed
      setEpisode(ep);
    }

    await audio.play();
  }, [episode]);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !episode) return;
    if (audio.paused) {
      window.dispatchEvent(new Event("barefoot:global-audio-play"));
      await audio.play();
    } else {
      audio.pause();
    }
  }, [episode]);

  const seek = useCallback((ratio: number) => {
    const audio = audioRef.current;
    if (!audio || !audioDuration) return;
    audio.currentTime = Math.max(0, Math.min(1, ratio)) * audioDuration;
  }, [audioDuration]);

  const dismiss = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.src = "";
    }
    setEpisode(null);
    setPlaying(false);
    setCurrentTime(0);
    setAudioDuration(0);
  }, []);

  return (
    <AudioCtx.Provider value={{ episode, playing, currentTime, audioDuration, play, togglePlay, seek, dismiss }}>
      {/* Hidden audio element — persists across all navigation */}
      <audio ref={audioRef} preload="metadata" />
      {children}
    </AudioCtx.Provider>
  );
}
