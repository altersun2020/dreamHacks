"use client";

import { useState } from "react";
import { Package, Store, Wrench } from "lucide-react";
import { PageBanner } from "@/components/app/PageBanner";
import { useFeed } from "@/contexts/FeedContext";
import { allocations, directory, gearExchange } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Tab = "directory" | "fairshare" | "gear";

/** One word telling you what kind of stall this is, and the tint behind it. */
const CATEGORY: Record<string, { kind: string; chip: string; tint: string }> = {
  business: { kind: "Store", chip: "bg-amber-500", tint: "bg-amber-50/90" },
  food: { kind: "Food", chip: "bg-teal-600", tint: "bg-teal-50/90" },
  ride: { kind: "Rides", chip: "bg-sky-600", tint: "bg-sky-50/90" },
  artisan: { kind: "Repairs", chip: "bg-violet-600", tint: "bg-violet-50/90" },
};

const TABS: { id: Tab; label: string; icon: typeof Store }[] = [
  { id: "directory", label: "Shops", icon: Store },
  { id: "fairshare", label: "Rations", icon: Package },
  { id: "gear", label: "Borrow", icon: Wrench },
];

export default function LedgerPage() {
  const { actedPostIds: claimed, commitTo } = useFeed();
  const [tab, setTab] = useState<Tab>("directory");

  return (
    <>
      <PageBanner
        title="The Island Ledger"
        blurb="Shops, your ration share, and gear to borrow."
        motif="market"
      />

      <div className="mb-5 flex gap-2">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            aria-pressed={tab === id}
            className={cn(
              "btn flex-1 py-3 text-[14px] !rounded-2xl",
              tab === id ? "btn-primary" : "btn-ghost",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Shops — a market grid of stall tiles */}
      {tab === "directory" && (
        <div className="grid grid-cols-2 gap-3">
          {directory.map((entry) => {
            const cat = CATEGORY[entry.category] ?? CATEGORY.business;
            return (
              <article
                key={entry.id}
                className={cn(
                  "surface-in relative overflow-hidden rounded-3xl border border-white/70 shadow-[0_2px_8px_rgba(6,51,64,0.07)]",
                  cat.tint,
                  !entry.available && "opacity-60 saturate-50",
                )}
              >
                {/* The stall itself, photographed */}
                {/* eslint-disable-next-line @next/next/no-img-element -- local static asset */}
                <img
                  src={entry.photo}
                  alt=""
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
                <span
                  className={cn(
                    "absolute left-3 top-3 rounded-md px-2 py-1 text-[10px] font-black uppercase tracking-wider text-white",
                    cat.chip,
                  )}
                >
                  {cat.kind}
                </span>
                <span
                  className={cn(
                    "absolute right-3 top-3 rounded-full px-2 py-1 text-[10px] font-extrabold uppercase text-white",
                    entry.available ? "bg-emerald-600" : "bg-ink/70",
                  )}
                >
                  {entry.available ? "Open" : "Shut"}
                </span>

                <div className="p-3.5">
                  <p className="text-[17px] font-extrabold leading-tight text-ink">
                    {entry.name}
                  </p>
                  <p className="mt-1 text-[13px] leading-snug text-ink-soft">
                    {entry.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Rations — big quota gauges, nothing like a list */}
      {tab === "fairshare" && (
        <div className="space-y-4">
          <p className="text-[14px] font-semibold text-ink-mute">
            One share per household · HH-1042
          </p>
          {allocations.map((alloc) => {
            const mine = claimed.has(alloc.id);
            const reserved = alloc.reserved + (mine ? 1 : 0);
            const left = alloc.quota - reserved;
            return (
              <article
                key={alloc.id}
                className="rounded-3xl border-2 border-line bg-surface p-5"
              >
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[17px] font-extrabold leading-tight text-ink">
                      {alloc.item}
                    </p>
                    {alloc.arrivalEta && (
                      <p className="mt-0.5 text-[12px] font-semibold text-[#a2620f]">
                        Cargo vessel · {alloc.arrivalEta}
                      </p>
                    )}
                  </div>
                  <p className="shrink-0 text-right">
                    <span className="text-[32px] font-extrabold leading-none tabular-nums text-ink">
                      {left}
                    </span>
                    <span className="ml-1 text-[13px] font-bold text-ink-mute">
                      {alloc.unit} left
                    </span>
                  </p>
                </div>

                {/* Segmented gauge — reads as a ration, not a progress bar */}
                <div className="mt-3 flex gap-1">
                  {Array.from({ length: alloc.quota }).map((_, i) => (
                    <span
                      key={i}
                      className={cn(
                        "h-3 flex-1 rounded-sm",
                        i < reserved ? "bg-[#c8871d]" : "bg-line",
                      )}
                    />
                  ))}
                </div>
                <p className="mt-1.5 text-[12px] font-semibold text-ink-mute">
                  {reserved}/{alloc.quota} claimed island-wide
                </p>

                <button
                  type="button"
                  onClick={() => commitTo(alloc.id, `Claimed ${alloc.item}`)}
                  disabled={mine || left <= 0}
                  className={cn(
                    "btn mt-3 w-full py-3 text-[15px]",
                    mine ? "btn-done" : left > 0 ? "btn-dark" : "",
                  )}
                >
                  {mine ? "Reserved" : left > 0 ? "Claim your share" : "All gone"}
                </button>
              </article>
            );
          })}
        </div>
      )}

      {/* Borrow — a lending shelf */}
      {tab === "gear" && (
        <div className="space-y-2">

          {gearExchange.map((gear) => {
            const mine = claimed.has(gear.id);
            return (
              <article
                key={gear.id}
                className="flex items-center gap-4 rounded-2xl border-2 border-line bg-surface p-4"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-line-soft text-[22px]">
                  🧰
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[16px] font-extrabold leading-tight text-ink">
                    {gear.name}
                  </p>
                  <p className="text-[12px] text-ink-mute">
                    {gear.owner} · {gear.condition}
                  </p>
                  <p className="mt-0.5 text-[12px] font-semibold text-ink-soft">
                    Free until {gear.availableUntil}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => commitTo(gear.id, `Borrow ${gear.name}`)}
                  disabled={mine}
                  className={cn(
                    "btn shrink-0 px-4 py-2.5 text-[13px]",
                    mine ? "btn-done" : "btn-dark",
                  )}
                >
                  {mine ? "Yours" : "Borrow"}
                </button>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
