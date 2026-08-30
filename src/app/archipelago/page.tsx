"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  Globe2,
  Home,
  Minus,
  Plus,
  Users,
} from "lucide-react";
import { IsleMap3D } from "@/components/IsleMap3D";
import { CrossingTransition } from "@/components/app/CrossingTransition";
import { PageBanner } from "@/components/app/PageBanner";
import { WorldGlobe } from "@/components/app/WorldGlobe";
import { PostCard } from "@/components/app/PostCard";
import { useFeed } from "@/contexts/FeedContext";
import { useSOS } from "@/contexts/SOSContext";
import {
  HOME_ISLAND,
  islands,
  sisterIslands,
  tradeRequests,
} from "@/lib/mock-data";
import type { Island } from "@/lib/types";
import { cn, formatRelativeTime, getStatusColor, getStatusLabel } from "@/lib/utils";

/**
 * One continuous zoom. Below the threshold you are looking at the world as a
 * globe; past it the view becomes the 3D rendering of the home archipelago,
 * because individual isles are meaningless as dots on a continent.
 */
const WORLD_SCALE = 190;
const LOCAL_SCALE = 14000;
const GROUND_SCALE = 22000;
const HOME_ROTATION: [number, number] = [123.2, -48.5];
const WORLD_ROTATION: [number, number] = [60, -20];

