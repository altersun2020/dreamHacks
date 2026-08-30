"use client";

import { useState } from "react";
import {
  Package,
  Store,
  Wrench,
} from "lucide-react";
import { Header } from "@/components/Header";
import { useOnlineStatus } from "@/components/OfflineProvider";
import {
  allocations,
  directory,
  gearExchange,
  HOME_ISLAND,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Tab = "directory" | "fairshare" | "gear";

const categoryIcons: Record<string, string> = {
  business: "🏪",
  food: "🐟",
  ride: "🚗",
  artisan: "🪢",
};

export default function LedgerPage() {
  const isOnline = useOnlineStatus();
  const [tab, setTab] = useState<Tab>("directory");

  const tabs: { id: Tab; label: string; icon: typeof Store }[] = [
    { id: "directory", label: "Directory", icon: Store },
    { id: "fairshare", label: "Fair Share", icon: Package },
    { id: "gear", label: "Gear Exchange", icon: Wrench },
  ];

  return (
    <>
      <Header
        title="The Island Ledger"
        subtitle={`${HOME_ISLAND} · businesses, ration & gear`}
        isOnline={isOnline}
      />
      <main className="mx-auto max-w-lg flex-1 px-4 py-4 pb-24">
        <div className="mb-5 flex rounded-xl border border-ocean-700/40 bg-ocean-900/50 p-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-medium transition-all",
                tab === id
                  ? "bg-seafoam-500/20 text-seafoam-300"
                  : "text-sand-400 hover:text-sand-200",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        {tab === "directory" && (
          <div className="space-y-3">
            {directory.map((entry) => (
              <div
                key={entry.id}
                className="rounded-xl border border-ocean-700/30 bg-ocean-900/40 p-4"
              >
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{categoryIcons[entry.category]}</span>
                    <h3 className="font-semibold text-sand-100">
                      {entry.name}
                    </h3>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-medium",
                      entry.available
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-sand-500/20 text-sand-400",
                    )}
                  >
                    {entry.available ? "Open" : "Closed"}
                  </span>
                </div>
                <p className="text-sm text-sand-400">{entry.description}</p>
                <p className="mt-1 text-xs text-sand-500">{entry.contact}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "fairshare" && (
          <div className="space-y-4">
            <p className="text-sm text-sand-400">
              Household <span className="font-mono text-seafoam-300">HH-1042</span>{" "}
              — reserve your essential supply allocations below.
            </p>
            {allocations.map((alloc) => {
              const remaining = alloc.quota - alloc.reserved;
              const pct = (alloc.reserved / alloc.quota) * 100;
              return (
                <div
                  key={alloc.id}
                  className="rounded-xl border border-ocean-700/30 bg-ocean-900/40 p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-semibold text-sand-100">
                      {alloc.item}
                    </h3>
                    <span className="text-xs text-sand-500">
                      {alloc.reserved}/{alloc.quota} {alloc.unit}
                    </span>
                  </div>
                  <div className="mb-2 h-2 overflow-hidden rounded-full bg-ocean-800">
                    <div
                      className="h-full rounded-full bg-seafoam-500/60 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  {alloc.arrivalEta && (
                    <p className="mb-2 text-xs text-amber-300/80">
                      🚢 Cargo vessel ETA: {alloc.arrivalEta}
                    </p>
                  )}
                  <button
                    type="button"
                    disabled={remaining <= 0}
                    className={cn(
                      "w-full rounded-lg py-2 text-sm font-medium",
                      remaining > 0
                        ? "bg-seafoam-500/20 text-seafoam-300 hover:bg-seafoam-500/30"
                        : "bg-ocean-800/50 text-sand-500 cursor-not-allowed",
                    )}
                  >
                    {remaining > 0
                      ? `Reserve ${remaining} ${alloc.unit}`
                      : "Fully reserved"}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {tab === "gear" && (
          <div className="space-y-3">
            <p className="text-sm text-sand-400">
              Peer-to-peer lending for underutilized tools and equipment.
            </p>
            {gearExchange.map((gear) => (
              <div
                key={gear.id}
                className="rounded-xl border border-ocean-700/30 bg-ocean-900/40 p-4"
              >
                <h3 className="font-semibold text-sand-100">{gear.name}</h3>
                <p className="text-xs text-sand-500">{gear.owner}</p>
                <p className="mt-1 text-sm text-sand-400">{gear.condition}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-sand-500">
                    Available until {gear.availableUntil}
                  </span>
                  <button
                    type="button"
                    className="rounded-lg bg-seafoam-500/20 px-3 py-1.5 text-xs font-medium text-seafoam-300 hover:bg-seafoam-500/30"
                  >
                    Request Loan
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
