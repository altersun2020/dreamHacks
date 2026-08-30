"use client";

import type { Island } from "@/lib/types";
import { getStatusColor, getStatusLabel } from "@/lib/utils";

interface ArchipelagoMapProps {
  islands: Island[];
  distressIslandIds?: string[];
  onSelect?: (island: Island) => void;
  selectedId?: string;
}

export function ArchipelagoMap({
  islands,
  distressIslandIds = [],
  onSelect,
  selectedId,
}: ArchipelagoMapProps) {
  const home = islands.find((i) => i.isHome);
  const others = islands.filter((i) => !i.isHome);

  const positions: Record<string, { x: number; y: number }> = {
    [home?.id ?? ""]: { x: 50, y: 52 },
    [others[0]?.id ?? ""]: { x: 72, y: 30 },
    [others[1]?.id ?? ""]: { x: 28, y: 68 },
    [others[2]?.id ?? ""]: { x: 78, y: 72 },
    [others[3]?.id ?? ""]: { x: 22, y: 28 },
  };

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-ocean-700/30 bg-gradient-to-b from-ocean-800/60 to-ocean-950">
      <svg
        viewBox="0 0 100 80"
        className="absolute inset-0 h-full w-full"
        aria-label="Archipelago map"
      >
        <defs>
          <radialGradient id="water" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#1e4d6b" />
            <stop offset="100%" stopColor="#0c2d44" />
          </radialGradient>
        </defs>
        <rect width="100" height="80" fill="url(#water)" />

        {[20, 40, 60].map((y) => (
          <line
            key={`h-${y}`}
            x1="0"
            y1={y}
            x2="100"
            y2={y}
            stroke="#2d6a8a"
            strokeWidth="0.15"
            opacity="0.3"
          />
        ))}
        {[25, 50, 75].map((x) => (
          <line
            key={`v-${x}`}
            x1={x}
            y1="0"
            x2={x}
            y2="80"
            stroke="#2d6a8a"
            strokeWidth="0.15"
            opacity="0.3"
          />
        ))}

        {home &&
          others.map((island) => {
            const from = positions[home.id];
            const to = positions[island.id];
            if (!from || !to) return null;
            return (
              <line
                key={`line-${island.id}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="#3d8ab0"
                strokeWidth="0.3"
                strokeDasharray="1 1"
                opacity="0.4"
              />
            );
          })}

        {islands.map((island) => {
          const pos = positions[island.id];
          if (!pos) return null;
          const inDistress = distressIslandIds.includes(island.id);
          const color = inDistress ? "#ef4444" : getStatusColor(island.status);
          const isSelected = selectedId === island.id;

          return (
            <g
              key={island.id}
              className="cursor-pointer"
              onClick={() => onSelect?.(island)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onSelect?.(island);
              }}
            >
              {inDistress && (
                <>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={island.isHome ? 12 : 10}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="0.8"
                    className="beacon-pulse"
                    opacity="0.7"
                  />
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={island.isHome ? 10 : 8}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="0.4"
                    className="beacon-pulse-delayed"
                    opacity="0.4"
                  />
                </>
              )}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={island.isHome ? 8 : 6}
                fill="none"
                stroke={color}
                strokeWidth={isSelected ? 1.2 : 0.8}
                opacity={inDistress ? 0.8 : 0.5}
              />
              <circle
                cx={pos.x}
                cy={pos.y}
                r={island.isHome ? 5 : 3.5}
                fill={color}
                opacity={isSelected || inDistress ? 1 : 0.85}
              />
              <circle
                cx={pos.x}
                cy={pos.y}
                r={island.isHome ? 2 : 1.5}
                fill="#f5e6d3"
              />
              {inDistress && (
                <text
                  x={pos.x}
                  y={pos.y - (island.isHome ? 11 : 9)}
                  textAnchor="middle"
                  fill="#fca5a5"
                  fontSize="2.2"
                  fontWeight="700"
                >
                  SOS
                </text>
              )}
              <text
                x={pos.x}
                y={pos.y + (island.isHome ? 10 : 8)}
                textAnchor="middle"
                fill={inDistress ? "#fca5a5" : "#e8d5c0"}
                fontSize="2.5"
                fontWeight={island.isHome || inDistress ? "600" : "400"}
              >
                {island.name}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-2">
        {distressIslandIds.length > 0 && (
          <div className="flex items-center gap-1 rounded-full bg-red-950/90 px-2 py-0.5 text-[10px] font-semibold text-red-300 backdrop-blur-sm beacon-pulse-text">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            Archipelago Beacon Active
          </div>
        )}
        {(["surplus", "urgent", "event"] as const).map((status) => (
          <div
            key={status}
            className="flex items-center gap-1 rounded-full bg-ocean-950/80 px-2 py-0.5 text-[10px] text-sand-300 backdrop-blur-sm"
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: getStatusColor(status) }}
            />
            {getStatusLabel(status)}
          </div>
        ))}
      </div>
    </div>
  );
}
