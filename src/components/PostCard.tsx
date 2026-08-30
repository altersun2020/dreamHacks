"use client";

import { useState } from "react";
import { AlertTriangle, HandHelping, Ship, Users } from "lucide-react";
import type { Post } from "@/lib/types";
import { formatRelativeTime, getTagStyles, cn } from "@/lib/utils";
import { queueAction } from "@/lib/db";

interface PostCardProps {
  post: Post;
}

const actionIcons = {
  "I Can Help": HandHelping,
  "Claim Allocation": Users,
  "Hop on Boat": Ship,
};

export function PostCard({ post }: PostCardProps) {
  const [count, setCount] = useState(post.actionCount);
  const [acted, setActed] = useState(false);
  const styles = getTagStyles(post.tag);
  const ActionIcon = actionIcons[post.action];

  async function handleAction() {
    if (acted) return;
    setActed(true);
    setCount((c) => c + 1);
    await queueAction(post.id, post.action);
  }

  return (
    <article
      className={cn(
        "rounded-2xl border bg-ocean-900/40 p-4 transition-shadow",
        post.isUrgent
          ? "border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.1)]"
          : "border-ocean-700/30",
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
              styles.bg,
              styles.text,
              styles.border,
            )}
          >
            #{post.tag}
          </span>
          {post.isUrgent && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-300">
              <AlertTriangle className="h-3 w-3" />
              Urgent
            </span>
          )}
        </div>
        <time className="shrink-0 text-xs text-sand-500">
          {formatRelativeTime(post.createdAt)}
        </time>
      </div>

      <h3 className="mb-1 text-base font-semibold text-sand-100">
        {post.title}
      </h3>
      <p className="mb-3 text-sm leading-relaxed text-sand-300/90">
        {post.body}
      </p>

      <div className="mb-3 flex items-center gap-2 text-xs text-sand-500">
        <span className="font-medium text-sand-400">{post.author}</span>
        <span>·</span>
        <span>{post.householdId}</span>
        {post.scope === "archipelago" && (
          <>
            <span>·</span>
            <span className="text-seafoam-400/80">{post.island}</span>
          </>
        )}
      </div>

      <button
        type="button"
        onClick={handleAction}
        disabled={acted}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all",
          acted
            ? "bg-seafoam-500/10 text-seafoam-400/70 cursor-default"
            : "bg-seafoam-500/20 text-seafoam-300 hover:bg-seafoam-500/30 active:scale-[0.98]",
        )}
      >
        <ActionIcon className="h-4 w-4" />
        {post.action}
        <span className="ml-1 rounded-full bg-ocean-800/60 px-2 py-0.5 text-xs">
          {count}
        </span>
      </button>
    </article>
  );
}
