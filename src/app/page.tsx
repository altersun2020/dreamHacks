"use client";

import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  LifeBuoy,
  Map as MapIcon,
  Radio,
  Ship,
  Waves,
} from "lucide-react";
import { AnimatedShore } from "@/components/AnimatedShore";
import { Wordmark } from "@/components/BrandMark";
import { ReplayIntroButton } from "@/components/IntroCurtain";

const FEATURES = [
  {
    icon: Waves,
    title: "Island Stream",
    body: "A feed built for offers, rides and warnings — not likes. Tide Logs vanish after 24 hours.",
    href: "/stream",
    tint: "from-teal-50 to-white",
    ring: "text-teal-600",
  },
  {
    icon: MapIcon,
    title: "Archipelago Grid",
    body: "Orbit a living 3D chart of your neighbours. Colour-coded rings show who has surplus and who needs help.",
    href: "/archipelago",
    tint: "from-lagoon-50 to-white",
    ring: "text-lagoon-600",
  },
  {
    icon: Boxes,
    title: "The Island Ledger",
    body: "Local trade, household rations and a lending pool for the gear nobody uses every day.",
    href: "/ledger",
    tint: "from-gold-50 to-white",
    ring: "text-gold-600",
  },
  {
    icon: Radio,
    title: "Island Pulse",
    body: "Work parties, market days and the small honours that keep a community showing up.",
    href: "/pulse",
    tint: "from-blossom-50 to-white",
    ring: "text-blossom-600",
  },
  {
    icon: Ship,
    title: "Coastal Mobility",
    body: "Boat pools, water taxis and tide alerts that move the pickup point when the water rises.",
    href: "/mobility",
    tint: "from-palm-50 to-white",
    ring: "text-palm-600",
  },
  {
    icon: LifeBuoy,
    title: "IsleSOS",
    body: "One tap lights a beacon across the water. Queues offline and travels by mesh when the grid is down.",
    href: "/sos",
    tint: "from-red-50 to-white",
    ring: "text-red-600",
  },
];

const STATS = [
  { value: "6", label: "Isles connected" },
  { value: "24h", label: "Tide Log lifespan" },
  { value: "0", label: "Bars of signal required" },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* ------------------------------------------------------------ hero */}
      <section className="relative flex min-h-[clamp(620px,92vh,900px)] flex-col overflow-hidden">
        <AnimatedShore />
        <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
          <Wordmark className="text-2xl" />
          <div className="flex items-center gap-3">
            <Link
              href="/stream"
              className="hidden rounded-full border border-lagoon-200 bg-white/70 px-5 py-2 text-sm font-bold text-lagoon-800 backdrop-blur transition-colors hover:bg-white sm:block"
            >
              Open the app
            </Link>
          </div>
        </header>

        <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-start px-6 pb-24 pt-[7vh] text-center">
          {/* The mark, riding the swell */}
          <div className="buoy rise-in mb-5">
            {/* eslint-disable-next-line @next/next/no-img-element -- static SVG */}
            <img
              src="/mark.svg"
              alt=""
              aria-hidden="true"
              className="h-20 w-20 drop-shadow-[0_14px_24px_rgba(13,90,110,0.25)] sm:h-24 sm:w-24"
            />
          </div>

          <h1
            className="rise-in text-4xl font-extrabold leading-[1.05] tracking-tight text-lagoon-900 sm:text-6xl"
            style={{ animationDelay: "0.1s" }}
          >
            No island should have
            <br />
            to cope <span className="brand-text">alone</span>.
          </h1>

          <p
            className="rise-in mt-5 max-w-xl text-base leading-relaxed text-lagoon-800/80 sm:text-lg"
            style={{ animationDelay: "0.2s" }}
          >
            IsleHelp keeps remote coastal communities fed, moving and connected —
            sharing what they have, trading across the water, and staying
            reachable when the power and the signal go out.
          </p>

          <div
            className="rise-in mt-8 flex flex-col items-center gap-3 sm:flex-row"
            style={{ animationDelay: "0.3s" }}
          >
            <Link
              href="/stream"
              className="brand-gradient group flex items-center gap-2 rounded-full px-8 py-4 text-base font-bold text-white shadow-xl shadow-teal-900/25 transition-transform hover:scale-[1.03] active:scale-100"
            >
              Enter the isle
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#features"
              className="rounded-full border border-lagoon-300/60 bg-white/60 px-7 py-4 text-base font-bold text-lagoon-800 backdrop-blur transition-colors hover:bg-white"
            >
              See what it does
            </a>
          </div>

          <p
            className="rise-in mt-5 text-xs font-medium text-lagoon-700/60"
            style={{ animationDelay: "0.4s" }}
          >
            Built offline-first for islands the grid forgets.
          </p>
        </div>

      </section>

      {/* ----------------------------------------------------------- stats */}
      <section className="border-y border-shell-200 bg-white">
        <div className="mx-auto grid w-full max-w-4xl grid-cols-3 divide-x divide-shell-200 px-6">
          {STATS.map((stat) => (
            <div key={stat.label} className="px-2 py-7 text-center">
              <p className="brand-text text-3xl font-extrabold sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-shell-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------- features */}
      <section
        id="features"
        className="mx-auto w-full max-w-6xl scroll-mt-8 px-6 py-20"
      >
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-teal-700">
            <Waves className="h-3.5 w-3.5" />
            Six tides, one platform
          </span>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-lagoon-900 sm:text-4xl">
            Everything an isle needs, in one harbour
          </h2>
          <p className="mt-3 text-base leading-relaxed text-shell-600">
            Built offline-first, because the storm that makes you need help is
            the same storm that takes the signal down.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body, href, tint, ring }) => (
            <Link
              key={title}
              href={href}
              className={`group relative overflow-hidden rounded-3xl border border-shell-200 bg-gradient-to-b ${tint} p-6 shadow-sm shadow-lagoon-900/5 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-lagoon-900/10`}
            >
              <Icon className={`h-8 w-8 ${ring}`} />
              <h3 className="mt-4 text-lg font-extrabold text-lagoon-900">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-shell-600">
                {body}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-lagoon-800">
                Explore
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ----------------------------------------------------------- close */}
      <section className="relative overflow-hidden">
        <AnimatedShore />
        <div className="relative z-10 mx-auto max-w-2xl px-6 pb-64 pt-16 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element -- static SVG */}
          <img
            src="/mark.svg"
            alt=""
            aria-hidden="true"
            className="float-slow mx-auto h-16 w-16"
          />
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-lagoon-900 sm:text-4xl">
            The tide is already turning
          </h2>
          <p className="mt-3 text-base text-lagoon-800/80">
            Cedar Cove is trading, the ferry is late, and someone just posted a
            hazard on the north trail.
          </p>
          <Link
            href="/stream"
            className="brand-gradient mt-8 inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-bold text-white shadow-xl shadow-teal-900/25 transition-transform hover:scale-[1.03]"
          >
            Enter the isle
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-shell-200 bg-white py-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-6 sm:flex-row">
          <Wordmark className="text-lg" />
          <div className="flex items-center gap-4">
            <ReplayIntroButton className="text-xs font-semibold text-teal-700 underline-offset-2 hover:underline" />
            <p className="text-xs text-shell-500">
              Built for dreamHacks · resilient community infrastructure
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
