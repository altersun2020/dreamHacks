"use client";

import { AlertTriangle, CloudRain, Ship, Waves } from "lucide-react";
import { Header } from "@/components/Header";
import { useOnlineStatus } from "@/components/OfflineProvider";
import { boatTrips, weatherAlerts, HOME_ISLAND } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const alertStyles = {
  info: "border-sky-500/30 bg-sky-500/10",
  warning: "border-amber-500/30 bg-amber-500/10",
  critical: "border-red-500/30 bg-red-500/10",
};

const alertIcons = {
  tide: Waves,
  storm: CloudRain,
  wind: AlertTriangle,
};

export default function MobilityPage() {
  const isOnline = useOnlineStatus();

  return (
    <>
      <Header
        title="Coastal Mobility"
        subtitle={`${HOME_ISLAND} · boats, tides & weather`}
        isOnline={isOnline}
      />
      <main className="mx-auto max-w-lg flex-1 space-y-6 px-4 py-4 pb-24">
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-sand-200">
            <Waves className="h-4 w-4 text-seafoam-400" />
            Tide & Weather Alerts
          </h2>
          <div className="space-y-2">
            {weatherAlerts.map((alert) => {
              const Icon = alertIcons[alert.type];
              return (
                <div
                  key={alert.id}
                  className={cn(
                    "flex gap-3 rounded-xl border p-3",
                    alertStyles[alert.severity],
                  )}
                >
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                  <div>
                    <p className="text-sm text-sand-200">{alert.message}</p>
                    <p className="mt-1 text-xs text-sand-500">
                      Valid until {alert.validUntil}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-sand-200">
            <Ship className="h-4 w-4 text-seafoam-400" />
            Boat Pool & Water Taxi
          </h2>
          <div className="space-y-3">
            {boatTrips.map((trip) => {
              const available = trip.seats - trip.seatsTaken;
              return (
                <div
                  key={trip.id}
                  className="rounded-xl border border-ocean-700/30 bg-ocean-900/40 p-4"
                >
                  <div className="mb-1 flex items-center justify-between">
                    <h3 className="font-semibold text-sand-100">
                      {trip.vessel}
                    </h3>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-medium",
                        trip.type === "passenger"
                          ? "bg-sky-500/20 text-sky-300"
                          : "bg-amber-500/20 text-amber-300",
                      )}
                    >
                      {trip.type === "passenger" ? "Passenger" : "Supply"}
                    </span>
                  </div>
                  <p className="text-xs text-sand-500">
                    Captain {trip.captain}
                  </p>
                  <p className="mt-1 text-sm text-sand-300">{trip.route}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-sand-400">
                      Departs {trip.departure}
                    </span>
                    <span className="text-xs font-medium text-seafoam-300">
                      {available} seat{available !== 1 ? "s" : ""} left
                    </span>
                  </div>
                  <button
                    type="button"
                    className="mt-3 w-full rounded-lg bg-seafoam-500/20 py-2 text-sm font-medium text-seafoam-300 hover:bg-seafoam-500/30"
                  >
                    {trip.type === "passenger"
                      ? "Reserve Seat"
                      : "Request Pickup"}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-xl border border-ocean-700/30 bg-gradient-to-br from-ocean-900/60 to-ocean-950 p-4">
          <h3 className="mb-2 text-sm font-semibold text-sand-200">
            Low-Bandwidth Mesh Sync
          </h3>
          <p className="text-sm text-sand-400">
            When cell or power grids fail, IsleHelp syncs via Bluetooth and local
            Wi-Fi mesh. Posts and actions queue in IndexedDB and propagate when
            neighbors come within range.
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-seafoam-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-seafoam-400" />
            Mesh listener active · 2 peers nearby
          </div>
        </section>
      </main>
    </>
  );
}
