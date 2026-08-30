"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Volume2 } from "lucide-react";
import { AnimatedShore } from "@/components/AnimatedShore";
import { useSound } from "@/contexts/SoundContext";
import { cn } from "@/lib/utils";

const SEEN_KEY = "islehelp.intro-seen";

/** Phase timings, in ms from mount. */
const T_FLOOD = 200;
const T_LOGO = 2500;
const T_LIFT = 5400;
const T_DONE = 6700;

type Phase = "sky" | "flooding" | "logo" | "lifting";

function subscribeSeen(onChange: () => void) {
  // React hydrates with the server snapshot; nudge it once so the curtain can
  // appear on the first client render.
  const id = setTimeout(onChange, 0);
  return () => clearTimeout(id);
}

/** Read once and cache — getSnapshot runs on every render. */
let seenCache: boolean | null = null;

function getSeen(): boolean {
  if (seenCache === null) {
    try {
      seenCache = window.sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      seenCache = false;
    }
  }
  return seenCache;
}

const getSeenOnServer = () => true;

const BANDS = [
  { fill: "#63BCD0", bottom: "0%", height: "46%", drift: "17s" },
  { fill: "#8AD0DE", bottom: "13%", height: "44%", drift: "23s", rev: true },
  { fill: "#AEE0EA", bottom: "26%", height: "42%", drift: "31s" },
  { fill: "#CFEDF5", bottom: "38%", height: "40%", drift: "40s", rev: true },
];

const SURF_D =
  "M0,58 C150,18 280,96 430,58 C580,20 700,96 850,58 C1000,20 1120,92 1200,60 L1200,160 L0,160 Z";
const SURF_CREST =
  "M0,58 C150,18 280,96 430,58 C580,20 700,96 850,58 C1000,20 1120,92 1200,60";

/**
 * Half of the surf. The water inside each band drifts continuously the whole
 * time, so the sweep in reads as water flowing rather than panels sliding —
 * and every band shares one easing with no stagger, which is what made the
 * earlier version look stepped.
 */
function WaveBank({ side }: { side: "left" | "right" }) {
  return (
    <div
      className={cn(
        "absolute bottom-0 h-full w-1/2 overflow-hidden",
        side === "left" ? "left-0" : "right-0",
      )}
    >
      {BANDS.map((band, i) => (
        <div
          key={i}
          className={cn(
            "absolute h-full w-[200%]",
            side === "left" ? "left-0 flood-left" : "right-0 flood-right",
          )}
        >
          <div
            className="absolute inset-x-0"
            style={{ bottom: band.bottom, height: band.height }}
          >
            {/* Two copies sliding on a loop = water that never stops moving */}
            <div
              className={cn(
                "wave-track flex h-full w-[200%]",
                band.rev && "wave-reverse",
              )}
              style={{ animationDuration: band.drift }}
            >
              {[0, 1].map((copy) => (
                <svg
                  key={copy}
                  viewBox="0 0 1200 160"
                  preserveAspectRatio="none"
                  className="h-full w-1/2 shrink-0"
                >
                  <path d={SURF_D} fill={band.fill} />
                  <path
                    d={SURF_CREST}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function IntroCurtain() {
  const { fadeIn, fadeOut } = useSound();
  const seen = useSyncExternalStore(subscribeSeen, getSeen, getSeenOnServer);
  const [dismissed, setDismissed] = useState(false);
  const [phase, setPhase] = useState<Phase>("sky");
  const [armed, setArmed] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const show = !seen && !dismissed;

  const finish = useCallback(() => {
    setPhase("lifting");
    fadeOut();
    timers.current.push(setTimeout(() => setDismissed(true), 1200));
  }, [fadeOut]);

  useEffect(() => {
    if (seen) return;
    try {
      window.sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* storage unavailable */
    }

    const push = (fn: () => void, ms: number) =>
      timers.current.push(setTimeout(fn, ms));

    push(() => setPhase("flooding"), T_FLOOD);
    push(() => setPhase("logo"), T_LOGO);
    push(() => {
      setPhase("lifting");
      fadeOut();
    }, T_LIFT);
    push(() => setDismissed(true), T_DONE);

    const list = timers.current;
    return () => {
      for (const t of list) clearTimeout(t);
    };
  }, [seen, fadeOut]);

  function handleClick() {
    if (!armed) {
      setArmed(true);
      fadeIn();
    }
  }

  if (!show) return null;

  const flooded = phase === "flooding" || phase === "logo" || phase === "lifting";

  return (
    <div
      onClick={handleClick}
      role="presentation"
      className={cn(
        "fixed inset-0 z-[100] overflow-hidden transition-opacity duration-700",
        phase === "lifting" && "pointer-events-none opacity-0",
      )}
    >
      {/* Sky, clouds, horizon — the shore is already there before the surf arrives */}
      <AnimatedShore showSand={false} />

      {/* Surf sweeping in from both shores */}
      {flooded && (
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 h-[56%] transition-all duration-[1100ms] ease-[cubic-bezier(0.65,0,0.35,1)]",
            phase === "lifting" && "translate-y-full opacity-0",
          )}
        >
          <WaveBank side="left" />
          <WaveBank side="right" />
        </div>
      )}

      {/* Logo, revealed once the water has met in the middle */}
      <div
        className={cn(
          "absolute left-1/2 top-[30%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          phase === "logo" || phase === "lifting"
            ? "scale-100 opacity-100"
            : "scale-90 opacity-0",
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- static SVG */}
        <img
          src="/mark.svg"
          alt=""
          aria-hidden="true"
          className="h-24 w-24 drop-shadow-[0_14px_26px_rgba(13,90,110,0.3)] sm:h-28 sm:w-28"
        />
        <p className="mt-4 text-4xl font-extrabold tracking-tight text-brand-ink sm:text-5xl">
          Isle<span className="text-palm-500">Help</span>
        </p>
        <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.3em] text-lagoon-700/70">
          No isle copes alone
        </p>
      </div>

      {!armed && phase !== "lifting" && (
        <p className="absolute bottom-10 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-bold text-lagoon-700 shadow-sm backdrop-blur">
          <Volume2 className="h-3.5 w-3.5" />
          Click anywhere for sound
        </p>
      )}

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          finish();
        }}
        className="absolute right-6 top-6 rounded-full border border-lagoon-300/60 bg-white/70 px-4 py-1.5 text-xs font-bold text-lagoon-700 backdrop-blur transition-colors hover:bg-white"
      >
        Skip
      </button>
    </div>
  );
}

/** Lets the intro be watched again without clearing storage by hand. */
export function ReplayIntroButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        try {
          window.sessionStorage.removeItem(SEEN_KEY);
        } catch {
          /* storage unavailable */
        }
        window.location.reload();
      }}
      className={className}
    >
      Replay intro
    </button>
  );
}
