"use client";

import type { HazardPin } from "@/lib/types";
import {
  formatRelativeTime,
  getHazardColor,
  getHazardTypeLabel,
  cn,
} from "@/lib/utils";

interface IsleMapProps {
  hazards: HazardPin[];
  selectedId?: string;
  onSelect?: (hazard: HazardPin) => void;
  personalPin?: { lat: number; lng: number };
}

const hazardIcons: Record<string, string> = {
  "Fallen Tree": "🌴",
  "Sea Wall Damage": "🌊",
  "Blocked Road": "🚧",
  "Ocean Discoloration": "🫧",
  "Oil Spill": "🛢️",
  "Invasive Species": "🦀",
};

export function IsleMap({
  hazards,
  selectedId,
  onSelect,
  personalPin,
}: IsleMapProps) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-ocean-700/30 bg-gradient-to-b from-emerald-900/20 via-ocean-800/40 to-ocean-950">
      <svg
        viewBox="0 0 100 80"
        className="absolute inset-0 h-full w-full"
        aria-label="IsleMap — local hazard pins"
      >
        <defs>
          <radialGradient id="isle-land" cx="50%" cy="45%" r="45%">
            <stop offset="0%" stopColor="#2d5a3d" />
            <stop offset="100%" stopColor="#1a3d2a" />
          </radialGradient>
        </defs>

        {/* Water */}
        <rect width="100" height="80" fill="#0c2d44" />
        {/* Island landmass */}
        <ellipse cx="50" cy="45" rx="38" ry="28" fill="url(#isle-land)" opacity="0.9" />
        {/* Dock area */}
        <rect x="58" y="22" width="12" height="6" rx="1" fill="#3d5a4a" opacity="0.7" />
        <text x="64" y="20" textAnchor="middle" fill="#9a8570" fontSize="2">Dock</text>
        {/* High-Ground Hub */}
        <circle cx="38" cy="58" r="3" fill="#4a6741" opacity="0.8" />
        <text x="38" y="64" textAnchor="middle" fill="#9a8570" fontSize="2">Hub</text>

        {hazards.map((hazard) => {
          const isSelected = selectedId === hazard.id;
          const color = getHazardColor(hazard.severity);
          const icon = hazardIcons[hazard.category] ?? "⚠️";

          return (
            <g
              key={hazard.id}
              className="cursor-pointer"
              onClick={() => onSelect?.(hazard)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onSelect?.(hazard);
              }}
            >
              {hazard.severity === "critical" && (
                <circle
                  cx={hazard.x}
                  cy={hazard.y}
                  r="5"
                  fill="none"
                  stroke={color}
                  strokeWidth="0.5"
                  className="beacon-pulse"
                  opacity="0.6"
                />
              )}
              <circle
                cx={hazard.x}
                cy={hazard.y}
                r={isSelected ? 4 : 3}
                fill={color}
                stroke={isSelected ? "#f5e6d3" : "none"}
                strokeWidth="0.4"
              />
              <text
                x={hazard.x}
                y={hazard.y + 0.8}
                textAnchor="middle"
                fontSize="2.5"
              >
                {icon}
              </text>
            </g>
          );
        })}

        {personalPin && (
          <g>
            <circle
              cx={50}
              cy={45}
              r="6"
              fill="none"
              stroke="#ef4444"
              strokeWidth="0.6"
              className="beacon-pulse"
            />
            <circle cx={50} cy={45} r="2.5" fill="#ef4444" />
            <text x={50} y={53} textAnchor="middle" fill="#fca5a5" fontSize="2" fontWeight="600">
              SOS
            </text>
          </g>
        )}
      </svg>

      <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1.5">
        {(["infrastructure", "ecological"] as const).map((type) => (
          <div
            key={type}
            className="flex items-center gap-1 rounded-full bg-ocean-950/80 px-2 py-0.5 text-[10px] text-sand-300 backdrop-blur-sm"
          >
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                type === "infrastructure" ? "bg-orange-500" : "bg-teal-400",
              )}
            />
            {getHazardTypeLabel(type)}
          </div>
        ))}
      </div>
    </div>
  );
}

export function HazardPinCard({ hazard }: { hazard: HazardPin }) {
  const icon = hazardIcons[hazard.category] ?? "⚠️";

  return (
    <div
      className={cn(
        "rounded-xl border p-3",
        hazard.severity === "critical"
          ? "border-red-500/40 bg-red-500/10"
          : "border-ocean-700/30 bg-ocean-900/40",
      )}
    >
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>{icon}</span>
          <span className="font-semibold text-sand-100">{hazard.category}</span>
        </div>
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-medium capitalize"
          style={{
            backgroundColor: `${getHazardColor(hazard.severity)}20`,
            color: getHazardColor(hazard.severity),
          }}
        >
          {hazard.severity}
        </span>
      </div>
      <p className="text-sm text-sand-300">{hazard.description}</p>
      <div className="mt-2 flex items-center justify-between text-xs text-sand-500">
        <span>{hazard.reportedBy}</span>
        <span>{formatRelativeTime(hazard.createdAt)}</span>
      </div>
      {hazard.hasPhoto && (
        <span className="mt-1 inline-block text-[10px] text-sand-500">📷 Photo attached</span>
      )}
      <p className="mt-1 font-mono text-[10px] text-sand-600">
        {hazard.lat.toFixed(4)}, {hazard.lng.toFixed(4)}
      </p>
    </div>
  );
}
