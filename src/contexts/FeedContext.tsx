"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  cachePosts,
  cacheTideLogs,
  getCachedPosts,
  getCachedTideLogs,
  getPendingActions,
  getSavedPostIds,
  getSeenTideLogIds,
  markTideLogSeen,
  purgeExpiredTideLogs,
  queueAction,
  savePostLocally,
  saveTideLogLocally,
  toggleSavedPost,
} from "@/lib/db";
import {
  CURRENT_HOUSEHOLD_ID,
  HOME_ISLAND,
  posts as mockPosts,
  tideLogs as mockTideLogs,
} from "@/lib/mock-data";
import type {
  Comment,
  FeedScope,
  Post,
  PostAction,
  PostTag,
  TideLog,
} from "@/lib/types";
import { TIDE_LOG_LIFETIME_MS, isExpired, rebaseToNow } from "@/lib/utils";

export interface NewPostInput {
  title: string;
  body: string;
  tag: PostTag;
  action: PostAction;
  scope: FeedScope;
  image?: string;
}

export interface NewTideLogInput {
  label: string;
  caption: string;
  preview: string;
  mediaType: TideLog["mediaType"];
}

interface FeedContextValue {
  /** False until IndexedDB has been read, so the UI can show a skeleton. */
  ready: boolean;
  posts: Post[];
  tideLogs: TideLog[];
  actedPostIds: Set<string>;
  savedPostIds: Set<string>;
  seenLogIds: Set<string>;
  pendingCount: number;
  addPost: (input: NewPostInput) => Promise<void>;
  addTideLog: (input: NewTideLogInput) => Promise<void>;
  addComment: (postId: string, body: string) => Promise<void>;
  actOnPost: (post: Post) => Promise<void>;
  /**
   * Commit to anything that isn't a post — a work party, a boat seat, a ration
   * quota, a borrowed generator. Rides the same offline queue as post actions.
   */
  commitTo: (id: string, action: string) => Promise<void>;
  toggleSave: (postId: string) => Promise<void>;
  markSeen: (logId: string) => Promise<void>;
}

const FeedContext = createContext<FeedContextValue | null>(null);

const CURRENT_USER = "You";

const ANCHOR_KEY = "islehelp.feed-anchor";
const ANCHOR_MAX_AGE_MS = 12 * 60 * 60 * 1000;

/**
 * The demo content carries fixed timestamps, so it is shifted forward to look
 * current. That shift has to be *stable*: re-anchoring to `Date.now()` on every
 * load would keep pushing the seeded posts above anything the household has
 * actually written. Persist the anchor and only refresh it once it goes stale.
 */
function getFeedAnchor(): number {
  const now = Date.now();
  try {
    const stored = window.localStorage.getItem(ANCHOR_KEY);
    if (stored) {
      const anchor = Number(stored);
      if (Number.isFinite(anchor) && now - anchor < ANCHOR_MAX_AGE_MS) {
        return anchor;
      }
    }
    window.localStorage.setItem(ANCHOR_KEY, String(now));
  } catch {
    // Storage can be denied; an unstable anchor is better than no feed.
  }
  return now;
}

