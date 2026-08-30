"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Compass, Minus, Plus } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import type { Island } from "@/lib/types";
import { cn, getStatusColor } from "@/lib/utils";

const DEFAULT_TILT = 52;
const MIN_TILT = 12;
const MAX_TILT = 68;
const PERSPECTIVE = 900;
/** The water plane is drawn oversized so tilting never reveals its edge. */
const PLANE_SCALE = 2;

/**
 * Island placement, as offsets from the centre of the view in units of the
 * scene's own width/height. Kept well inside ±0.4 so nothing drifts out of
 * frame when the camera is orbited.
 */
const LAYOUT: { ox: number; oy: number; size: number; glyph: string }[] = [
  { ox: 0.0, oy: -0.02, size: 104, glyph: "🏝️" },
  { ox: 0.22, oy: -0.24, size: 74, glyph: "🌴" },
  { ox: -0.23, oy: -0.16, size: 70, glyph: "⛰️" },
  { ox: 0.2, oy: 0.16, size: 68, glyph: "🌾" },
  { ox: -0.22, oy: 0.14, size: 66, glyph: "🪨" },
];

interface Projected {
  island: Island;
  glyph: string;
  size: number;
  /** Plane-local position, before the camera transform. */
  u: number;
  v: number;
  /** Screen position after projection. */
  sx: number;
  sy: number;
  /** Perspective factor — >1 is nearer the camera. */
  k: number;
}

