"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { HOME_ISLAND, islands } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

/** Where the network nodes land once you surface. */
const NODES = [
  { x: 50, y: 50, r: 13, home: true },
  { x: 20, y: 26, r: 8 },
  { x: 80, y: 30, r: 8 },
  { x: 26, y: 76, r: 7 },
  { x: 76, y: 74, r: 7 },
  { x: 50, y: 12, r: 6 },
];

const BUBBLES = Array.from({ length: 18 }, (_, i) => ({
  left: `${(i * 37) % 96}%`,
  size: 4 + ((i * 7) % 14),
  delay: `${(i % 9) * 0.18}s`,
  dur: `${1.4 + ((i * 3) % 9) * 0.12}s`,
}));

/**
 * The crossing: you dive off your isle, rush through the channel, and surface
 * inside the network as the routes draw themselves between the isles.
 */
export function CrossingTransition() {
  const [phase, setPhase] = useState<"dive" | "network" | "done">("dive");

  useEffect(() => {
    const a = setTimeout(() => setPhase("network"), 1150);
    const b = setTimeout(() => setPhase("done"), 2650);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);

  if (phase === "done") return null;
  // Portalled for the same reason as the story viewer: AppShell's `relative
  // z-10` panel boxes in any z-index set inside it.
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      role="presentation"
      onClick={() => setPhase("done")}
      className={cn(
        "fixed inset-0 z-[90] flex items-center justify-center overflow-hidden transition-opacity duration-500",
        phase === "network" && "opacity-100",
      )}
      style={{
        background:
          "radial-gradient(120% 100% at 50% 45%, #21c3dd 0%, #058ba6 45%, #033b52 100%)",
      }}
    >
      {/* Everything below is laid out against a phone-width stage, not the
          viewport. On a wide monitor the 100x100 network scaled up 20x, which
          turned the home isle into a giant white disc and pushed the outer
          isles off both edges. */}
      <div className="relative h-full w-full max-w-[620px] overflow-hidden">
      {/* Pool caustics wobbling over everything */}
      <div className="caustics absolute inset-0 opacity-40" />

      {/* Rushing rings — the sense of speed through water */}
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="dive-rush absolute left-1/2 top-1/2 h-[54vmin] w-[54vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white/45"
          style={{ animationDelay: `${i * 0.28}s` }}
        />
      ))}

      {/* Bubbles streaming past */}
      {BUBBLES.map((b, i) => (
        <span
          key={i}
          className="bubble absolute bottom-0 rounded-full bg-white/55"
          style={{
            left: b.left,
            width: b.size,
            height: b.size,
            animationDelay: b.delay,
            animationDuration: b.dur,
          }}
        />
      ))}

      {/* The network snapping into place */}
      {phase === "network" && (
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-x-0 top-[8%] mx-auto h-[62%] w-full"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          {NODES.slice(1).map((n, i) => (
            <line
              key={i}
              x1="50"
              y1="50"
              x2={n.x}
              y2={n.y}
              stroke="#fff"
              strokeWidth="0.5"
              strokeLinecap="round"
              className="net-draw"
              style={{ animationDelay: `${i * 90}ms` }}
            />
          ))}
          {NODES.map((n, i) => (
            <g key={i} className="count-in" style={{ animationDelay: `${300 + i * 90}ms` }}>
              <circle cx={n.x} cy={n.y} r={n.r} fill="#fff" opacity={n.home ? 0.95 : 0.7} />
              <circle
                cx={n.x}
                cy={n.y}
                r={n.r + 3}
                fill="none"
                stroke="#fff"
                strokeWidth="0.6"
                opacity="0.5"
              />
            </g>
          ))}
        </svg>
      )}

      {/* Words */}
      <div className="absolute inset-x-0 bottom-[18%] px-8 text-center">
        <p
          className={cn(
            "text-[12px] font-extrabold uppercase tracking-[0.34em] transition-all duration-500",
            phase === "dive"
              ? "text-white/70"
              : "-translate-y-2 text-white/0",
          )}
        >
          Leaving {HOME_ISLAND}
        </p>
        <p
          className={cn(
            "mt-2 text-[30px] font-extrabold leading-tight tracking-tight text-white drop-shadow-lg transition-all duration-500",
            phase === "network"
              ? "translate-y-0 opacity-100"
              : "translate-y-3 opacity-0",
          )}
        >
          {islands.length} isles connected
        </p>
        <p
          className={cn(
            "mt-1 text-[15px] font-semibold text-white/80 transition-all delay-150 duration-500",
            phase === "network" ? "opacity-100" : "opacity-0",
          )}
        >
          You&rsquo;re in the network now
        </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
