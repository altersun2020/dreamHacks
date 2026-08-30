"use client";

import { useEffect, useState } from "react";
import { formatRelativeTime } from "@/lib/utils";

/**
 * Relative timestamps depend on the current clock, which differs between the
 * server render and the client. Render nothing until mounted so hydration
 * always matches, then keep the label ticking.
 */
export function RelativeTime({
  iso,
  className,
}: {
  iso: string;
  className?: string;
}) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setLabel(formatRelativeTime(iso));
    update();
    const timer = setInterval(update, 60_000);
    return () => clearInterval(timer);
  }, [iso]);

  return (
    <time dateTime={iso} className={className}>
      {label ?? " "}
    </time>
  );
}
