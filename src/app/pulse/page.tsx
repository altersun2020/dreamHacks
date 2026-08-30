"use client";

import { MapPin, Trophy } from "lucide-react";
import { PageBanner } from "@/components/app/PageBanner";
import { useFeed } from "@/contexts/FeedContext";
import { badges, microMarkets, workParties } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

/** "Aug 30, 11am" → { month: "AUG", day: "30", time: "11am" } */
function splitDate(date: string) {
  const m = date.match(/^([A-Za-z]{3})[a-z]*\s+(\d{1,2})(?:,\s*(.+))?$/);
  if (!m) return { month: "", day: date.slice(0, 2), time: "" };
  return { month: m[1].toUpperCase(), day: m[2], time: m[3] ?? "" };
}

export default function PulsePage() {
  const { actedPostIds: joined, commitTo } = useFeed();

  return (
    <>
      <PageBanner
        title="Island Pulse"
        blurb="Jobs that need hands, and who’s selling at the dock."
        motif="gather"
      />

      {/* Work parties, as a diary */}
      <section>
        <h2 className="mb-3 text-[20px] font-extrabold tracking-tight text-ink">
          What&rsquo;s on
        </h2>

        <ol className="space-y-3">
          {workParties.map((party) => {
            const mine = joined.has(party.id);
            const signed = party.volunteersSigned + (mine ? 1 : 0);
            const pct = Math.min(100, (signed / party.volunteersNeeded) * 100);
            const short = party.volunteersNeeded - signed;
            const { month, day, time } = splitDate(party.date);

            return (
              <li
                key={party.id}
                className="flex gap-4 rounded-3xl border-2 border-line bg-surface p-3"
              >
                {/* Calendar tile */}
                <div
                  className={cn(
                    "flex w-[68px] shrink-0 flex-col items-center justify-center rounded-2xl py-3",
                    mine ? "bg-accent text-white" : "bg-[#f5efe2] text-ink",
                  )}
                >
                  <span className="text-[11px] font-extrabold uppercase tracking-widest opacity-70">
                    {month}
                  </span>
                  <span className="text-[30px] font-extrabold leading-none">
                    {day}
                  </span>
                  <span className="mt-0.5 text-[11px] font-bold opacity-70">
                    {time}
                  </span>
                </div>

                <div className="min-w-0 flex-1 py-1">
                  <p className="text-[17px] font-extrabold leading-tight text-ink">
                    {party.title}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-[13px] text-ink-mute">
                    <MapPin className="h-3.5 w-3.5" />
                    {party.location}
                  </p>

                  <div className="mt-2.5 flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-line">
                      <div
                        className="h-full rounded-full bg-accent transition-[width] duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="shrink-0 text-[12px] font-bold text-ink-mute">
                      {signed}/{party.volunteersNeeded}
                    </span>
                  </div>

                  <div className="mt-2.5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => commitTo(party.id, "Joined work party")}
                      disabled={mine}
                      className={cn(
                        "btn px-5 py-2.5 text-[14px]",
                        mine ? "btn-done" : "btn-dark",
                      )}
                    >
                      {mine ? "You're going" : "Count me in"}
                    </button>
                    {!mine && short > 0 && (
                      <span className="text-[12px] font-semibold text-alert">
                        {short} still needed
                      </span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Market days — a horizontal shelf, not another list */}
      <section className="mt-8">
        <h2 className="mb-3 text-[20px] font-extrabold tracking-tight text-ink">
          At the dock today
        </h2>
        <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-2 scrollbar-hide">
          {microMarkets.map((m) => (
            <article
              key={m.id}
              className="w-[230px] shrink-0 rounded-3xl bg-gradient-to-br from-[#c8871d] to-[#e0a93c] p-4 text-white"
            >
              <span className="rounded-full bg-white/25 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider">
                Until {m.until}
              </span>
              <p className="mt-3 text-[18px] font-extrabold leading-tight">
                {m.vendor}
              </p>
              <p className="mt-1 text-[14px] leading-snug text-white/90">
                {m.items}
              </p>
              <p className="mt-3 flex items-center gap-1 text-[12px] font-semibold text-white/80">
                <MapPin className="h-3.5 w-3.5" />
                {m.location}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Badges — a trophy shelf */}
      <section className="mt-8">
        <h2 className="mb-1 flex items-center gap-2 text-[20px] font-extrabold tracking-tight text-ink">
          <Trophy className="h-5 w-5 text-amber-500" />
          Your household
        </h2>
        <p className="mb-3 text-[13px] text-ink-mute">
          HH-1042
        </p>
        <div className="grid grid-cols-3 gap-3">
          {badges.map((b) => (
            <div
              key={b.id}
              className="rounded-3xl border-2 border-line bg-gradient-to-b from-[#fdf8ec] to-surface px-2 py-4 text-center"
            >
              <span className="text-[30px]">{b.icon}</span>
              <p className="mt-1.5 text-[14px] font-extrabold text-ink">
                {b.name}
              </p>
              <p className="mt-0.5 text-[11px] leading-snug text-ink-mute">
                {b.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
