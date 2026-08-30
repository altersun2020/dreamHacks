"use client";

import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);
  return () => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
}

const getSnapshot = () => navigator.onLine;
/** The server has no connectivity to report; assume online until hydrated. */
const getServerSnapshot = () => true;

/**
 * Exposes connectivity to the tree. Post/Tide Log caching is owned by
 * FeedContext, which seeds and reads the same IndexedDB tables.
 */
export function OfflineProvider({ children }: { children: React.ReactNode }) {
  const isOnline = useOnlineStatus();
  return <div data-online={isOnline}>{children}</div>;
}

export function useOnlineStatus(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
