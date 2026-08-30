"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { PageBanner } from "@/components/app/PageBanner";
import { PostCard } from "@/components/app/PostCard";
import { PostComposer } from "@/components/PostComposer";
import { StoryViewer } from "@/components/StoryViewer";
import { useFeed } from "@/contexts/FeedContext";
import { useSearchQuery } from "@/contexts/SearchContext";
import type { FeedScope, PostTag } from "@/lib/types";
import { HOME_ISLAND } from "@/lib/mock-data";
import { cn, formatTimeRemaining, getInitials } from "@/lib/utils";

type Lens = "all" | "help" | "offers" | "market";

const LENSES: { id: Lens; label: string; tags: PostTag[] | null }[] = [
  { id: "all", label: "Everything", tags: null },
  { id: "help", label: "Needs help", tags: ["HazardAlert", "FairShare"] },
  { id: "offers", label: "Offering", tags: ["ResourceOffer"] },
  { id: "market", label: "Market & rides", tags: ["LocalMarket", "RideShare"] },
];

const PAGE = 8;

export default function FeedPage() {
  const { ready, posts, tideLogs, seenLogIds, markSeen } = useFeed();
  const query = useSearchQuery().trim().toLowerCase();

  const [scope, setScope] = useState<FeedScope>("my-isle");
  const [lens, setLens] = useState<Lens>("all");
  const [composing, setComposing] = useState(false);
  const [storyIndex, setStoryIndex] = useState<number | null>(null);
  const sentinel = useRef<HTMLDivElement | null>(null);

  const key = `${scope}|${lens}|${query}`;
  const [paging, setPaging] = useState({ key, visible: PAGE });
  if (paging.key !== key) setPaging({ key, visible: PAGE });
  const visible = paging.key === key ? paging.visible : PAGE;

  const feed = useMemo(() => {
    const tags = LENSES.find((l) => l.id === lens)?.tags;
    return posts.filter((p) => {
      if (p.scope !== scope) return false;
      if (tags && !tags.includes(p.tag)) return false;
      if (!query) return true;
      return `${p.title} ${p.body} ${p.island} ${p.author}`
        .toLowerCase()
        .includes(query);
    });
  }, [posts, scope, lens, query]);

  const logs = useMemo(
    () =>
      [...tideLogs].sort((a, b) => {
        const seen = (x: string) => (seenLogIds.has(x) ? 1 : 0);
        const d = seen(a.id) - seen(b.id);
        return d !== 0
          ? d
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }),
    [tideLogs, seenLogIds],
  );

  useEffect(() => {
    const node = sentinel.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPaging((p) => ({
            ...p,
            visible: Math.min(p.visible + PAGE, feed.length),
          }));
        }
      },
      { rootMargin: "500px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [feed.length]);

  const shown = feed.slice(0, visible);

  return (
    <>
      <PageBanner
        title="Island Stream"
        blurb="Offers, warnings and what your isle needs today."
        motif="stream"
      />

      {/* Dual view: your isle, or the whole archipelago */}
      <div className="mb-4 flex rounded-full border border-white/80 bg-[#f7fdfe] p-1 shadow-[0_2px_6px_rgba(6,51,64,0.06)]">
        {(
          [
            { id: "my-isle", label: `My Isle`, hint: HOME_ISLAND },
            { id: "archipelago", label: "Archipelago", hint: "Neighbouring & sister isles" },
          ] as const
        ).map(({ id, label, hint }) => (
          <button
            key={id}
            type="button"
            onClick={() => setScope(id)}
            aria-pressed={scope === id}
            title={hint}
            className={cn(
              "btn flex-1 px-4 py-3 text-[16px]",
              scope === id ? "btn-dark" : "text-ink-mute hover:text-ink",
            )}
          >
            {label}
            <span className="ml-1.5 text-[12px] font-normal opacity-70">
              {posts.filter((p) => p.scope === id).length}
            </span>
          </button>
        ))}
      </div>

      {/* On the water today — the island's ephemeral stuff */}
      {logs.length > 0 && (
        <section className="mb-4 rounded-2xl border border-white/80 bg-[#f7fdfe]/95 px-4 pt-3 shadow-[0_2px_6px_rgba(6,51,64,0.06)]">
          <div className="flex gap-4 overflow-x-auto pb-5 scrollbar-hide">
            <button
              type="button"
              onClick={() => setComposing(true)}
              className="flex shrink-0 flex-col items-center gap-1.5"
            >
              <span className="flex h-[78px] w-[78px] items-center justify-center rounded-full border-2 border-dashed border-accent/40 text-accent transition-colors hover:border-accent hover:bg-accent-soft">
                <Plus className="h-7 w-7" />
              </span>
              <span className="text-[12px] font-semibold text-ink-soft">Add</span>
            </button>

            {logs.map((log, i) => {
              const seen = seenLogIds.has(log.id);
              return (
                <button
                  key={log.id}
                  type="button"
                  onClick={() => setStoryIndex(i)}
                  title={`${log.label} · ${formatTimeRemaining(log.expiresAt)}`}
                  className="flex shrink-0 flex-col items-center gap-1.5"
                >
                  <span
                    className={cn(
                      "bob flex h-[78px] w-[78px] items-center justify-center rounded-full p-[3px] transition-transform duration-150 hover:scale-110",
                      seen
                        ? "bg-line"
                        : "bg-gradient-to-br from-accent via-sky-500 to-amber-400",
                    )}
                  >
                    <span className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-paper ring-2 ring-white">
                      {log.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element -- local static asset
                        <img
                          src={log.photo}
                          alt=""
                          className={cn(
                            "h-full w-full object-cover",
                            seen && "opacity-60 saturate-50",
                          )}
                        />
                      ) : (
                        <span className="text-[26px]">{log.preview}</span>
                      )}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "max-w-[78px] truncate text-[12px] font-semibold",
                      seen ? "text-ink-mute" : "text-ink",
                    )}
                  >
                    {log.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Say something */}
      <button
        type="button"
        onClick={() => setComposing(true)}
        className="flex w-full items-center gap-3 rounded-full border border-white/80 bg-[#f7fdfe] px-3 py-3 text-left shadow-[0_3px_0_#9adfec] transition-transform active:translate-y-[3px] active:shadow-none"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-[13px] font-extrabold text-white">
          {getInitials("You")}
        </span>
        <span className="text-[16px] font-medium text-ink-mute">
          What&rsquo;s happening on your isle?
        </span>
      </button>

      {/* A quiet lens, not a row of pills */}
      <div className="mb-4 flex gap-5 overflow-x-auto rounded-2xl border border-white/80 bg-[#f7fdfe]/95 px-4 py-3 shadow-[0_2px_6px_rgba(6,51,64,0.06)] scrollbar-hide">
        {LENSES.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setLens(id)}
            aria-pressed={lens === id}
            className={cn(
              "shrink-0 text-[15px] font-bold transition-colors",
              lens === id
                ? "text-ink underline decoration-accent decoration-2 underline-offset-[6px]"
                : "text-ink-mute hover:text-ink-soft",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {!ready && (
        <div className="space-y-8 py-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-3">
              <div className="h-9 w-40 animate-pulse rounded-full bg-line-soft" />
              <div className="h-4 w-full animate-pulse rounded bg-line-soft" />
              <div className="h-44 w-full animate-pulse rounded-2xl bg-line-soft" />
            </div>
          ))}
        </div>
      )}

      {ready && shown.length === 0 && (
        <p className="py-20 text-center text-[15px] text-ink-mute">
          {query
            ? `Nothing matches “${query}”.`
            : scope === "my-isle"
              ? `Quiet water on ${HOME_ISLAND}.`
              : "Nothing from the other isles yet."}
        </p>
      )}

      {shown.map((post, i) => (
        <PostCard key={post.id} post={post} index={i} />
      ))}

      <div ref={sentinel} aria-hidden="true" className="h-px" />

      {ready && shown.length > 0 && visible >= feed.length && (
        <p className="py-10 text-center text-[13px] text-ink-mute">
          You&rsquo;re all caught up.
        </p>
      )}

      {storyIndex !== null && logs[storyIndex] && (
        <StoryViewer
          logs={logs}
          startIndex={storyIndex}
          onClose={() => setStoryIndex(null)}
          onSeen={markSeen}
        />
      )}

      {composing && (
        <PostComposer scope={scope} onClose={() => setComposing(false)} />
      )}
    </>
  );
}