function byNewest(a: { createdAt: string }, b: { createdAt: string }) {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

export function FeedProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [tideLogs, setTideLogs] = useState<TideLog[]>([]);
  const [actedPostIds, setActedPostIds] = useState<Set<string>>(new Set());
  const [savedPostIds, setSavedPostIds] = useState<Set<string>>(new Set());
  const [seenLogIds, setSeenLogIds] = useState<Set<string>>(new Set());
  const [pendingCount, setPendingCount] = useState(0);

  // Hydrate from IndexedDB after mount. Timestamps are rebased to "now" here
  // rather than at module scope so the server and client render the same HTML.
  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      await purgeExpiredTideLogs();

      // Re-seed the demo content against a stable anchor, then read everything
      // back out of the database so the feed is genuinely cache-backed.
      const anchor = getFeedAnchor();
      await cachePosts(rebaseToNow(mockPosts, anchor));
      await cacheTideLogs(rebaseToNow(mockTideLogs, anchor));

      const [cachedPosts, cachedLogs, saved, seen, pending] = await Promise.all([
        getCachedPosts(),
        getCachedTideLogs(),
        getSavedPostIds(),
        getSeenTideLogIds(),
        getPendingActions(),
      ]);

      if (cancelled) return;

      const now = Date.now();

      // Queued actions are not reflected in the cached post rows, so fold them
      // back in — otherwise a post reads "Help offered" against a count that
      // does not include you.
      const actedIds = new Set(pending.map((a) => a.postId));
      setPosts(
        [...cachedPosts]
          .map((p) =>
            actedIds.has(p.id)
              ? { ...p, actionCount: p.actionCount + 1 }
              : p,
          )
          .sort(byNewest),
      );
      setTideLogs(
        [...cachedLogs]
          .filter((l) => !isExpired(l.expiresAt, now))
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
      );
      setSavedPostIds(new Set(saved));
      setSeenLogIds(new Set(seen));
      setActedPostIds(actedIds);
      setPendingCount(pending.length);
      setReady(true);
    }

    hydrate().catch(() => {
      // IndexedDB can be unavailable (private browsing, storage denied).
      // Fall back to in-memory demo content so the feed still works.
      if (cancelled) return;
      const anchor = getFeedAnchor();
      setPosts(rebaseToNow(mockPosts, anchor).sort(byNewest));
      setTideLogs(rebaseToNow(mockTideLogs, anchor));
      setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Expire Tide Logs live rather than only on load — a story that runs out
  // while the tray is open should drop away on its own.
  useEffect(() => {
    if (!ready) return;
    const timer = setInterval(() => {
      const now = Date.now();
      setTideLogs((current) => {
        const next = current.filter((l) => !isExpired(l.expiresAt, now));
        return next.length === current.length ? current : next;
      });
    }, 30_000);
    return () => clearInterval(timer);
  }, [ready]);

  const addPost = useCallback(async (input: NewPostInput) => {
    const now = new Date().toISOString();
    const post: Post = {
      id: `local-${now}-${Math.round(performance.now())}`,
      author: CURRENT_USER,
      householdId: CURRENT_HOUSEHOLD_ID,
      island: HOME_ISLAND,
      scope: input.scope,
      tag: input.tag,
      title: input.title,
      body: input.body,
      action: input.action,
      actionCount: 0,
      createdAt: now,
      image: input.image,
      comments: [],
      isUrgent: input.tag === "HazardAlert",
      isLocal: true,
    };
    setPosts((current) => [post, ...current]);
    await savePostLocally(post);
  }, []);

  const addTideLog = useCallback(async (input: NewTideLogInput) => {
    const now = Date.now();
    const log: TideLog = {
      id: `local-log-${now}`,
      author: CURRENT_USER,
      label: input.label,
      mediaType: input.mediaType,
      createdAt: new Date(now).toISOString(),
      expiresAt: new Date(now + TIDE_LOG_LIFETIME_MS).toISOString(),
      preview: input.preview,
      caption: input.caption,
      island: HOME_ISLAND,
      isLocal: true,
    };
    setTideLogs((current) => [...current, log]);
    await saveTideLogLocally(log);
  }, []);

  const addComment = useCallback(async (postId: string, body: string) => {
    const comment: Comment = {
      id: `local-c-${Date.now()}`,
      author: CURRENT_USER,
      body,
      createdAt: new Date().toISOString(),
    };
    let updated: Post | undefined;
    setPosts((current) =>
      current.map((p) => {
        if (p.id !== postId) return p;
        updated = { ...p, comments: [...(p.comments ?? []), comment] };
        return updated;
      }),
    );
    if (updated) await savePostLocally(updated);
  }, []);

  const actOnPost = useCallback(async (post: Post) => {
    setActedPostIds((current) => {
      if (current.has(post.id)) return current;
      const next = new Set(current);
      next.add(post.id);
      return next;
    });
    setPosts((current) =>
      current.map((p) =>
        p.id === post.id ? { ...p, actionCount: p.actionCount + 1 } : p,
      ),
    );
    setPendingCount((c) => c + 1);
    await queueAction(post.id, post.action);
  }, []);

  const commitTo = useCallback(async (id: string, action: string) => {
    setActedPostIds((current) => {
      if (current.has(id)) return current;
      const next = new Set(current);
      next.add(id);
      return next;
    });
    setPendingCount((c) => c + 1);
    await queueAction(id, action);
  }, []);

  const toggleSave = useCallback(async (postId: string) => {
    const nowSaved = await toggleSavedPost(postId);
    setSavedPostIds((current) => {
      const next = new Set(current);
      if (nowSaved) next.add(postId);
      else next.delete(postId);
      return next;
    });
  }, []);

  const markSeen = useCallback(async (logId: string) => {
    setSeenLogIds((current) => {
      if (current.has(logId)) return current;
      const next = new Set(current);
      next.add(logId);
      return next;
    });
    await markTideLogSeen(logId);
  }, []);

  const value = useMemo<FeedContextValue>(
    () => ({
      ready,
      posts,
      tideLogs,
      actedPostIds,
      savedPostIds,
      seenLogIds,
      pendingCount,
      addPost,
      addTideLog,
      addComment,
      actOnPost,
      commitTo,
      toggleSave,
      markSeen,
    }),
    [
      ready,
      posts,
      tideLogs,
      actedPostIds,
      savedPostIds,
      seenLogIds,
      pendingCount,
      addPost,
      addTideLog,
      addComment,
      actOnPost,
      commitTo,
      toggleSave,
      markSeen,
    ],
  );

  return <FeedContext.Provider value={value}>{children}</FeedContext.Provider>;
}

export function useFeed(): FeedContextValue {
  const ctx = useContext(FeedContext);
  if (!ctx) throw new Error("useFeed must be used inside a FeedProvider");
  return ctx;
}
