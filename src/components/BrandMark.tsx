import { cn } from "@/lib/utils";

/**
 * The IsleHelp pin, loaded from /mark.svg so replacing that one file updates
 * every use of the mark across the app. /icon.svg (tiled, for the PWA) and
 * /logo.svg (full lockup) are the other two brand files.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static SVG, no optimisation needed
    <img
      src="/mark.svg"
      alt=""
      aria-hidden="true"
      className={cn("h-6 w-6 select-none", className)}
      draggable={false}
    />
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-extrabold tracking-tight", className)}>
      <span className="text-brand-ink">Isle</span>
      <span className="text-palm-400">Help</span>
    </span>
  );
}