export function IsleMap3D({
  islands,
  distressIslandIds = [],
  selectedId,
  onSelect,
  /** 1 = default framing. Higher pushes the camera in on the archipelago. */
  zoom = 1,
}: {
  islands: Island[];
  distressIslandIds?: string[];
  selectedId?: string;
  onSelect?: (island: Island) => void;
  zoom?: number;
}) {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [tilt, setTilt] = useState(DEFAULT_TILT);
  const [heading, setHeading] = useState(0);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const node = sceneRef.current;
    if (!node) return;
    const update = () =>
      setDims({ w: node.clientWidth, h: node.clientHeight });
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    drag.current = { x: e.clientX, y: e.clientY };
    setDragging(true);
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    drag.current = { x: e.clientX, y: e.clientY };
    setHeading((h) => h + dx * 0.3);
    setTilt((t) => Math.min(MAX_TILT, Math.max(MIN_TILT, t - dy * 0.25)));
  }, []);

  const endDrag = useCallback(() => {
    drag.current = null;
    setDragging(false);
  }, []);

  const planeW = dims.w * PLANE_SCALE;
  const planeH = dims.h * PLANE_SCALE;
  const rad = (deg: number) => (deg * Math.PI) / 180;

  // Project each island through the same camera the CSS plane uses, so the
  // markers land exactly on their landmass and sort correctly by depth.
  const projected: Projected[] = islands
    .slice(0, LAYOUT.length)
    .map((island, i) => {
      const { ox, oy, size: baseSize, glyph } = LAYOUT[i];
      const size = baseSize * zoom;
      const u = ox * dims.w * zoom;
      const v = oy * dims.h * zoom;
      const h = rad(heading);
      const t = rad(tilt);
      const u1 = u * Math.cos(h) - v * Math.sin(h);
      const v1 = u * Math.sin(h) + v * Math.cos(h);
      const x = u1;
      const y = v1 * Math.cos(t);
      const z = v1 * Math.sin(t);
      const k = PERSPECTIVE / (PERSPECTIVE - z);
      return {
        island,
        glyph,
        size,
        u,
        v,
        sx: dims.w / 2 + x * k,
        sy: dims.h / 2 + y * k,
        k,
      };
    });

  const home = projected.find((p) => p.island.isHome) ?? projected[0];
  // Far islands paint first.
  const byDepth = [...projected].sort((a, b) => a.k - b.k);

  const toPlanePct = (value: number, planeSize: number) =>
    50 + (value / planeSize) * 100;

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200">
      <div
        ref={sceneRef}
        className="map-scene relative h-[420px] cursor-grab touch-none select-none overflow-hidden active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div className="map-water absolute inset-0" />

        {/* Tilted water plane carrying the grid, swell, routes and landmasses */}
        <div
          className={cn("map-plane absolute", dragging && "is-dragging")}
          style={{
            left: `${-(PLANE_SCALE - 1) * 50}%`,
            top: `${-(PLANE_SCALE - 1) * 50}%`,
            width: `${PLANE_SCALE * 100}%`,
            height: `${PLANE_SCALE * 100}%`,
            transform: `rotateX(${tilt}deg) rotateZ(${heading}deg)`,
          }}
        >
          <div className="map-grid absolute inset-0" />
          <div className="map-swell absolute inset-0" />

          {home && planeW > 0 && (
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              {projected
                .filter((p) => p !== home)
                .map((p) => (
                  <line
                    key={`route-${p.island.id}`}
                    x1={`${toPlanePct(home.u, planeW)}%`}
                    y1={`${toPlanePct(home.v, planeH)}%`}
                    x2={`${toPlanePct(p.u, planeW)}%`}
                    y2={`${toPlanePct(p.v, planeH)}%`}
                    stroke="rgba(255,255,255,0.55)"
                    strokeWidth="2"
                    strokeDasharray="7 9"
                    strokeLinecap="round"
                  />
                ))}
            </svg>
          )}

          {planeW > 0 &&
            projected.map(({ island, u, v, size }) => {
              const inDistress = distressIslandIds.includes(island.id);
              const selected = selectedId === island.id;
              const color = inDistress
                ? "#ef4444"
                : getStatusColor(island.status);
              return (
                <div
                  key={island.id}
                  className="absolute"
                  style={{
                    left: `${toPlanePct(u, planeW)}%`,
                    top: `${toPlanePct(v, planeH)}%`,
                  }}
                >
                  <span
                    className="ring-ripple pointer-events-none absolute rounded-full border-[3px]"
                    style={{
                      width: size * 1.7,
                      height: size * 1.7,
                      left: -(size * 0.85),
                      top: -(size * 0.85),
                      borderColor: color,
                    }}
                  />
                  <span
                    className="ring-ripple-late pointer-events-none absolute rounded-full border-2"
                    style={{
                      width: size * 1.7,
                      height: size * 1.7,
                      left: -(size * 0.85),
                      top: -(size * 0.85),
                      borderColor: color,
                    }}
                  />
                  <span
                    className="absolute rounded-[46%_54%_48%_52%/52%_46%_54%_48%]"
                    style={{
                      width: size,
                      height: size * 0.88,
                      left: -(size / 2),
                      top: -(size * 0.44),
                      background:
                        "radial-gradient(58% 58% at 42% 34%, #9fd97f 0%, #6bbf72 46%, #f2e3b4 76%, #e7d199 100%)",
                      boxShadow: selected
                        ? `0 0 0 4px ${color}, 0 16px 28px rgba(6,40,58,0.45)`
                        : "0 12px 24px rgba(6,40,58,0.38)",
                    }}
                  />
                </div>
              );
            })}
        </div>

        {/* Horizon haze */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/40 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-lagoon-900/30 to-transparent" />

        {/* Markers, projected into 2D so they always face the camera */}
        {byDepth.map(({ island, sx, sy, k, glyph }, depthIndex) => {
          const inDistress = distressIslandIds.includes(island.id);
          const selected = selectedId === island.id;
          const color = inDistress ? "#ef4444" : getStatusColor(island.status);
          const scale = Math.max(0.72, Math.min(1.18, k));
          return (
            <button
              key={island.id}
              type="button"
              onClick={() => onSelect?.(island)}
              className="marker-bob absolute flex origin-bottom flex-col items-center focus:outline-none"
              style={{
                left: sx,
                top: sy,
                transform: `translate(-50%, -100%) scale(${scale})`,
                zIndex: 10 + depthIndex,
              }}
            >
              <span
                className={cn(
                  "flex items-center justify-center rounded-full border-[3px] bg-white shadow-xl transition-all",
                  selected ? "h-14 w-14" : "h-11 w-11",
                )}
                style={{ borderColor: color }}
              >
                {island.isHome ? (
                  <BrandMark className={selected ? "h-8 w-8" : "h-6 w-6"} />
                ) : (
                  <span className={selected ? "text-2xl" : "text-lg"}>
                    {glyph}
                  </span>
                )}
              </span>

              <span
                className="w-[3px] rounded-full"
                style={{ height: 12, backgroundColor: color }}
              />
              <span
                className="h-1.5 w-1.5 rounded-full ring-2 ring-white/60"
                style={{ backgroundColor: color }}
              />

              <span
                className={cn(
                  "mt-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-bold shadow-md",
                  inDistress
                    ? "bg-red-500 text-white"
                    : selected
                      ? "brand-gradient text-white"
                      : "bg-white/95 text-lagoon-800",
                )}
              >
                {inDistress ? `SOS · ${island.name}` : island.name}
              </span>
            </button>
          );
        })}

        {/* Controls */}
        <div className="absolute right-3 top-3 z-30 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => setTilt((t) => Math.min(MAX_TILT, t + 8))}
            aria-label="Tilt down"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-lagoon-700 shadow-md backdrop-blur transition-colors hover:bg-white"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setTilt((t) => Math.max(MIN_TILT, t - 8))}
            aria-label="Tilt up"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-lagoon-700 shadow-md backdrop-blur transition-colors hover:bg-white"
          >
            <Minus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setTilt(DEFAULT_TILT);
              setHeading(0);
            }}
            aria-label="Reset view"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-lagoon-700 shadow-md backdrop-blur transition-colors hover:bg-white"
          >
            <Compass className="h-4 w-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
