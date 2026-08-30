"use client";

import { Globe2, Home } from "lucide-react";
import type { FeedScope } from "@/lib/types";
import { cn } from "@/lib/utils";

const OPTIONS: { id: FeedScope; label: string; icon: typeof Home }[] = [
  { id: "my-isle", label: "My Isle", icon: Home },
  { id: "archipelago", label: "Archipelago", icon: Globe2 },
];

export function FeedToggle({
  scope,
  counts,
  onChange,
  layout = "row",
}: {
  scope: FeedScope;
  counts?: Record<FeedScope, number>;
  onChange: (scope: FeedScope) => void;
  /** "stack" fits narrow sidebars; "row" is the mobile segmented control. */
  layout?: "row" | "stack";
}) {
  return (
    <div
      role="tablist"
      aria-label="Feed scope"
      className={cn(
        "rounded-2xl border border-shell-200 bg-white p-1 shadow-sm shadow-lagoon-900/5",
        layout === "stack" ? "flex flex-col gap-1" : "flex",
      )}
    >
      {OPTIONS.map(({ id, label, icon: Icon }) => {
        const active = scope === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(id)}
            className={cn(
              "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all",
              layout === "stack"
                ? "w-full justify-start"
                : "flex-1 justify-center",
              active
                ? "brand-gradient text-white shadow-sm"
                : "text-shell-600 hover:bg-shell-50",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className={cn(layout === "stack" && "flex-1 text-left")}>
              {label}
            </span>
            {counts && (
              <span
                className={cn(
                  "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                  active ? "bg-white/25 text-white" : "bg-shell-100 text-shell-600",
                )}
              >
                {counts[id]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
