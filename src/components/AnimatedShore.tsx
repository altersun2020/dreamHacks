"use client";

import { SHORE_WAVE, WAVE_VIEWBOX } from "@/lib/wave-path";
import { cn } from "@/lib/utils";

interface Band {
  bottom: number;
  height: number;
  fill: string;
  crestWidth: number;
  duration: string;
  reverse?: boolean;
}

const BANDS: Band[] = [
  { bottom: 150, height: 112, fill: "#E8F7FB", crestWidth: 4, duration: "38s" },
  { bottom: 118, height: 112, fill: "#CFEDF5", crestWidth: 5, duration: "31s", reverse: true },
  { bottom: 86, height: 112, fill: "#AEE0EA", crestWidth: 6, duration: "24s" },
  { bottom: 54, height: 112, fill: "#8AD0DE", crestWidth: 6, duration: "18s", reverse: true },
  { bottom: 26, height: 112, fill: "#63BCD0", crestWidth: 6, duration: "13s" },
];

const CLOUDS = [
  { top: "12%", left: "8%", w: 150, o: 0.85, d: "120s" },
  { top: "22%", left: "58%", w: 210, o: 0.7, d: "170s" },
  { top: "7%", left: "76%", w: 120, o: 0.6, d: "140s" },
  { top: "31%", left: "30%", w: 96, o: 0.5, d: "200s" },
];

const FLOATERS = [
  { left: "14%", bottom: 260, size: 9, delay: "0s" },
  { left: "27%", bottom: 320, size: 6, delay: "1.2s" },
  { left: "66%", bottom: 285, size: 8, delay: "0.6s" },
  { left: "81%", bottom: 340, size: 5, delay: "2.1s" },
  { left: "46%", bottom: 372, size: 7, delay: "1.7s" },
  { left: "58%", bottom: 240, size: 5, delay: "2.8s" },
];

function Cloud({ w }: { w: number }) {
  return (
    <svg viewBox="0 0 200 70" width={w} height={(w * 70) / 200}>
      <g fill="#FFFFFF">
        <ellipse cx="60" cy="45" rx="46" ry="24" />
        <ellipse cx="104" cy="34" rx="38" ry="30" />
        <ellipse cx="140" cy="46" rx="36" ry="21" />
        <rect x="46" y="46" width="112" height="22" rx="11" />
      </g>
    </svg>
  );
}

/** Distant island silhouettes on the horizon, for depth. */
function Horizon() {
  return (
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      className="absolute inset-x-0 h-[120px] w-full"
      style={{ bottom: 236 }}
    >
      <g fill="#9FD3DE" opacity="0.55">
        <path d="M120 120 C150 74 190 62 226 76 C256 88 274 104 300 120 Z" />
        <path d="M420 120 C452 60 500 48 540 68 C572 84 596 100 626 120 Z" />
        <path d="M840 120 C868 82 902 72 932 84 C958 94 980 106 1004 120 Z" />
      </g>
      <g fill="#7FC3D2" opacity="0.4">
        <path d="M250 120 C284 88 322 80 352 94 C378 106 396 112 418 120 Z" />
        <path d="M660 120 C694 84 736 74 770 90 C798 103 818 112 842 120 Z" />
      </g>
    </svg>
  );
}

export function AnimatedShore({
  className,
  showSand = true,
}: {
  className?: string;
  showSand?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      style={{
        background:
          "linear-gradient(180deg,#7FC9EE 0%,#A3DAF2 26%,#C6E9F7 54%,#DDF2F9 78%,#EAF7FB 100%)",
      }}
    >
      {/* Sun with a soft corona */}
      <div className="absolute right-[13%] top-[9%] h-40 w-40 rounded-full bg-white/35 blur-3xl" />
      <div className="absolute right-[15%] top-[11%] h-24 w-24 rounded-full bg-gold-100/80 blur-xl" />
      <div className="absolute right-[16.5%] top-[12.5%] h-14 w-14 rounded-full bg-white/90 blur-[2px]" />

      {CLOUDS.map((c, i) => (
        <div
          key={i}
          className="drift absolute opacity-90"
          style={{
            top: c.top,
            left: c.left,
            opacity: c.o,
            animationDuration: c.d,
          }}
        >
          <Cloud w={c.w} />
        </div>
      ))}

      <Horizon />

      {FLOATERS.map((f, i) => (
        <span
          key={i}
          className="float-slow absolute rounded-full bg-white opacity-70"
          style={{
            left: f.left,
            bottom: f.bottom,
            width: f.size,
            height: f.size,
            animationDelay: f.delay,
          }}
        />
      ))}

      {BANDS.map((band, i) => (
        <div
          key={i}
          className="absolute inset-x-0 overflow-hidden"
          style={{ bottom: band.bottom, height: band.height }}
        >
          <div
            className={cn("wave-track flex h-full w-[200%]", band.reverse && "wave-reverse")}
            style={{ animationDuration: band.duration }}
          >
            {[0, 1].map((copy) => (
              <svg
                key={copy}
                viewBox={WAVE_VIEWBOX}
                preserveAspectRatio="none"
                className="h-full w-1/2 shrink-0"
              >
                <path d={SHORE_WAVE.fill} fill={band.fill} />
                <path
                  d={SHORE_WAVE.crest}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth={band.crestWidth}
                  strokeLinecap="round"
                />
              </svg>
            ))}
          </div>
        </div>
      ))}

      {showSand && (
        <div className="absolute inset-x-0 bottom-0 h-[100px] overflow-hidden">
          <div className="wave-track flex h-full w-[200%]" style={{ animationDuration: "52s" }}>
            {[0, 1].map((copy) => (
              <svg
                key={copy}
                viewBox={WAVE_VIEWBOX}
                preserveAspectRatio="none"
                className="h-full w-1/2 shrink-0"
              >
                <defs>
                  <linearGradient id={`sand-${copy}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F5E7C4" />
                    <stop offset="100%" stopColor="#E2C795" />
                  </linearGradient>
                </defs>
                <path d={SHORE_WAVE.fill} fill={`url(#sand-${copy})`} />
                <path
                  d={SHORE_WAVE.crest}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="6"
                  strokeLinecap="round"
                  opacity="0.85"
                />
              </svg>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
