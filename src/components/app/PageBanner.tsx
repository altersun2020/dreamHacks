import { cn } from "@/lib/utils";

type Motif = "stream" | "chart" | "market" | "gather" | "tide" | "beacon";

const MOTIFS: Record<Motif, React.ReactNode> = {
  // Rolling surf with a drifting bottle
  stream: (
    <g>
      <path d="M0 74 C26 58 46 88 72 72 C98 56 118 86 144 70" stroke="#fff" strokeWidth="4" fill="none" opacity=".55" strokeLinecap="round" />
      <path d="M0 90 C26 74 46 104 72 88 C98 72 118 102 144 86" stroke="#fff" strokeWidth="4" fill="none" opacity=".35" strokeLinecap="round" />
      <g transform="translate(96 40) rotate(18)">
        <rect x="0" y="6" width="26" height="15" rx="7" fill="#fff" opacity=".9" />
        <rect x="24" y="10" width="9" height="7" rx="3" fill="#fff" opacity=".9" />
      </g>
    </g>
  ),
  // Chart: compass rose, islands, a plotted route
  chart: (
    <g>
      <circle cx="106" cy="52" r="24" stroke="#fff" strokeWidth="3" fill="none" opacity=".55" />
      <path d="M106 30 L112 52 L106 74 L100 52 Z" fill="#fff" opacity=".85" />
      <path d="M84 52 L106 46 L128 52 L106 58 Z" fill="#fff" opacity=".5" />
      <path d="M8 96 C34 84 52 96 78 88" stroke="#fff" strokeWidth="3" strokeDasharray="6 7" fill="none" opacity=".6" strokeLinecap="round" />
      <ellipse cx="24" cy="100" rx="18" ry="7" fill="#fff" opacity=".7" />
      <ellipse cx="70" cy="92" rx="13" ry="5" fill="#fff" opacity=".5" />
    </g>
  ),
  // Market: a stall — scalloped awning on posts, produce on the counter
  market: (
    <g>
      {/* Awning */}
      <path d="M26 30 h96 v14 h-96 z" fill="#fff" opacity=".95" />
      <path
        d="M26 44 a8 8 0 0 0 16 0 a8 8 0 0 0 16 0 a8 8 0 0 0 16 0 a8 8 0 0 0 16 0 a8 8 0 0 0 16 0 a8 8 0 0 0 16 0 v-2 h-96 z"
        fill="#fff"
        opacity=".8"
      />
      {/* Posts */}
      <rect x="30" y="52" width="5" height="46" rx="2" fill="#fff" opacity=".7" />
      <rect x="113" y="52" width="5" height="46" rx="2" fill="#fff" opacity=".7" />
      {/* Counter */}
      <rect x="22" y="82" width="104" height="8" rx="3" fill="#fff" opacity=".9" />
      {/* Produce heaped on it */}
      <circle cx="48" cy="74" r="8" fill="#fff" opacity=".85" />
      <circle cx="64" cy="70" r="10" fill="#fff" opacity=".7" />
      <circle cx="82" cy="74" r="8" fill="#fff" opacity=".85" />
      <circle cx="96" cy="77" r="6" fill="#fff" opacity=".6" />
      <circle cx="34" cy="77" r="6" fill="#fff" opacity=".6" />
    </g>
  ),
  // Gathering: bunting over a fire
  gather: (
    <g>
      <path d="M6 34 C44 54 100 54 138 34" stroke="#fff" strokeWidth="3" fill="none" opacity=".55" />
      {[24, 48, 72, 96, 120].map((x, i) => (
        <path key={x} d={`M${x} ${43 + (i === 0 || i === 4 ? -4 : i === 2 ? 4 : 1)} l7 14 l-14 0 z`} fill="#fff" opacity={i % 2 ? ".5" : ".8"} />
      ))}
      <path d="M62 100 c4-16 16-20 12-32 c10 8 18 16 16 32 z" fill="#fff" opacity=".85" />
      <path d="M46 100 h52" stroke="#fff" strokeWidth="4" opacity=".6" strokeLinecap="round" />
    </g>
  ),
  // A boat riding the swell
  tide: (
    <g>
      <path d="M64 78 h44 l-8 16 h-28 z" fill="#fff" opacity=".9" />
      <path d="M86 76 V44 l22 26 z" fill="#fff" opacity=".65" />
      <path d="M0 92 C26 78 46 106 72 92 C98 78 118 106 144 90" stroke="#fff" strokeWidth="4" fill="none" opacity=".55" strokeLinecap="round" />
      <path d="M0 106 C26 92 46 118 72 104" stroke="#fff" strokeWidth="3" fill="none" opacity=".35" strokeLinecap="round" />
    </g>
  ),
  // Lighthouse throwing a beam
  beacon: (
    <g>
      <path d="M84 100 l6-46 h14 l6 46 z" fill="#fff" opacity=".9" />
      <rect x="86" y="38" width="22" height="16" rx="4" fill="#fff" />
      <path d="M86 46 L34 30 L34 62 Z" fill="#fff" opacity=".35" />
      <path d="M108 46 L144 32 L144 60 Z" fill="#fff" opacity=".25" />
      <path d="M60 104 h60" stroke="#fff" strokeWidth="4" opacity=".6" strokeLinecap="round" />
    </g>
  ),
};

const THEME: Record<Motif, string> = {
  stream: "from-[#0f8f86] via-[#12a3a0] to-[#3fc0b4]",
  chart: "from-[#134e75] via-[#1b6f9c] to-[#3b9dc4]",
  market: "from-[#a2620f] via-[#c8871d] to-[#e0a93c]",
  gather: "from-[#a8384f] via-[#cf5464] to-[#ec8474]",
  tide: "from-[#0c6b7e] via-[#1290a3] to-[#46b7c4]",
  beacon: "from-[#8f2f14] via-[#b4400f] to-[#d4642c]",
};

/**
 * Every section leads with one of these. Distinct colour and motif per page,
 * plus a plain sentence saying what the page is actually for — the two things
 * that were missing when all five looked identical.
 */
export function PageBanner({
  title,
  blurb,
  motif,
  children,
}: {
  title: string;
  blurb: string;
  motif: Motif;
  children?: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "relative -mx-5 -mt-5 mb-5 overflow-hidden rounded-t-3xl bg-gradient-to-br px-5 pb-5 pt-6 text-white",
        THEME[motif],
      )}
    >
      <svg
        viewBox="0 0 144 120"
        aria-hidden="true"
        className="bob pointer-events-none absolute -right-3 top-0 h-full w-52 opacity-95"
      >
        {MOTIFS[motif]}
      </svg>

      <div className="relative max-w-[76%]">
        <h1 className="text-[38px] font-extrabold leading-[1.05] tracking-[-0.025em]">
          {title}
        </h1>
        <p className="mt-2 text-[15px] font-medium leading-snug text-white/85">{blurb}</p>
        {children && <div className="mt-4">{children}</div>}
      </div>
    </section>
  );
}