export default function ArchipelagoPage() {
  const { distressIslands } = useSOS();
  const { posts, actedPostIds: committed, commitTo } = useFeed();
  const distressIds = distressIslands.map((d) => d.islandId);

  const [selected, setSelected] = useState<Island>(
    islands.find((i) => i.isHome) ?? islands[0],
  );

  const holder = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [rotation, setRotation] = useState<[number, number]>(HOME_ROTATION);
  const [scale, setScale] = useState(LOCAL_SCALE);
  // 190 → 304 → 486: the globe never zooms past a readable whole-earth view.
  /**
   * One continuous zoom, four readings. Past `GROUND_SCALE` the globe hands
   * over to the 3D isles — signposted in the scope strip so it is never a
   * surprise, and crossfaded rather than snapped.
   */
  const scope =
    scale > GROUND_SCALE
      ? "ground"
      : scale > 4000
        ? "local"
        : scale > 500
          ? "region"
          : "world";
  const onGround = scope === "ground";
  /** Further zooming keeps pushing the 3D camera in. */
  const groundZoom = Math.min(2.6, Math.max(0.9, scale / (GROUND_SCALE * 1.15)));

  useEffect(() => {
    const node = holder.current;
    if (!node) return;
    const update = () => setSize({ w: node.clientWidth, h: node.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  const selectIsland = useCallback((isle: Island) => setSelected(isle), []);

  const zoomIn = useCallback(
    () => setScale((v) => Math.min(70000, v * 1.9)),
    [],
  );
  const zoomOut = useCallback(
    () => setScale((v) => Math.max(150, v / 1.9)),
    [],
  );

  const goWorld = useCallback(() => {
    setScale(WORLD_SCALE);
    setRotation(WORLD_ROTATION);
  }, []);

  const goHome = useCallback(() => {
    setScale(GROUND_SCALE * 1.3);
    setRotation(HOME_ROTATION);
  }, []);

  const openNeeds = [...islands, ...sisterIslands].filter(
    (i) => i.status === "urgent",
  ).length;

  const selectedDistress = distressIslands.find(
    (d) => d.islandId === selected.id,
  );

  /** The isle's own posts — its story, in its neighbours' words. */
  const islandPosts = useMemo(
    () => posts.filter((p) => p.island === selected.name).slice(0, 3),
    [posts, selected.name],
  );

  return (
    <div className="space-y-4">
      <CrossingTransition />
      <PageBanner
        title="Archipelago Grid"
        blurb="Who has spare, who needs help, and how far away they are."
        motif="chart"
      />
      {distressIds.length > 0 && (
        <div className="flex items-center gap-2 rounded-2xl border border-alert/25 bg-alert-soft px-4 py-3">
          <AlertTriangle className="h-4 w-4 shrink-0 text-alert" />
          <p className="text-sm font-semibold text-alert">
            Beacon lit on {distressIds.length} isle
            {distressIds.length === 1 ? "" : "s"}
          </p>
        </div>
      )}

      {/* Who you are connected to, stated plainly */}
      <section className="grid grid-cols-3 gap-2">
        {[
          { value: islands.length - 1, label: "Neighbours", tone: "bg-[#134e75]" },
          { value: sisterIslands.length, label: "Worldwide", tone: "bg-[#0e7c6b]" },
          { value: openNeeds, label: "Need help", tone: "bg-[#b4400f]" },
        ].map((stat, i) => (
          <div
            key={stat.label}
            style={{ animationDelay: `${i * 110}ms` }}
            className={cn(
              "count-in glint relative overflow-hidden rounded-2xl px-3 py-4 text-center text-white",
              stat.tone,
            )}
          >
            <p className="text-[30px] font-extrabold leading-none tabular-nums">
              {stat.value}
            </p>
            <p className="mt-1.5 text-[11px] font-bold uppercase leading-tight tracking-wide text-white/80">
              {stat.label}
            </p>
          </div>
        ))}
      </section>

      {/* Map */}
      <section className="overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          <div>
            <h2 className="text-[18px] font-extrabold leading-tight text-ink">
              {onGround
                ? HOME_ISLAND
                : scope === "local"
                  ? `Around ${HOME_ISLAND}`
                  : scope === "region"
                    ? "Your waters"
                    : "The whole network"}
            </h2>
            <p className="text-[12px] font-semibold text-ink-mute">
              {onGround
                ? "Drag to orbit the isles · zoom out for the network"
                : "Drag to spin · keep zooming to land on the isles"}
            </p>
          </div>

          <div className="flex rounded-lg bg-line-soft p-1">
            <button
              type="button"
              onClick={goHome}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors duration-150",
                onGround
                  ? "bg-surface text-accent shadow-sm"
                  : "text-ink-mute hover:text-ink",
              )}
            >
              <Home className="h-3.5 w-3.5" />
              My isles
            </button>
            <button
              type="button"
              onClick={goWorld}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors duration-150",
                scope === "world"
                  ? "bg-surface text-accent shadow-sm"
                  : "text-ink-mute hover:text-ink",
              )}
            >
              <Globe2 className="h-3.5 w-3.5" />
              World
            </button>
          </div>
        </div>

        <div ref={holder} className="relative h-[460px] overflow-hidden bg-night-950">
          {/* The isles themselves, once you are close enough to stand on them */}
          <div
            className={cn(
              "absolute inset-0 p-3 transition-opacity duration-500",
              onGround ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            {onGround && (
              <IsleMap3D
                islands={islands}
                distressIslandIds={distressIds}
                selectedId={selected.id}
                onSelect={selectIsland}
                zoom={groundZoom}
              />
            )}
          </div>

          <div
            className={cn(
              "absolute inset-0 transition-opacity duration-500",
              onGround ? "pointer-events-none opacity-0" : "opacity-100",
            )}
          >
          {size.w > 0 && (
            <WorldGlobe
              width={size.w}
              height={size.h}
              islands={[...islands, ...sisterIslands]}
              distressIslandIds={distressIds}
              selectedId={selected.id}
              rotation={rotation}
              scale={scale}
              onRotate={setRotation}
              onSelect={selectIsland}
            />
          )}
          </div>

          <div className="absolute right-3 top-3 z-10 flex flex-col gap-1.5">
            <button
              type="button"
              onClick={zoomIn}
              aria-label="Zoom in"
              className="btn btn-ghost h-10 w-10 !rounded-xl"
            >
              <Plus className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={zoomOut}
              aria-label="Zoom out"
              className="btn btn-ghost h-10 w-10 !rounded-xl"
            >
              <Minus className="h-5 w-5" />
            </button>
          </div>

          {/* Where the current zoom sits, so scope is never a surprise */}
          <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-1.5">
            {(["world", "region", "local", "ground"] as const).map((s2) => (
              <span
                key={s2}
                className={cn(
                  "rounded-full px-2 py-1 text-[10px] font-extrabold capitalize transition-colors",
                  scope === s2
                    ? "bg-white text-night-950"
                    : "bg-black/35 text-white/55",
                )}
              >
                {s2}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* What the ring colours mean */}
      <section className="flex flex-wrap gap-2">
        {(
          [
            ["surplus", "Has spare"],
            ["urgent", "Needs help"],
            ["event", "Market or event"],
          ] as const
        ).map(([status, label]) => (
          <span
            key={status}
            className="flex items-center gap-2 rounded-full border-2 border-line bg-surface px-3 py-1.5 text-[12px] font-bold text-ink-soft"
          >
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: getStatusColor(status) }}
            />
            {label}
          </span>
        ))}
      </section>

      {/* The selected isle's story */}
      <section className="overflow-hidden rounded-2xl border border-line bg-surface">
        <div
          className="flex items-start justify-between gap-3 px-4 py-3"
          style={{
            background: `linear-gradient(135deg, ${
              selectedDistress ? "#fecdd3" : getStatusColor(selected.status)
            }22, transparent)`,
          }}
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{
                  backgroundColor: selectedDistress
                    ? "#e11d48"
                    : getStatusColor(selected.status),
                }}
              />
              <h2 className="truncate text-[26px] font-extrabold tracking-tight text-ink">
                {selected.name}
              </h2>
            </div>
            <p className="mt-0.5 text-xs text-ink-mute">
              {selected.region ??
                (selected.isHome
                  ? "Your home isle"
                  : `${selected.distanceNm} nm from ${HOME_ISLAND}`)}
              {selected.households ? ` · ${selected.households} households` : ""}
            </p>
          </div>
          <span
            className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white"
            style={{
              backgroundColor: selectedDistress
                ? "#e11d48"
                : getStatusColor(selected.status),
            }}
          >
            {selectedDistress ? "SOS" : getStatusLabel(selected.status)}
          </span>
        </div>

        <div className="px-4 pb-4">
          <p className="text-sm leading-relaxed text-ink-soft">
            {selectedDistress?.reason ?? selected.description}
          </p>
          {selectedDistress && (
            <p className="mt-1 text-xs font-medium text-alert">
              Beacon lit by {selectedDistress.activatedBy} ·{" "}
              {formatRelativeTime(selectedDistress.activatedAt)}
            </p>
          )}

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-emerald-200/70 bg-emerald-50/60 p-3">
              <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                <ArrowUpRight className="h-3.5 w-3.5" />
                Offering
              </p>
              <ul className="mt-2 space-y-1">
                {(selected.offers ?? []).map((o) => (
                  <li key={o} className="text-sm text-ink-soft">
                    {o}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-amber-200/70 bg-amber-50/60 p-3">
              <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-700">
                <ArrowDownLeft className="h-3.5 w-3.5" />
                Needs
              </p>
              <ul className="mt-2 space-y-1">
                {(selected.needs ?? []).map((n) => (
                  <li key={n} className="text-sm text-ink-soft">
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {!selected.isHome && (
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                className="flex-1 rounded-xl bg-accent py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-accent"
              >
                {selected.isSister ? "Open exchange" : "Propose a trade"}
              </button>
              <button
                type="button"
                className="flex-1 rounded-xl border border-line py-2.5 text-sm font-semibold text-ink-soft transition-colors duration-150 hover:bg-line-soft"
              >
                Message islanders
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Cross-water trade — routes and supply drops between isles */}
      <section className="overflow-hidden rounded-2xl border border-line bg-surface">
        <h3 className="border-b-2 border-line px-4 py-3 text-[17px] font-extrabold text-ink">
          Open trades
        </h3>
        <ul className="divide-y divide-line">
          {tradeRequests.map((trade) => {
            const open = committed.has(trade.id);
            return (
              <li key={trade.id} className="px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-[12px] font-medium text-ink-mute">
                    {trade.fromIsland} → {trade.toIsland}
                  </p>
                  <span className="shrink-0 text-[11px] font-semibold capitalize text-ink-mute">
                    {trade.status}
                  </span>
                </div>
                <p className="mt-1 text-[14px] leading-snug text-ink">
                  <span className="font-semibold text-accent">
                    {trade.offering}
                  </span>
                  <span className="text-ink-mute"> for </span>
                  <span className="font-semibold">{trade.seeking}</span>
                </p>
                <button
                  type="button"
                  onClick={() => commitTo(trade.id, "Trade opened")}
                  disabled={open}
                  className={cn(
                    "btn mt-2 px-4 py-2 text-[12px]",
                    open ? "btn-done" : "btn-dark",
                  )}
                >
                  {open ? "Requested" : "Request"}
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* What the isle is actually posting */}
      {islandPosts.length > 0 && (
        <section className="space-y-3">
          <h3 className="flex items-center gap-2 px-1 text-sm font-semibold text-ink">
            <Users className="h-4 w-4 text-ink-mute" />
            From {selected.name}
          </h3>
          {islandPosts.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} />
          ))}
        </section>
      )}
    </div>
  );
}
