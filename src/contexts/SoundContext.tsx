"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CoastalAudio } from "@/lib/coastal-audio";

interface SoundContextValue {
  playing: boolean;
  /** Fade the ambience up. Must be called from a user gesture. */
  fadeIn: () => void;
  /** Fade the ambience down and tear the graph down afterwards. */
  fadeOut: () => void;
}

const SoundContext = createContext<SoundContextValue | null>(null);

/**
 * The coastal ambience belongs to the intro curtain only — it fades in when the
 * visitor clicks during the intro and fades out as the curtain lifts. It is
 * deliberately never started again on the site's own pages.
 */
export function SoundProvider({ children }: { children: React.ReactNode }) {
  const engine = useRef<CoastalAudio | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    engine.current = new CoastalAudio();
    const current = engine.current;
    return () => {
      current?.stop();
    };
  }, []);

  const fadeIn = useCallback(() => {
    const audio = engine.current;
    if (!audio || audio.isRunning) return;
    // Fire and forget: a rejected start (no gesture) just leaves it silent.
    audio
      .start(0.32)
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }, []);

  const fadeOut = useCallback(() => {
    const audio = engine.current;
    if (!audio || !audio.isRunning) return;
    setPlaying(false);
    audio.stop().catch(() => {
      /* already torn down */
    });
  }, []);

  const value = useMemo(
    () => ({ playing, fadeIn, fadeOut }),
    [playing, fadeIn, fadeOut],
  );

  return (
    <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
  );
}

export function useSound(): SoundContextValue {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used inside a SoundProvider");
  return ctx;
}
