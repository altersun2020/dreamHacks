"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { geoCircle, geoDistance, geoGraticule10, geoOrthographic, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { FeatureCollection, Geometry } from "geojson";
import type { Topology } from "topojson-specification";
import worldTopo from "world-atlas/countries-110m.json";
import type { Island } from "@/lib/types";
import { getStatusColor } from "@/lib/utils";

// 110m country topology — bundled, so the globe works with no network at all.
const world = worldTopo as unknown as Topology;
const countries = feature(
  world,
  world.objects.countries,
) as unknown as FeatureCollection<Geometry>;
const graticule = geoGraticule10();

export interface GlobeMarker {
  island: Island;
  x: number;
  y: number;
  visible: boolean;
}

interface WorldGlobeProps {
  width: number;
  height: number;
  islands: Island[];
  distressIslandIds?: string[];
  selectedId?: string;
  /** [longitude, latitude] the globe is turned to. */
  rotation: [number, number];
  scale: number;
  onRotate: (next: [number, number]) => void;
  onSelect: (island: Island) => void;
}

export function WorldGlobe({
  width,
  height,
  islands,
  distressIslandIds = [],
  selectedId,
  rotation,
  scale,
  onRotate,
  onSelect,
}: WorldGlobeProps) {
  // Closer in, isles earn names; far out they are just points of light.
  const showLabels = scale > 520;
  const drag = useRef<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  const projection = useMemo(
    () =>
      geoOrthographic()
        .rotate([rotation[0], rotation[1]])
        .scale(scale)
        .translate([width / 2, height / 2])
        .clipAngle(90),
    [rotation, scale, width, height],
  );

  const path = useMemo(() => geoPath(projection), [projection]);
  const centre = useMemo<[number, number]>(
    () => [-rotation[0], -rotation[1]],
    [rotation],
  );

  const markers: GlobeMarker[] = useMemo(
    () =>
      islands.map((island) => {
        const point: [number, number] = [island.lng, island.lat];
        const xy = projection(point);
        // Orthographic still projects the far hemisphere, so cull by angle.
        const visible =
          !!xy && geoDistance(point, centre) < Math.PI / 2 - 0.02;
        return {
          island,
          x: xy?.[0] ?? 0,
          y: xy?.[1] ?? 0,
          visible,
        };
      }),
    [islands, projection, centre],
  );

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    drag.current = { x: e.clientX, y: e.clientY };
    setDragging(true);
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!drag.current) return;
      const dx = e.clientX - drag.current.x;
      const dy = e.clientY - drag.current.y;
      drag.current = { x: e.clientX, y: e.clientY };
      // Slower turn when zoomed in, so close work stays controllable.
      const k = 120 / scale;
      onRotate([
        rotation[0] + dx * k,
        Math.max(-85, Math.min(85, rotation[1] - dy * k)),
      ]);
    },
    [onRotate, rotation, scale],
  );

  const endDrag = useCallback(() => {
    drag.current = null;
    setDragging(false);
  }, []);

  const sphere = useMemo(() => path({ type: "Sphere" }) ?? "", [path]);
  const halo = useMemo(
    () => geoCircle().center(centre).radius(89.6)(),
    [centre],
  );

  return (
    <svg
      width={width}
      height={height}
      className={dragging ? "cursor-grabbing" : "cursor-grab"}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      role="img"
      aria-label="World map of connected isles"
    >
      <defs>
        <radialGradient id="ocean" cx="38%" cy="32%" r="72%">
          <stop offset="0%" stopColor="#1E7FA8" />
          <stop offset="60%" stopColor="#0E4E6C" />
          <stop offset="100%" stopColor="#062B3E" />
        </radialGradient>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="70%" stopColor="#4FD8C4" stopOpacity="0" />
          <stop offset="100%" stopColor="#4FD8C4" stopOpacity="0.35" />
        </radialGradient>
      </defs>

      {/* Atmosphere */}
      <circle
        cx={width / 2}
        cy={height / 2}
        r={scale * 1.08}
        fill="url(#glow)"
      />

      <path d={sphere} fill="url(#ocean)" />
      <path
        d={path(graticule) ?? ""}
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={0.4}
        opacity={0.12}
      />

      {countries.features.map((f, i) => (
        <path
          key={i}
          d={path(f) ?? ""}
          fill="#125A46"
          stroke="#0B3B52"
          strokeWidth={0.3}
        />
      ))}

      {/* Terminator rim */}
      <path d={path(halo) ?? ""} fill="none" stroke="#7FE3D4" strokeWidth={1.2} opacity={0.35} />
      <path d={sphere} fill="none" stroke="#8FE7DA" strokeWidth={1.5} opacity={0.5} />

      {markers.map(({ island, x, y, visible }, index) => {
        if (!visible) return null;
        const inDistress = distressIslandIds.includes(island.id);
        const colour = inDistress ? "#ef4444" : getStatusColor(island.status);
        const selected = selectedId === island.id;
        const r = island.isHome ? 7 : island.isSister ? 5 : 5.5;
        return (
          <g
            key={island.id}
            transform={`translate(${x},${y})`}
            className="cursor-pointer"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onSelect(island)}
          >
            <circle r={r * 2.6} fill={colour} opacity={0.16} className="ring-ripple" />
            <circle r={r + 3} fill="#04141D" opacity={0.55} />
            <circle
              r={r}
              fill={colour}
              stroke="#FFFFFF"
              strokeWidth={selected ? 2.5 : 1.4}
            />
            {island.isHome && <circle r={2} fill="#FFFFFF" />}
            {showLabels && (
              (() => {
                // Alternate above/below so close neighbours do not collide.
                const above = index % 2 === 1;
                const ly = above ? -(r + 20) : r + 6;
                return (
                  <>
                    <rect
                      x={-island.name.length * 3.1 - 6}
                      y={ly}
                      width={island.name.length * 6.2 + 12}
                      height={17}
                      rx={8.5}
                      fill="#04141d"
                      opacity="0.78"
                    />
                    <text
                      y={ly + 12}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="10.5"
                      fontWeight="700"
                    >
                      {island.name}
                    </text>
                  </>
                );
              })()
            )}
          </g>
        );
      })}
    </svg>
  );
}
