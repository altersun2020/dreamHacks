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

export function getTagStyles(tag: PostTag): {
  bg: string;
  text: string;
  border: string;
} {
  const map: Record<PostTag, { bg: string; text: string; border: string }> = {
    ResourceOffer: {
      bg: "bg-emerald-500/15",
      text: "text-emerald-700 dark:text-emerald-300",
      border: "border-emerald-500/30",
    },
    RideShare: {
      bg: "bg-sky-500/15",
      text: "text-sky-700 dark:text-sky-300",
      border: "border-sky-500/30",
    },
    HazardAlert: {
      bg: "bg-red-500/15",
      text: "text-red-700 dark:text-red-300",
      border: "border-red-500/30",
    },
    LocalMarket: {
      bg: "bg-amber-500/15",
      text: "text-amber-800 dark:text-amber-300",
      border: "border-amber-500/30",
    },
    FairShare: {
      bg: "bg-violet-500/15",
      text: "text-violet-700 dark:text-violet-300",
      border: "border-violet-500/30",
    },
  };
  return map[tag];
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
