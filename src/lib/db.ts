import Dexie, { type Table } from "dexie";
import type { HazardPin, IslandDistress, PersonalSOSAlert, Post } from "./types";

export interface CachedPost extends Post {
  syncedAt: string;
}

export interface PendingAction {
  id?: number;
  postId: string;
  action: string;
  createdAt: string;
}

class IsleHelpDB extends Dexie {
  posts!: Table<CachedPost>;
  pendingActions!: Table<PendingAction>;
  personalSOS!: Table<PersonalSOSAlert>;
  hazardReports!: Table<HazardPin>;
  islandDistress!: Table<IslandDistress>;

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
  }
}

export const db = typeof window !== "undefined" ? new IsleHelpDB() : null;

export async function cachePosts(posts: Post[]): Promise<void> {
  if (!db) return;
  const now = new Date().toISOString();
  await db.posts.bulkPut(
    posts.map((p) => ({ ...p, syncedAt: now })),
  );
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

export async function queuePersonalSOS(alert: PersonalSOSAlert): Promise<void> {
  if (!db) return;
  await db.personalSOS.put(alert);
}

export async function queueHazardReport(pin: HazardPin): Promise<void> {
  if (!db) return;
  await db.hazardReports.put(pin);
}

export async function queueIslandDistress(distress: IslandDistress): Promise<void> {
  if (!db) return;
  await db.islandDistress.put(distress);
}

export async function getPendingSOSAlerts(): Promise<PersonalSOSAlert[]> {
  if (!db) return [];
  return db.personalSOS.where("status").equals("active").toArray();
}
