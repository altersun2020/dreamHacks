/**
 * A page title, nothing more. The app's identity and navigation live in the
 * shell — repeating them here is what made every page feel like a dashboard.
 */
export function Header({
  title,
  isOnline,
  children,
}: {
  title: string;
  isOnline?: boolean;
  pendingCount?: number;
  children?: React.ReactNode;
}) {
  return (
    <div className="border-b border-line pb-4">
      <div className="flex items-baseline justify-between gap-3">
        <h1 className="text-[22px] font-bold tracking-[-0.01em] text-ink">
          {title}
        </h1>
        {isOnline === false && (
          <span className="shrink-0 text-[12px] font-medium text-ink-mute">
            Offline · syncing by mesh
          </span>
        )}
      </div>
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}
