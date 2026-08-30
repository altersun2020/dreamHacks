export type PostTag =
  | "ResourceOffer"
  | "RideShare"
  | "HazardAlert"
  | "LocalMarket"
  | "FairShare";

export type PostAction = "I Can Help" | "Claim Allocation" | "Hop on Boat";

export type FeedScope = "my-isle" | "archipelago";

export type IslandStatus = "surplus" | "urgent" | "event";

export interface Post {
  id: string;
  author: string;
  householdId: string;
  island: string;
  scope: FeedScope;
  tag: PostTag;
  title: string;
  body: string;
  action: PostAction;
  actionCount: number;
  createdAt: string;
  isUrgent?: boolean;
}

export interface TideLog {
  id: string;
  author: string;
  label: string;
  mediaType: "photo" | "video" | "text";
  expiresAt: string;
  preview: string;
}

export interface Island {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: IslandStatus;
  distanceNm: number;
  isHome?: boolean;
  description: string;
}

export interface TradeRequest {
  id: string;
  fromIsland: string;
  toIsland: string;
  offering: string;
  seeking: string;
  status: "open" | "negotiating" | "scheduled";
}

export interface DirectoryEntry {
  id: string;
  category: "business" | "food" | "ride" | "artisan";
  name: string;
  description: string;
  contact: string;
  available: boolean;
}

export interface Allocation {
  id: string;
  item: string;
  quota: number;
  reserved: number;
  unit: string;
  arrivalEta?: string;
}

export interface GearItem {
  id: string;
  name: string;
  owner: string;
  condition: string;
  availableUntil: string;
}

export interface WorkParty {
  id: string;
  title: string;
  location: string;
  date: string;
  volunteersNeeded: number;
  volunteersSigned: number;
}

export interface MicroMarket {
  id: string;
  vendor: string;
  items: string;
  location: string;
  until: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface BoatTrip {
  id: string;
  captain: string;
  vessel: string;
  route: string;
  departure: string;
  seats: number;
  seatsTaken: number;
  type: "passenger" | "supply";
}

export interface WeatherAlert {
  id: string;
  type: "tide" | "storm" | "wind";
  message: string;
  severity: "info" | "warning" | "critical";
  validUntil: string;
}

export type PersonalSOSType = "medical" | "safety" | "missing";

export type HazardType = "infrastructure" | "ecological";

export type HazardSeverity = "low" | "medium" | "critical";

export interface IslandDistress {
  islandId: string;
  islandName: string;
  reason: string;
  activatedBy: string;
  activatedAt: string;
}

export interface PersonalSOSAlert {
  id: string;
  type: PersonalSOSType;
  lat: number;
  lng: number;
  householdId: string;
  message?: string;
  createdAt: string;
  status: "active" | "responded" | "resolved";
}

export interface HazardPin {
  id: string;
  type: HazardType;
  category: string;
  lat: number;
  lng: number;
  x: number;
  y: number;
  description: string;
  reportedBy: string;
  createdAt: string;
  severity: HazardSeverity;
  hasPhoto?: boolean;
}

export interface EmergencyResponder {
  id: string;
  name: string;
  role: "doctor" | "boat" | "first-aid" | "leader";
  distanceM: number;
  available: boolean;
}
