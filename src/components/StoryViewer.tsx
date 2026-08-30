"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Timer, X } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import type { TideLog } from "@/lib/types";
import { cn, formatRelativeTime, formatTimeRemaining } from "@/lib/utils";

const STORY_DURATION_MS = 5000;
const TICK_MS = 50;

interface StoryViewerProps {
  logs: TideLog[];
  startIndex: number;
  onClose: () => void;
  onSeen: (logId: string) => void;
}

export function StoryViewer({
  logs,
  startIndex,
  onClose,
  onSeen,
}: StoryViewerProps) {
  const [index, setIndex] = useState(startIndex);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Elapsed time for the current frame, held in a ref so pausing resumes
  // where it left off instead of restarting the frame.
  const elapsed = useRef(0);
  const log = logs[index];

  const goNext = useCallback(() => {
    elapsed.current = 0;
    setProgress(0);
    if (index >= logs.length - 1) {
      onClose();
      return;
    }
    setIndex(index + 1);
  }, [index, logs.length, onClose]);

  const goPrev = useCallback(() => {
    elapsed.current = 0;
    setProgress(0);
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  // Mark the current frame as watched.
  useEffect(() => {
    if (log) onSeen(log.id);
  }, [log, onSeen]);

  // Advance the progress bar, then hand off to the next frame. The advance
  // happens in the interval callback rather than inside a state updater, so it
  // never sets state on the parent mid-render.
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      elapsed.current += TICK_MS;
      if (elapsed.current >= STORY_DURATION_MS) {
        goNext();
        return;
      }
      setProgress((elapsed.current / STORY_DURATION_MS) * 100);
    }, TICK_MS);
    return () => clearInterval(timer);
  }, [paused, goNext]);

  // Lock body scroll while the viewer owns the screen.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, goNext, goPrev]);

  // Press-and-hold pauses; a quick tap falls through to the nav buttons.
  function startHold() {
    holdTimer.current = setTimeout(() => setPaused(true), 200);
  }
  function endHold() {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    setPaused(false);
  }

  if (!log) return null;
  // Portalled to the body. AppShell wraps page content in a `relative z-10`
  // panel, which is a stacking context — inside it the viewer's z-index is
  // scoped below the z-50 header and tab bar, so both painted over the story.
  if (typeof document === "undefined") return null;

  // The scrim covers the screen, but the story stays inside a phone-width card.
  // Full-bleed stretched a single photo across a desktop monitor and thinned the
  // progress bars into an invisible 2000px hairline.
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Tide Log from ${log.author}`}
      className="animate-fade-in fixed inset-0 z-[70] flex items-center justify-center bg-lagoon-900/80 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex h-full w-full max-w-[420px] flex-col overflow-hidden bg-lagoon-900 shadow-2xl sm:h-[min(88vh,760px)] sm:rounded-3xl"
      >
        {/* Segmented progress */}
        <div className="flex gap-1 px-3 pt-3">
          {logs.map((l, i) => (
            <div
              key={l.id}
              className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/25"
            >
              <div
                className="h-full rounded-full bg-white transition-[width] duration-75 ease-linear"
                style={{
                  width:
                    i < index ? "100%" : i === index ? `${progress}%` : "0%",
                }}
              />
            </div>
          ))}
        </div>

        <header className="flex items-center gap-3 px-4 py-3">
          <Avatar name={log.author} size="sm" className="ring-2 ring-white/30" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              {log.author}
            </p>
            <p className="truncate text-[11px] text-white/60">
              {log.island} · {formatRelativeTime(log.createdAt)}
            </p>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-white/15 px-2 py-1 text-[10px] font-medium text-white/90">
            <Timer className="h-3 w-3" />
            {formatTimeRemaining(log.expiresAt)}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Tide Logs"
            className="rounded-full p-1.5 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* Frame */}
        <div
          className="relative flex flex-1 items-center justify-center overflow-hidden"
          onPointerDown={startHold}
          onPointerUp={endHold}
          onPointerLeave={endHold}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-lagoon-700 via-lagoon-800 to-teal-800" />
          {log.photo ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element -- local static asset */}
              <img
                src={log.photo}
                alt=""
                className={cn(
                  "absolute inset-0 h-full w-full object-cover transition-transform duration-700",
                  paused ? "scale-[1.03]" : "scale-100",
                )}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
            </>
          ) : (
            <span
              role="img"
              aria-label={log.label}
              className={cn(
                "relative block px-8 text-center text-[7rem] leading-none drop-shadow-2xl transition-transform",
                paused ? "scale-95" : "scale-100",
              )}
            >
              {log.preview}
            </span>
          )}

          {/* Tap zones */}
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous Tide Log"
            className="group absolute inset-y-0 left-0 flex w-1/3 items-center justify-start pl-3"
          >
            <ChevronLeft className="h-6 w-6 text-white/0 transition-colors group-hover:text-white/50" />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next Tide Log"
            className="group absolute inset-y-0 right-0 flex w-1/3 items-center justify-end pr-3"
          >
            <ChevronRight className="h-6 w-6 text-white/0 transition-colors group-hover:text-white/50" />
          </button>

          {paused && (
            <span className="absolute bottom-4 rounded-full bg-black/40 px-3 py-1 text-[11px] font-medium text-white/90">
              Paused
            </span>
          )}
        </div>

        <footer className="bg-gradient-to-t from-black/50 to-transparent px-5 pb-8 pt-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-300">
            {log.label}
          </p>
          {log.caption && (
            <p className="mt-1 text-[15px] leading-relaxed text-white">
              {log.caption}
            </p>
          )}
        </footer>
      </div>
    </div>,
    document.body,
  );
}
