"use client";

import type { TideLog } from "@/lib/types";
import { Plus } from "lucide-react";

interface TideLogsProps {
  logs: TideLog[];
}

export function TideLogs({ logs }: TideLogsProps) {
  return (
    <section>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-sand-500">
        Tide Logs · 24hr
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        <button
          type="button"
          className="flex shrink-0 flex-col items-center gap-1.5"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-seafoam-500/40 bg-ocean-900/40 text-seafoam-400 transition-colors hover:border-seafoam-400/60">
            <Plus className="h-6 w-6" />
          </div>
          <span className="text-[10px] font-medium text-sand-400">Add Log</span>
        </button>
        {logs.map((log) => (
          <button
            key={log.id}
            type="button"
            className="flex shrink-0 flex-col items-center gap-1.5"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-seafoam-400/60 bg-gradient-to-br from-ocean-800 to-ocean-900 text-2xl ring-2 ring-ocean-950 ring-offset-2 ring-offset-ocean-950">
              {log.preview}
            </div>
            <span className="max-w-[64px] truncate text-[10px] font-medium text-sand-300">
              {log.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
