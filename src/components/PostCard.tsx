"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Bookmark,
  CloudOff,
  HandHelping,
  MessageCircle,
  Send,
  Ship,
  Users,
} from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { RelativeTime } from "@/components/RelativeTime";
import { useFeed } from "@/contexts/FeedContext";
import type { Post } from "@/lib/types";
import { cn, getTagStyles } from "@/lib/utils";

const actionIcons = {
  "I Can Help": HandHelping,
  "Claim Allocation": Users,
  "Hop on Boat": Ship,
};

const actedLabels = {
  "I Can Help": "Helping",
  "Claim Allocation": "Claimed",
  "Hop on Boat": "Aboard",
};

export function PostCard({ post }: { post: Post }) {
  const { actedPostIds, savedPostIds, actOnPost, toggleSave, addComment } =
    useFeed();
  const [showComments, setShowComments] = useState(false);
  const [draft, setDraft] = useState("");

  const styles = getTagStyles(post.tag);
  const ActionIcon = actionIcons[post.action];
  const acted = actedPostIds.has(post.id);
  const saved = savedPostIds.has(post.id);
  const comments = post.comments ?? [];

  async function submitComment(e: React.FormEvent) {
    e.preventDefault();
    const body = draft.trim();
    if (!body) return;
    setDraft("");
    await addComment(post.id, body);
  }

  return (
    <article className="rounded-2xl border border-shell-200 bg-white px-4 pb-3 pt-4 transition-colors hover:border-shell-300">
      {/* Author line — tag sits inline here rather than as a second banner */}
      <header className="flex items-center gap-2.5">
        <Avatar name={post.author} size="sm" />
        <div className="flex min-w-0 flex-1 items-baseline gap-1.5">
          <span className="truncate text-sm font-bold text-lagoon-900">
            {post.author}
          </span>
          <span className="shrink-0 text-xs text-shell-400">·</span>
          <RelativeTime
            iso={post.createdAt}
            className="shrink-0 text-xs text-shell-500"
          />
          {post.isLocal && (
            <span
              title="Queued on this device"
              className="flex shrink-0 items-center gap-1 text-[11px] font-semibold text-shell-500"
            >
              <CloudOff className="h-3 w-3" />
              Queued
            </span>
          )}
        </div>
        <span
          className={cn(
            "flex shrink-0 items-center gap-1.5 text-[11px] font-bold",
            styles.text,
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", styles.dot)} />
          {styles.label}
        </span>
      </header>

      <div className="mt-2.5 pl-[38px]">
        {post.isUrgent && (
          <span className="mb-1.5 inline-flex items-center gap-1 rounded-md bg-red-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-700">
            <AlertTriangle className="h-3 w-3" />
            Urgent
          </span>
        )}

        <h3 className="text-[15px] font-bold leading-snug text-lagoon-900">
          {post.title}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-shell-600">
          {post.body}
        </p>
        <p className="mt-1.5 text-xs text-shell-400">
          {post.householdId}
          {post.scope === "archipelago" && ` · ${post.island}`}
        </p>

        {post.image && (
          <div
            className={cn(
              "mt-3 flex h-32 items-center justify-center rounded-xl text-5xl",
              styles.bg,
            )}
          >
            <span role="img" aria-label={`${styles.label} attachment`}>
              {post.image}
            </span>
          </div>
        )}

        {/* Compact action row — a modest pill, then icon buttons */}
        <div className="mt-3 flex items-center gap-1">
          <button
            type="button"
            onClick={() => actOnPost(post)}
            disabled={acted}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all",
              acted
                ? "cursor-default bg-teal-50 text-teal-700"
                : "brand-gradient text-white hover:brightness-105 active:scale-95",
            )}
          >
            <ActionIcon className="h-3.5 w-3.5" />
            {acted ? actedLabels[post.action] : post.action}
            <span
              className={cn(
                "rounded-full px-1.5 text-[10px]",
                acted ? "bg-teal-100" : "bg-white/25",
              )}
            >
              {post.actionCount}
            </span>
          </button>

          <div className="ml-auto flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => setShowComments((v) => !v)}
              aria-expanded={showComments}
              aria-label="Replies"
              className="flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-semibold text-shell-500 transition-colors hover:bg-shell-100 hover:text-lagoon-800"
            >
              <MessageCircle className="h-4 w-4" />
              {comments.length > 0 && comments.length}
            </button>
            <button
              type="button"
              onClick={() => toggleSave(post.id)}
              aria-pressed={saved}
              aria-label={saved ? "Saved" : "Save"}
              className={cn(
                "rounded-full p-1.5 transition-colors",
                saved
                  ? "text-gold-600"
                  : "text-shell-500 hover:bg-shell-100 hover:text-lagoon-800",
              )}
            >
              <Bookmark className={cn("h-4 w-4", saved && "fill-current")} />
            </button>
          </div>
        </div>

        {showComments && (
          <div className="animate-fade-in mt-3 space-y-2.5 border-t border-shell-100 pt-3">
            {comments.map((c) => (
              <div key={c.id} className="flex gap-2">
                <Avatar name={c.author} size="sm" className="h-6 w-6" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs font-bold text-lagoon-900">
                      {c.author}
                    </span>
                    <RelativeTime
                      iso={c.createdAt}
                      className="text-[10px] text-shell-400"
                    />
                  </div>
                  <p className="text-sm leading-snug text-shell-600">
                    {c.body}
                  </p>
                </div>
              </div>
            ))}

            <form onSubmit={submitComment} className="flex items-center gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Reply…"
                aria-label={`Reply to ${post.author}`}
                className="min-w-0 flex-1 rounded-full bg-shell-100 px-3 py-1.5 text-sm text-lagoon-800 placeholder:text-shell-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-200"
              />
              <button
                type="submit"
                disabled={!draft.trim()}
                aria-label="Send reply"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-teal-600 transition-colors hover:bg-teal-50 disabled:text-shell-300"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </article>
  );
}
