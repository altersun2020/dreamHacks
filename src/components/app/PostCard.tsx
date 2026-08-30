"use client";

import { useState } from "react";
import { Bookmark, HandHeart, MessageCircle, Send } from "lucide-react";
import { RelativeTime } from "@/components/RelativeTime";
import { useFeed } from "@/contexts/FeedContext";
import type { Post, PostTag } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Each category owns a colour: the chip, the card tint, the left edge and the
 * headline all share it, so posts are told apart at a glance rather than read.
 */
const LABEL: Record<
  PostTag,
  { text: string; dot: string; edge: string; tint: string; ink: string }
> = {
  ResourceOffer: {
    text: "Offering",
    dot: "bg-teal-600",
    edge: "border-l-teal-500",
    tint: "bg-teal-50/90",
    ink: "text-teal-800",
  },
  RideShare: {
    text: "Crossing",
    dot: "bg-sky-600",
    edge: "border-l-sky-500",
    tint: "bg-sky-50/90",
    ink: "text-sky-800",
  },
  HazardAlert: {
    text: "Warning",
    dot: "bg-red-600",
    edge: "border-l-red-500",
    tint: "bg-red-50/90",
    ink: "text-red-800",
  },
  LocalMarket: {
    text: "Market",
    dot: "bg-amber-500",
    edge: "border-l-amber-500",
    tint: "bg-amber-50/90",
    ink: "text-amber-900",
  },
  FairShare: {
    text: "Ration",
    dot: "bg-violet-600",
    edge: "border-l-violet-500",
    tint: "bg-violet-50/90",
    ink: "text-violet-900",
  },
};

export function PostCard({
  post,
  index = 0,
}: {
  post: Post;
  index?: number;
}) {
  const { actedPostIds, savedPostIds, actOnPost, toggleSave, addComment } =
    useFeed();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");

  const acted = actedPostIds.has(post.id);
  const saved = savedPostIds.has(post.id);
  const label = LABEL[post.tag];
  const comments = post.comments ?? [];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const body = draft.trim();
    if (!body) return;
    setDraft("");
    await addComment(post.id, body);
  }

  return (
    <article
      className={cn(
        "surface-in mb-3.5 rounded-2xl border border-white/70 border-l-[6px] p-4 shadow-[0_2px_8px_rgba(6,51,64,0.07)]",
        label.edge,
        label.tint,
      )}
      style={{ animationDelay: `${Math.min(index, 6) * 70}ms` }}
    >
      {/* Byline */}
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "shrink-0 rounded-md px-2 py-1 text-[11px] font-black uppercase tracking-wider text-white",
            label.dot,
          )}
        >
          {label.text}
        </span>
        <p className="min-w-0 flex-1 truncate text-[13px] font-semibold text-ink-mute">
          {post.author} · <RelativeTime iso={post.createdAt} />
        </p>
      </div>

      {/* Words */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mt-1.5 block w-full text-left"
      >
        <h2
          className={cn(
            "text-[22px] font-extrabold leading-[1.15] tracking-[-0.02em]",
            label.ink,
          )}
        >
          {post.title}
        </h2>
      </button>

      {open && (
        <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
          {post.body}
        </p>
      )}

      {/* Photograph — full width of the column, generous */}
      {post.image && (
        <figure className="mt-3 overflow-hidden rounded-xl bg-line-soft">
          {/* eslint-disable-next-line @next/next/no-img-element -- local static asset */}
          <img
            src={post.image}
            alt=""
            loading="lazy"
            className="aspect-[16/9] w-full object-cover"
          />
        </figure>
      )}

      {/* One primary action, then quiet icons */}
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => actOnPost(post)}
          disabled={acted}
          className={cn(
            "btn px-5 py-2.5 text-[14px]",
            acted ? "btn-done" : "btn-dark",
          )}
        >
          <HandHeart className="h-5 w-5" />
          {acted ? "You're in" : post.action}
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[12px]",
              acted ? "bg-white/70" : "bg-white/20",
            )}
          >
            {post.actionCount}
          </span>
        </button>

        <div className="ml-auto flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Replies"
            className="flex items-center gap-1 rounded-full bg-surface px-3 py-2 text-[13px] font-bold text-ink-soft shadow-[0_2px_0_#9adfec] transition-transform active:translate-y-[2px] active:shadow-none"
          >
            <MessageCircle className="h-[22px] w-[22px]" />
            {comments.length > 0 && comments.length}
          </button>
          <button
            type="button"
            onClick={() => toggleSave(post.id)}
            aria-pressed={saved}
            aria-label={saved ? "Saved" : "Save"}
            className={cn(
              "rounded-full p-2 shadow-[0_2px_0_#9adfec] transition-transform active:translate-y-[2px] active:shadow-none",
              saved ? "bg-accent text-white" : "bg-surface text-ink-soft",
            )}
          >
            <Bookmark className={cn("h-[22px] w-[22px]", saved && "fill-current")} />
          </button>
        </div>
      </div>

      {open && (
        <div className="mt-4 space-y-3 border-l-2 border-line pl-4">
          {comments.map((c) => (
            <div key={c.id}>
              <p className="text-[13px]">
                <span className="font-semibold text-ink">{c.author}</span>{" "}
                <RelativeTime
                  iso={c.createdAt}
                  className="text-[11px] text-ink-mute"
                />
              </p>
              <p className="text-[14px] leading-snug text-ink-soft">{c.body}</p>
            </div>
          ))}

          <form onSubmit={submit} className="flex items-center gap-2 pt-1">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Say something…"
              aria-label={`Reply to ${post.author}`}
              className="min-w-0 flex-1 rounded-full border border-line bg-surface px-3.5 py-2 text-[14px] text-ink placeholder:text-ink-mute focus:border-accent focus:outline-none"
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              aria-label="Send"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-accent transition-colors hover:bg-accent-soft disabled:text-ink-mute"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </article>
  );
}
