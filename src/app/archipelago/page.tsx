"use client";

import { useState } from "react";
import { AlertTriangle, ArrowLeftRight, Globe, Ship } from "lucide-react";
import { Header } from "@/components/Header";
import { ArchipelagoMap } from "@/components/ArchipelagoMap";
import { useOnlineStatus } from "@/components/OfflineProvider";
import { useSOS } from "@/contexts/SOSContext";
import { islands, tradeRequests, HOME_ISLAND } from "@/lib/mock-data";
import type { Island } from "@/lib/types";
import { cn, formatRelativeTime } from "@/lib/utils";

const statusBadge: Record<string, string> = {
  open: "bg-seafoam-500/20 text-seafoam-300",
  negotiating: "bg-amber-500/20 text-amber-300",
  scheduled: "bg-sky-500/20 text-sky-300",
};

export default function ArchipelagoPage() {
  const isOnline = useOnlineStatus();
  const { distressIslands } = useSOS();
  const distressIds = distressIslands.map((d) => d.islandId);
  const [selected, setSelected] = useState<Island | null>(
    islands.find((i) => i.isHome) ?? null,
  );

  const selectedDistress = selected
    ? distressIslands.find((d) => d.islandId === selected.id)
    : null;

  return (
    <>
      <Header
        title="Archipelago Grid"
        subtitle="Cross-water network · sister islands"
        isOnline={isOnline}
      />
      <main className="mx-auto max-w-lg flex-1 space-y-5 px-4 py-4 pb-24">
        <ArchipelagoMap
          islands={islands}
          distressIslandIds={distressIds}
          selectedId={selected?.id}
          onSelect={setSelected}
        />

        {selected && (
          <div
            className={cn(
              "rounded-2xl border p-4",
              selectedDistress
                ? "border-red-500/40 bg-red-500/10"
                : "border-ocean-700/30 bg-ocean-900/40",
            )}
          >
            <div className="mb-1 flex items-center justify-between">
              <h3 className="font-semibold text-sand-100">{selected.name}</h3>
              <div className="flex gap-2">
                {selectedDistress && (
                  <span className="flex items-center gap-1 rounded-full bg-red-500/25 px-2 py-0.5 text-xs font-semibold text-red-300">
                    <AlertTriangle className="h-3 w-3" />
                    SOS
                  </span>
                )}
                {selected.isHome && (
                  <span className="rounded-full bg-seafoam-500/20 px-2 py-0.5 text-xs text-seafoam-300">
                    Home
                  </span>
                )}
              </div>
            </div>
            {selectedDistress ? (
              <div className="mt-2">
                <p className="text-sm font-medium text-red-300">
                  {selectedDistress.reason}
                </p>
                <p className="mt-1 text-xs text-sand-500">
                  Beacon activated by {selectedDistress.activatedBy} ·{" "}
                  {formatRelativeTime(selectedDistress.activatedAt)}
                </p>
              </div>
            ) : (
              <p className="text-sm text-sand-400">{selected.description}</p>
            )}
            {!selected.isHome && (
              <p className="mt-1 text-xs text-sand-500">
                {selected.distanceNm} nm from {HOME_ISLAND}
              </p>
            )}
          </div>
        )}

        <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-sand-200">
            <ArrowLeftRight className="h-4 w-4 text-seafoam-400" />
            Cross-Water Trade
          </h2>
          <div className="space-y-3">
            {tradeRequests.map((trade) => (
              <div
                key={trade.id}
                className="rounded-xl border border-ocean-700/30 bg-ocean-900/40 p-3"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-sand-400">
                    {trade.fromIsland} → {trade.toIsland}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-medium capitalize",
                      statusBadge[trade.status],
                    )}
                  >
                    {trade.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-[10px] uppercase text-sand-500">
                      Offering
                    </span>
                    <p className="text-sand-200">{trade.offering}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-sand-500">
                      Seeking
                    </span>
                    <p className="text-sand-200">{trade.seeking}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-seafoam-500/15 py-2 text-xs font-medium text-seafoam-300 hover:bg-seafoam-500/25"
                >
                  <Ship className="h-3.5 w-3.5" />
                  Negotiate Trade
                </button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-sand-200">
            <Globe className="h-4 w-4 text-seafoam-400" />
            Global Sister-Island Network
          </h2>
          <div className="rounded-xl border border-ocean-700/30 bg-gradient-to-br from-ocean-900/60 to-ocean-950 p-4">
            <p className="text-sm text-sand-300">
              Connect with remote island communities worldwide. This week:{" "}
              <span className="font-medium text-seafoam-300">
                saltwater farming techniques
              </span>{" "}
              from Farreach Isle and erosion control methods from the Azores
              sister network.
            </p>
            <button
              type="button"
              className="mt-3 rounded-lg border border-seafoam-500/30 px-4 py-2 text-sm font-medium text-seafoam-300 hover:bg-seafoam-500/10"
            >
              Browse Knowledge Exchange
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
