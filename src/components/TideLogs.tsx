"use client";

import { useCallback, useState } from "react";
import { Plus } from "lucide-react";
import { AddTideLogSheet } from "@/components/AddTideLogSheet";
import { StoryViewer } from "@/components/StoryViewer";
import { useFeed } from "@/contexts/FeedContext";
import { cn, formatTimeRemaining } from "@/lib/utils";

export function TideLogs() {
  const { ready, tideLogs, seenLogIds, markSeen } = useFeed();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [composing, setComposing] = useState(false);

  // Stable identity so the viewer's frame timer is not reset on every render.
  const closeViewer = useCallback(() => setOpenIndex(null), []);

  // Unwatched stories come first, the way a story tray normally sorts.
  const ordered = [...tideLogs].sort((a, b) => {
    const aSeen = seenLogIds.has(a.id) ? 1 : 0;
    const bSeen = seenLogIds.has(b.id) ? 1 : 0;
    if (aSeen !== bSeen) return aSeen - bSeen;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <section aria-label="Tide Logs">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-shell-500">
          Tide Logs
        </h2>
        <span className="text-[10px] font-medium text-shell-400">
          Gone in 24h
        </span>
      </div>

      <div className="flex gap-3.5 overflow-x-auto pb-1 scrollbar-hide">
        <button
          type="button"
          onClick={() => setComposing(true)}
          className="flex shrink-0 flex-col items-center gap-1.5"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-teal-300 bg-teal-50 text-teal-600 transition-colors hover:border-teal-400 hover:bg-teal-100">
            <Plus className="h-6 w-6" />
          </span>
          <span className="text-[10px] font-semibold text-shell-600">
            Add Log
          </span>
        </button>

        {!ready &&
          [0, 1, 2, 3].map((i) => (
            <div key={i} className="flex shrink-0 flex-col items-center gap-1.5">
              <span className="h-16 w-16 animate-pulse rounded-full bg-shell-200" />
              <span className="h-2.5 w-12 animate-pulse rounded bg-shell-200" />
            </div>
          ))}

        {ready && ordered.length === 0 && (
          <p className="flex h-16 items-center text-xs text-shell-500">
            No Tide Logs right now — the last ones have washed out.
          </p>
        )}

        {ordered.map((log) => {
          const seen = seenLogIds.has(log.id);
          return (
            <button
              key={log.id}
              type="button"
              onClick={() =>
                setOpenIndex(ordered.findIndex((l) => l.id === log.id))
              }
              className="flex shrink-0 flex-col items-center gap-1.5"
              title={`${log.label} · ${formatTimeRemaining(log.expiresAt)}`}
            >
              <span
                className={cn(
                  "flex h-16 w-16 items-center justify-center rounded-full p-[2.5px]",
                  seen ? "tide-ring-seen" : "tide-ring-unseen",
                )}
              >
                <span
                  className={cn(
                    "flex h-full w-full items-center justify-center rounded-full bg-white text-2xl",
                    seen && "opacity-70",
                  )}
                >
                  {log.preview}
                </span>
              </span>
              <span
                className={cn(
                  "max-w-[64px] truncate text-[10px] font-semibold",
                  seen ? "text-shell-400" : "text-lagoon-800",
                )}
              >
                {log.label}
              </span>
            </button>
          );
        })}
      </div>

      {openIndex !== null && ordered[openIndex] && (
        <StoryViewer
          logs={ordered}
          startIndex={openIndex}
          onClose={closeViewer}
          onSeen={markSeen}
        />
      )}

      {composing && <AddTideLogSheet onClose={() => setComposing(false)} />}
    </section>
  );
}
