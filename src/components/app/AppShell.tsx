"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarHeart,
  Home,
  LifeBuoy,
  Map,
  Search,
  Store,
  Waves,
  X,
} from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { useOnlineStatus } from "@/components/OfflineProvider";
import { useFeed } from "@/contexts/FeedContext";
import { IslandBackdrop } from "@/components/app/IslandBackdrop";
import { PoolWater } from "@/components/app/PoolWater";
import { SearchProvider } from "@/contexts/SearchContext";
import { CURRENT_HOUSEHOLD_ID } from "@/lib/mock-data";
import { cn, getInitials } from "@/lib/utils";

/** Five places. Icon plus word, always on screen, never hidden in a menu. */
const NAV = [
  { href: "/stream", label: "Feed", icon: Home },
  { href: "/archipelago", label: "Map", icon: Map },
  { href: "/ledger", label: "Trade", icon: Store },
  { href: "/pulse", label: "Events", icon: CalendarHeart },
  { href: "/mobility", label: "Boats", icon: Waves },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isOnline = useOnlineStatus();
  const { pendingCount } = useFeed();
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);

  if (pathname === "/" || pathname.startsWith("/security")) {
    return <>{children}</>;
  }

  return (
    <SearchProvider value={query}>
      <IslandBackdrop />

      <div className="relative min-h-screen">
        {/* Title bar */}
        <header className="sticky top-0 z-50 bg-white/45 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-[620px] items-center gap-3 px-4">
            <Link href="/stream" className="flex shrink-0 items-center gap-2">
              <BrandMark className="h-9 w-9" />
              <span className="text-[19px] font-extrabold tracking-tight text-ink">
                IsleHelp
              </span>
            </Link>

            {searching ? (
              <div className="flex flex-1 items-center gap-2">
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search the isles…"
                  aria-label="Search"
                  className="w-full rounded-full border-2 border-accent/30 bg-surface px-4 py-2 text-[15px] text-ink placeholder:text-ink-mute focus:border-accent focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setSearching(false);
                  }}
                  aria-label="Close search"
                  className="rounded-full p-2 text-ink-mute hover:text-ink"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="ml-auto flex items-center gap-1.5">
                {!isOnline && (
                  <span
                    title={`Offline — ${pendingCount} action${pendingCount === 1 ? "" : "s"} queued for mesh sync`}
                    className="rounded-full bg-amber-100 px-3 py-1.5 text-[12px] font-bold text-amber-800"
                  >
                    Mesh{pendingCount > 0 ? ` · ${pendingCount}` : ""}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setSearching(true)}
                  aria-label="Search"
                  className="rounded-full bg-surface/80 p-2.5 text-ink-soft transition-colors hover:bg-surface"
                >
                  <Search className="h-[19px] w-[19px]" />
                </button>
                <Link
                  href="/sos"
                  aria-label="Emergency SOS"
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[14px] font-bold transition-colors",
                    pathname.startsWith("/sos")
                      ? "bg-alert text-white"
                      : "bg-alert-soft text-alert hover:bg-alert hover:text-white",
                  )}
                >
                  <LifeBuoy className="h-[18px] w-[18px]" />
                  SOS
                </Link>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-[12px] font-bold text-white">
                  {getInitials(CURRENT_HOUSEHOLD_ID.replace("HH-", "You "))}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* The reading column, floating on the island */}
        <div className="mx-auto max-w-[620px] px-4 pb-32">
          <div className="relative overflow-hidden rounded-3xl border-2 border-white/70 px-5 pb-8 pt-5 shadow-[0_2px_10px_rgba(6,51,64,0.10),0_20px_50px_rgba(6,51,64,0.18)]">
            <PoolWater
              id="panel"
              tone="shallow"
              className="absolute inset-0 h-full w-full"
            />
            <div className="relative z-10">{children}</div>
          </div>
        </div>

        {/* Navigation — icons and words, pinned where your thumb is */}
        <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/60 bg-white/80 backdrop-blur-xl">
          <ul className="mx-auto flex max-w-[620px] items-stretch justify-around px-2 py-1.5">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <li key={href} className="flex-1">
                  <Link
                    href={href}
                    className={cn(
                      "press flex flex-col items-center gap-0.5 rounded-2xl py-2 transition-colors",
                      active
                        ? "bg-accent-soft text-accent"
                        : "text-ink-mute hover:bg-line-soft hover:text-ink",
                    )}
                  >
                    <Icon
                      className="h-[26px] w-[26px]"
                      strokeWidth={active ? 2.5 : 2}
                    />
                    <span
                      className={cn(
                        "text-[12px]",
                        active ? "font-extrabold" : "font-semibold",
                      )}
                    >
                      {label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </SearchProvider>
  );
}
