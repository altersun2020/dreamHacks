"use client";

import type { FeedScope } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FeedToggleProps {
  scope: FeedScope;
  onChange: (scope: FeedScope) => void;
}

export function FeedToggle({ scope, onChange }: FeedToggleProps) {
  return (
    <div className="flex rounded-xl border border-ocean-700/40 bg-ocean-900/50 p-1">
      <button
        type="button"
        onClick={() => onChange("my-isle")}
        className={cn(
          "flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all",
          scope === "my-isle"
            ? "bg-seafoam-500/20 text-seafoam-300 shadow-sm"
            : "text-sand-400 hover:text-sand-200",
        )}
      >
        My Isle
      </button>
      <button
        type="button"
        onClick={() => onChange("archipelago")}
        className={cn(
          "flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all",
          scope === "archipelago"
            ? "bg-seafoam-500/20 text-seafoam-300 shadow-sm"
            : "text-sand-400 hover:text-sand-200",
        )}
      >
        Archipelago
      </button>
    </div>
  );
}
