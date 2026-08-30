import type { HazardSeverity, HazardType, IslandStatus, PersonalSOSType, PostTag } from "./types";

export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export interface TagStyle {
  bg: string;
  text: string;
  border: string;
  /** Solid colour for accents like the card's left edge. */
  dot: string;
  label: string;
}

const TAG_STYLES: Record<PostTag, TagStyle> = {
  ResourceOffer: {
    bg: "bg-teal-50",
    text: "text-teal-700",
    border: "border-teal-200",
    dot: "bg-teal-500",
    label: "Resource Offer",
  },
  RideShare: {
    bg: "bg-lagoon-50",
    text: "text-lagoon-700",
    border: "border-lagoon-200",
    dot: "bg-lagoon-500",
    label: "Ride Share",
  },
  HazardAlert: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500",
    label: "Hazard Alert",
  },
  LocalMarket: {
    bg: "bg-gold-50",
    text: "text-gold-700",
    border: "border-gold-200",
    dot: "bg-gold-400",
    label: "Local Market",
  },
  FairShare: {
    bg: "bg-blossom-50",
    text: "text-blossom-700",
    border: "border-blossom-200",
    dot: "bg-blossom-400",
    label: "Fair Share",
  },
};

export function getTagStyles(tag: PostTag): TagStyle {
  return TAG_STYLES[tag];
}

export const POST_TAGS: PostTag[] = [
  "ResourceOffer",
  "RideShare",
  "HazardAlert",
  "LocalMarket",
  "FairShare",
];

/** Deterministic avatar tint so the same neighbour keeps the same colour. */
const AVATAR_TINTS = [
  "bg-teal-100 text-teal-700",
  "bg-lagoon-100 text-lagoon-700",
  "bg-gold-100 text-gold-700",
  "bg-blossom-100 text-blossom-700",
  "bg-shell-200 text-shell-700",
];

export function getAvatarTint(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return AVATAR_TINTS[hash % AVATAR_TINTS.length];
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const DAY_MS = 24 * 60 * 60 * 1000;

export const TIDE_LOG_LIFETIME_MS = DAY_MS;

export function isExpired(expiresAt: string, now: number = Date.now()): boolean {
  return new Date(expiresAt).getTime() <= now;
}

/** "4h left" / "12m left" — the countdown shown on a Tide Log. */
export function formatTimeRemaining(
  expiresAt: string,
  now: number = Date.now(),
): string {
  const ms = new Date(expiresAt).getTime() - now;
  if (ms <= 0) return "expired";
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return `${Math.max(mins, 1)}m left`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h left`;
}

/**
 * Shift fixed demo timestamps so the newest item sits at "now". Keeps the
 * relative spacing between items intact, so the feed reads as fresh whenever
 * the app is opened rather than ageing out of the mock data.
 */
export function rebaseToNow<T extends { createdAt: string }>(
  items: T[],
  now: number = Date.now(),
): T[] {
  if (items.length === 0) return items;
  const newest = Math.max(...items.map((i) => new Date(i.createdAt).getTime()));
  const shift = now - newest;
  return items.map((item) => {
    const created = new Date(item.createdAt).getTime() + shift;
    const next = { ...item, createdAt: new Date(created).toISOString() };
    if ("expiresAt" in item && typeof item.expiresAt === "string") {
      (next as T & { expiresAt: string }).expiresAt = new Date(
        created + TIDE_LOG_LIFETIME_MS,
      ).toISOString();
    }
    if (Array.isArray((item as T & { comments?: unknown }).comments)) {
      const comments = (item as T & { comments: { createdAt: string }[] })
        .comments;
      (next as T & { comments: unknown }).comments = comments.map((c) => ({
        ...c,
        createdAt: new Date(
          new Date(c.createdAt).getTime() + shift,
        ).toISOString(),
      }));
    }
    return next;
  });
}

export function getStatusColor(status: IslandStatus): string {
  const map: Record<IslandStatus, string> = {
    surplus: "#22c55e",
    urgent: "#eab308",
    event: "#3b82f6",
  };
  return map[status];
}

export function getStatusLabel(status: IslandStatus): string {
  const map: Record<IslandStatus, string> = {
    surplus: "Resource Surplus",
    urgent: "Urgent Need",
    event: "Active Event",
  };
  return map[status];
}

export function getHazardColor(severity: HazardSeverity): string {
  const map = {
    low: "#eab308",
    medium: "#f97316",
    critical: "#ef4444",
  };
  return map[severity];
}

export function getHazardTypeLabel(type: HazardType): string {
  return type === "infrastructure" ? "Infrastructure" : "Ecological";
}

export function getPersonalSOSLabel(type: PersonalSOSType): string {
  const map: Record<PersonalSOSType, string> = {
    medical: "Medical Emergency",
    safety: "Safety Threat",
    missing: "Missing Person",
  };
  return map[type];
}

export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
