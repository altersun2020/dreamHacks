"use client";

import type { PostTag } from "@/lib/types";
import { POST_TAGS, cn, getTagStyles } from "@/lib/utils";

export function TagFilter({
  active,
  counts,
  onChange,
}: {
  active: PostTag | null;
  counts: Record<PostTag, number>;
  onChange: (tag: PostTag | null) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Filter by tag"
      className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
    >
      <button
        type="button"
        onClick={() => onChange(null)}
        aria-pressed={active === null}
        className={cn(
          "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all",
          active === null
            ? "border-lagoon-800 bg-lagoon-800 text-white"
            : "border-shell-200 bg-white text-shell-600 hover:bg-shell-50",
        )}
      >
        All
      </button>
      {POST_TAGS.map((tag) => {
        const styles = getTagStyles(tag);
        const isActive = active === tag;
        const count = counts[tag] ?? 0;
        return (
          <button
            key={tag}
            type="button"
            onClick={() => onChange(isActive ? null : tag)}
            aria-pressed={isActive}
            disabled={count === 0}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all",
              isActive
                ? cn(styles.bg, styles.text, styles.border, "ring-2 ring-shell-200")
                : "border-shell-200 bg-white text-shell-600 hover:bg-shell-50",
              count === 0 && "opacity-40",
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", styles.dot)} />
            {styles.label}
            <span className="text-[10px] text-shell-500">{count}</span>
          </button>
        );
      })}
    </div>
  );
}
