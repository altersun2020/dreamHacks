"use client";

import { CloudRain, Radio, Waves, Wind } from "lucide-react";
import { PageBanner } from "@/components/app/PageBanner";
import { useFeed } from "@/contexts/FeedContext";
import { boatTrips, weatherAlerts } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const alertIcon = { tide: Waves, storm: CloudRain, wind: Wind };
const alertTone = {
  info: "bg-sky-50 border-sky-200 text-sky-900",
  warning: "bg-amber-50 border-amber-200 text-amber-900",
  critical: "bg-red-50 border-red-200 text-red-900",
};

/** "Departs Aug 31, 7am" → "07:00" for the board. */
function boardTime(departure: string): string {
  const m = departure.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
  if (!m) return departure.slice(0, 5);
  let h = parseInt(m[1], 10);
  const min = m[2] ?? "00";
  if (/pm/i.test(m[3]) && h !== 12) h += 12;
  if (/am/i.test(m[3]) && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${min}`;
}

export default function MobilityPage() {
  const { actedPostIds: booked, commitTo } = useFeed();

  return (
    <>
      <PageBanner
        title="Coastal Mobility"
        blurb="Who’s sailing where, and what the water is doing."
        motif="tide"
      />

      {/* Conditions ticker */}
      <section className="mb-6 space-y-2">
        {weatherAlerts.map((alert) => {
          const Icon = alertIcon[alert.type];
          return (
            <div
              key={alert.id}
              className={cn(
                "flex items-start gap-3 rounded-2xl border-2 px-4 py-3",
                alertTone[alert.severity],
              )}
            >
              <Icon className="mt-0.5 h-5 w-5 shrink-0" />
              <p className="min-w-0 text-[15px] font-bold leading-snug">
                {alert.message}
              </p>
            </div>
          );
        })}
      </section>

      {/* Departure board */}
      <section>
        <h2 className="mb-3 text-[20px] font-extrabold tracking-tight text-ink">
          Departures
        </h2>

        {/* A painted harbour board: sun-bleached planks, teal ink, rope rules */}
        <div
          className="overflow-hidden rounded-3xl border-4 border-[#c8a97a] shadow-[inset_0_2px_0_rgba(255,255,255,0.6)]"
          style={{
            background:
              "repeating-linear-gradient(180deg,#f7efdd_0px,#f7efdd_34px,#f2e7d0_34px,#f2e7d0_35px), linear-gradient(180deg,#f9f2e2,#f1e5cc)",
          }}
        >
          {boatTrips.map((trip, i) => {
            const mine = booked.has(trip.id);
            const left = trip.seats - trip.seatsTaken - (mine ? 1 : 0);
            const full = left <= 0;
            return (
              <div key={trip.id}>
                {i > 0 && (
                  /* Rope rule between sailings */
                  <svg
                    viewBox="0 0 300 6"
                    preserveAspectRatio="none"
                    className="h-1.5 w-full"
                    aria-hidden="true"
                  >
                    <path
                      d="M0 3 q5 -3 10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0"
                      fill="none"
                      stroke="#c8a97a"
                      strokeWidth="2.5"
                    />
                  </svg>
                )}

                <div className="flex items-stretch gap-4 px-4 py-4">
                  <div className="w-[78px] shrink-0 text-center">
                    <p className="font-mono text-[21px] font-bold leading-none tabular-nums text-[#0d6357]">
                      {boardTime(trip.departure)}
                    </p>
                    <p className="mt-1 text-[10px] font-extrabold uppercase tracking-wider text-ink-mute">
                      {trip.departure.replace(/^Departs\s*/i, "").split(",")[0]}
                    </p>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[16px] font-extrabold leading-tight text-[#173b34]">
                      {trip.route}
                    </p>
                    <p className="mt-1 truncate text-[13px] font-semibold text-ink-mute">
                      {trip.vessel} ·{" "}
                      <span className={full ? "text-ink-mute" : "text-accent"}>
                        {full ? "Full" : `${left} free`}
                      </span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      commitTo(
                        trip.id,
                        trip.type === "passenger"
                          ? "Seat reserved"
                          : "Pickup requested",
                      )
                    }
                    disabled={mine || full}
                    className={cn(
                      "btn shrink-0 self-center px-5 py-2.5 text-[13px]",
                      mine ? "btn-done" : full ? "" : "btn-primary",
                    )}
                  >
                    {mine ? "Aboard" : full ? "Full" : "Book"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Mesh status */}
      <section className="mt-6 rounded-3xl border-2 border-dashed border-accent/30 bg-accent-soft p-5">
        <div className="flex items-center gap-2">
          <Radio className="h-5 w-5 text-accent" />
          <h2 className="text-[16px] font-extrabold text-ink">
            Low-bandwidth mesh
          </h2>
        </div>
        <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">
          Grid down? Everything you tap queues here and travels by Bluetooth
          when neighbours come close.
        </p>
        <div className="mt-3 flex items-center gap-2 text-[13px] font-bold text-accent">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
          </span>
          Listener active · 2 peers nearby
        </div>
      </section>
    </>
  );
}
