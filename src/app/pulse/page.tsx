"use client";

import { Calendar, ShoppingBag, Award } from "lucide-react";
import { Header } from "@/components/Header";
import { useOnlineStatus } from "@/components/OfflineProvider";
import {
  badges,
  microMarkets,
  workParties,
  HOME_ISLAND,
} from "@/lib/mock-data";

export default function PulsePage() {
  const isOnline = useOnlineStatus();

  return (
    <>
      <Header
        title="Island Pulse"
        subtitle={`${HOME_ISLAND} · events & community action`}
        isOnline={isOnline}
      />
      <main className="mx-auto max-w-lg flex-1 space-y-6 px-4 py-4 pb-24">
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-sand-200">
            <Calendar className="h-4 w-4 text-seafoam-400" />
            Work Parties
          </h2>
          <div className="space-y-3">
            {workParties.map((party) => {
              const pct =
                (party.volunteersSigned / party.volunteersNeeded) * 100;
              return (
                <div
                  key={party.id}
                  className="rounded-xl border border-ocean-700/30 bg-ocean-900/40 p-4"
                >
                  <h3 className="font-semibold text-sand-100">
                    {party.title}
                  </h3>
                  <p className="text-xs text-sand-500">
                    {party.location} · {party.date}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex-1">
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="text-sand-400">Volunteers</span>
                        <span className="font-medium text-seafoam-300">
                          {party.volunteersSigned}/{party.volunteersNeeded}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-ocean-800">
                        <div
                          className="h-full rounded-full bg-seafoam-500/60"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      className="shrink-0 rounded-lg bg-seafoam-500/20 px-3 py-2 text-xs font-medium text-seafoam-300 hover:bg-seafoam-500/30"
                    >
                      Join
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-sand-200">
            <ShoppingBag className="h-4 w-4 text-seafoam-400" />
            Micro-Market Days
          </h2>
          <div className="space-y-3">
            {microMarkets.map((market) => (
              <div
                key={market.id}
                className="rounded-xl border border-amber-500/20 bg-gradient-to-r from-amber-500/5 to-ocean-900/40 p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-sand-100">
                      {market.vendor}
                    </h3>
                    <p className="text-sm text-sand-300">{market.items}</p>
                    <p className="mt-1 text-xs text-sand-500">
                      📍 {market.location}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-medium text-amber-300">
                    Until {market.until}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-sand-200">
            <Award className="h-4 w-4 text-seafoam-400" />
            Household Badges · HH-1042
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className="flex flex-col items-center rounded-xl border border-ocean-700/30 bg-ocean-900/40 p-3 text-center"
              >
                <span className="mb-1 text-2xl">{badge.icon}</span>
                <span className="text-xs font-semibold text-sand-200">
                  {badge.name}
                </span>
                <span className="mt-0.5 text-[10px] text-sand-500">
                  {badge.description}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
