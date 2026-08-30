import Dexie, { type Table } from "dexie";
import type {
  HazardPin,
  IslandDistress,
  PersonalSOSAlert,
  Post,
  TideLog,
} from "./types";

export interface CachedPost extends Post {
  syncedAt: string;
}

export interface PendingAction {
  id?: number;
  postId: string;
  action: string;
  createdAt: string;
}

/** A Tide Log composed on this device, awaiting mesh sync. */
export interface CachedTideLog extends TideLog {
  syncedAt: string;
}

/** Which stories this household has already watched, so rings dim correctly. */
export interface SeenTideLog {
  logId: string;
  seenAt: string;
}

export interface SavedPost {
  postId: string;
  savedAt: string;
}

class IsleHelpDB extends Dexie {
  posts!: Table<CachedPost>;
  pendingActions!: Table<PendingAction>;
  personalSOS!: Table<PersonalSOSAlert>;
  hazardReports!: Table<HazardPin>;
  islandDistress!: Table<IslandDistress>;
  tideLogs!: Table<CachedTideLog>;
  seenTideLogs!: Table<SeenTideLog>;
  savedPosts!: Table<SavedPost>;

  constructor() {
    super("IsleHelpDB");
    this.version(1).stores({
      posts: "id, scope, createdAt",
      pendingActions: "++id, postId, createdAt",
    });
    this.version(2).stores({
      posts: "id, scope, createdAt",
      pendingActions: "++id, postId, createdAt",
      personalSOS: "id, createdAt, status",
      hazardReports: "id, type, createdAt",
      islandDistress: "islandId, activatedAt",
    });
    this.version(3).stores({
      posts: "id, scope, createdAt",
      pendingActions: "++id, postId, createdAt",
      personalSOS: "id, createdAt, status",
      hazardReports: "id, type, createdAt",
      islandDistress: "islandId, activatedAt",
      tideLogs: "id, expiresAt, createdAt",
      seenTideLogs: "logId",
      savedPosts: "postId, savedAt",
    });
  }
}

export const db = typeof window !== "undefined" ? new IsleHelpDB() : null;

/* ------------------------------------------------------------------ posts */

export async function cachePosts(posts: Post[]): Promise<void> {
  if (!db) return;
  const now = new Date().toISOString();
  await db.posts.bulkPut(posts.map((p) => ({ ...p, syncedAt: now })));
}

export async function getCachedPosts(
  scope?: "my-isle" | "archipelago",
): Promise<CachedPost[]> {
  if (!db) return [];
  if (scope) {
    return db.posts.where("scope").equals(scope).reverse().sortBy("createdAt");
  }
  return db.posts.orderBy("createdAt").reverse().toArray();
}

/** Posts written on this device that have not reached the mesh yet. */
export async function getLocalPosts(): Promise<CachedPost[]> {
  if (!db) return [];
  const all = await db.posts.toArray();
  return all.filter((p) => p.isLocal);
}

export async function savePostLocally(post: Post): Promise<void> {
  if (!db) return;
  await db.posts.put({ ...post, syncedAt: new Date().toISOString() });
}

/* ---------------------------------------------------------------- actions */

export async function queueAction(
  postId: string,
  action: string,
): Promise<void> {
  if (!db) return;
  await db.pendingActions.add({
    postId,
    action,
    createdAt: new Date().toISOString(),
  });
}

export async function getPendingActions(): Promise<PendingAction[]> {
  if (!db) return [];
  return db.pendingActions.orderBy("createdAt").toArray();
}

export async function countPendingActions(): Promise<number> {
  if (!db) return 0;
  return db.pendingActions.count();
}

/** Called when connectivity returns — the mesh has accepted the queue. */
export async function clearPendingActions(): Promise<void> {
  if (!db) return;
  await db.pendingActions.clear();
}

/* ------------------------------------------------------------- tide logs */

export async function cacheTideLogs(logs: TideLog[]): Promise<void> {
  if (!db) return;
  const now = new Date().toISOString();
  await db.tideLogs.bulkPut(logs.map((l) => ({ ...l, syncedAt: now })));
}

export async function getCachedTideLogs(): Promise<CachedTideLog[]> {
  if (!db) return [];
  return db.tideLogs.orderBy("createdAt").toArray();
}

export async function saveTideLogLocally(log: TideLog): Promise<void> {
  if (!db) return;
  await db.tideLogs.put({ ...log, syncedAt: new Date().toISOString() });
}

/** Drop logs past their 24h window so the cache does not grow forever. */
export async function purgeExpiredTideLogs(): Promise<number> {
  if (!db) return 0;
  const now = new Date().toISOString();
  return db.tideLogs.where("expiresAt").below(now).delete();
}

export async function markTideLogSeen(logId: string): Promise<void> {
  if (!db) return;
  await db.seenTideLogs.put({ logId, seenAt: new Date().toISOString() });
}

export async function getSeenTideLogIds(): Promise<string[]> {
  if (!db) return [];
  const rows = await db.seenTideLogs.toArray();
  return rows.map((r) => r.logId);
}

/* ----------------------------------------------------------- saved posts */

export async function toggleSavedPost(postId: string): Promise<boolean> {
  if (!db) return false;
  const existing = await db.savedPosts.get(postId);
  if (existing) {
    await db.savedPosts.delete(postId);
    return false;
  }
  await db.savedPosts.put({ postId, savedAt: new Date().toISOString() });
  return true;
}

export async function getSavedPostIds(): Promise<string[]> {
  if (!db) return [];
  const rows = await db.savedPosts.toArray();
  return rows.map((r) => r.postId);
}

/* ------------------------------------------------------------------- SOS */

export async function queuePersonalSOS(alert: PersonalSOSAlert): Promise<void> {
  if (!db) return;
  await db.personalSOS.put(alert);
}

export async function queueHazardReport(pin: HazardPin): Promise<void> {
  if (!db) return;
  await db.hazardReports.put(pin);
}

export async function queueIslandDistress(
  distress: IslandDistress,
): Promise<void> {
  if (!db) return;
  await db.islandDistress.put(distress);
}

export async function getPendingSOSAlerts(): Promise<PersonalSOSAlert[]> {
  if (!db) return [];
  return db.personalSOS.where("status").equals("active").toArray();
}
