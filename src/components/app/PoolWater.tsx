import { cn } from "@/lib/utils";

/**
 * Real pool caustics. Fractal noise is pushed through a table transfer
 * (`0 0 1 0 0`) which keeps only a narrow band of the gradient — that is what
 * turns smooth noise into the thin, interlocking bright web you get on the
 * bottom of a swimming pool. Two layers at different frequencies and drift
 * rates so the pattern never visibly repeats.
 */
export function PoolWater({
  className,
  opacity = 1,
  id = "pool",
  tone = "deep",
}: {
  className?: string;
  opacity?: number;
  id?: string;
  /** "shallow" is the pale version used behind body copy. */
  tone?: "deep" | "shallow";
}) {
  const base =
    tone === "shallow"
      ? ["#e8fbfc", "#dcf7f9", "#cff3f7"]
      : ["#37C9C6", "#22B7BC", "#149FAC"];
  return (
    <svg
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
      className={cn("pointer-events-none", className)}
      style={{ opacity }}
    >
      <defs>
        <linearGradient id={`${id}-base`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={base[0]} />
          <stop offset="55%" stopColor={base[1]} />
          <stop offset="100%" stopColor={base[2]} />
        </linearGradient>

        {/* Coarse web */}
        <filter id={`${id}-caustic-a`} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.016 0.022"
            numOctaves="2"
            seed="7"
            result="n"
          >
            <animate
              attributeName="baseFrequency"
              dur="26s"
              values="0.016 0.022; 0.019 0.026; 0.016 0.022"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feColorMatrix
            in="n"
            type="matrix"
            values="0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 0 1
                    1 0 0 0 0"
          />
          <feComponentTransfer>
            <feFuncA type="table" tableValues="0 0 0 1 0 0 0" />
          </feComponentTransfer>
        </filter>

        {/* Finer web laid over it */}
        <filter id={`${id}-caustic-b`} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.030 0.038"
            numOctaves="2"
            seed="19"
            result="n"
          >
            <animate
              attributeName="baseFrequency"
              dur="19s"
              values="0.030 0.038; 0.036 0.045; 0.030 0.038"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feColorMatrix
            in="n"
            type="matrix"
            values="0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 0 1
                    1 0 0 0 0"
          />
          <feComponentTransfer>
            <feFuncA type="table" tableValues="0 0 0 1 0 0 0" />
          </feComponentTransfer>
        </filter>
      </defs>

      <rect width="100%" height="100%" fill={`url(#${id}-base)`} />
      <rect
        width="100%"
        height="100%"
        filter={`url(#${id}-caustic-a)`}
        opacity={tone === "shallow" ? 0.5 : 0.9}
      />
      <rect
        width="100%"
        height="100%"
        filter={`url(#${id}-caustic-b)`}
        opacity={tone === "shallow" ? 0.28 : 0.45}
      />
      {/* Depth toward the far edge, as in the real thing */}
      <rect
        width="100%"
        height="100%"
        fill={`url(#${id}-depth)`}
        opacity={tone === "shallow" ? 0.12 : 0.35}
      />
      <defs>
        <linearGradient id={`${id}-depth`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1B9AA8" stopOpacity="0.55" />
          <stop offset="45%" stopColor="#1B9AA8" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
