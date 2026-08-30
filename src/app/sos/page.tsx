"use client";

import { useState } from "react";
import {
  AlertTriangle,
  HeartPulse,
  MapPin,
  Radio,
  ShieldAlert,
  TreePine,
  UserX,
  Waves,
} from "lucide-react";
import { PageBanner } from "@/components/app/PageBanner";
import { HazardPinCard, IsleMap } from "@/components/IsleMap";
import { useOnlineStatus } from "@/components/OfflineProvider";
import { useSOS } from "@/contexts/SOSContext";
import { emergencyResponders, HOME_ISLAND, islands } from "@/lib/mock-data";
import type { HazardPin, HazardSeverity, HazardType, PersonalSOSType } from "@/lib/types";
import { cn, formatRelativeTime, getPersonalSOSLabel } from "@/lib/utils";

type Tab = "beacon" | "personal" | "hazards";

const personalSOSTypes: {
  type: PersonalSOSType;
  icon: typeof HeartPulse;
  description: string;
}[] = [
  {
    type: "medical",
    icon: HeartPulse,
    description: "Injuries, fractures, medical emergencies",
  },
  {
    type: "safety",
    icon: ShieldAlert,
    description: "Physical assault, immediate danger",
  },
  {
    type: "missing",
    icon: UserX,
    description: "Missing person alert",
  },
];

const hazardCategories: Record<HazardType, string[]> = {
  infrastructure: [
    "Fallen Tree",
    "Sea Wall Damage",
    "Blocked Road",
    "Structural Damage",
  ],
  ecological: [
    "Ocean Discoloration",
    "Oil Spill",
    "Invasive Species",
    "Algae Bloom",
  ],
};

export default function SOSPage() {
  const isOnline = useOnlineStatus();
  const {
    distressIslands,
    hazardPins,
    personalAlerts,
    activateIslandSOS,
    deactivateIslandSOS,
    sendPersonalSOS,
    reportHazard,
    isLeader,
  } = useSOS();

  const [tab, setTab] = useState<Tab>("personal");
  const [selectedHazard, setSelectedHazard] = useState<HazardPin | null>(null);
  const [sosSent, setSosSent] = useState(false);
  const [lastAlert, setLastAlert] = useState<typeof personalAlerts[0] | null>(null);
  const [beaconReason, setBeaconReason] = useState("");
  const [showBeaconConfirm, setShowBeaconConfirm] = useState(false);

  const [hazardForm, setHazardForm] = useState({
    type: "infrastructure" as HazardType,
    category: "Fallen Tree",
    description: "",
    severity: "medium" as HazardSeverity,
  });

  const homeDistress = distressIslands.find(
    (d) => d.islandId === islands.find((i) => i.isHome)?.id,
  );

  async function handlePersonalSOS(type: PersonalSOSType) {
    const alert = await sendPersonalSOS(type);
    setLastAlert(alert);
    setSosSent(true);
    setTimeout(() => setSosSent(false), 8000);
  }

  async function handleHazardReport() {
    if (!hazardForm.description.trim()) return;
    const coords = { lat: 48.5 + Math.random() * 0.01, lng: -123.2 + Math.random() * 0.01 };
    await reportHazard({ ...hazardForm, ...coords, hasPhoto: false });
    setHazardForm((f) => ({ ...f, description: "" }));
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "personal", label: "Personal SOS" },
    { id: "beacon", label: "Island Beacon" },
    { id: "hazards", label: "Hazard Map" },
  ];

  return (
    <>
      <PageBanner
        title="IsleSOS"
        blurb="Light a beacon across the archipelago, call for medical or safety help, or pin a hazard on the map."
        motif="beacon"
      />
      <main className="mx-auto max-w-lg flex-1 px-4 py-4 pb-24">
        {distressIslands.length > 0 && (
          <div className="mb-4 rounded-xl border border-red-500/50 bg-red-500/10 p-3 beacon-pulse-border">
            <div className="flex items-center gap-2 text-sm font-semibold text-red-700">
              <Radio className="h-4 w-4" />
              Active Archipelago Beacon
            </div>
            {distressIslands.map((d) => (
              <p key={d.islandId} className="mt-1 text-xs text-red-700/80">
                <span className="font-medium">{d.islandName}</span>: {d.reason}
              </p>
            ))}
          </div>
        )}

        <div className="mb-5 flex rounded-xl border border-ocean-700/40 bg-ocean-900/50 p-1">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={cn(
                "flex-1 rounded-lg px-2 py-2 text-xs font-medium transition-all",
                tab === id
                  ? id === "personal"
                    ? "bg-red-500/25 text-red-700"
                    : "bg-seafoam-500/20 text-seafoam-300"
                  : "text-sand-400 hover:text-sand-200",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "personal" && (
          <div className="space-y-5">
            <section>
              <h2 className="mb-3 text-sm font-semibold text-sand-200">
                One-Tap Emergency Dispatch
              </h2>
              <div className="space-y-3">
                {personalSOSTypes.map(({ type, icon: Icon, description }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handlePersonalSOS(type)}
                    className="flex w-full items-center gap-4 rounded-2xl border border-red-500/30 bg-gradient-to-r from-red-500/15 to-red-900/10 p-4 text-left transition-all hover:border-red-500/50 hover:from-red-500/25 active:scale-[0.98]"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-500/25">
                      <Icon className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-red-800">
                        {getPersonalSOSLabel(type)}
                      </p>
                      <p className="text-xs text-sand-400">{description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {sosSent && lastAlert && (
              <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4">
                <p className="flex items-center gap-2 font-semibold text-red-700">
                  <MapPin className="h-4 w-4" />
                  SOS Broadcast Sent
                </p>
                <p className="mt-2 text-sm text-sand-300">
                  GPS pin dropped at{" "}
                  <span className="font-mono text-xs">
                    {lastAlert.lat.toFixed(4)}, {lastAlert.lng.toFixed(4)}
                  </span>
                </p>
                <p className="mt-1 text-xs text-sand-500">
                  Push + SMS alerts sent to {emergencyResponders.length} nearby
                  responders {!isOnline && "· queued for mesh broadcast"}
                </p>
              </div>
            )}

            <section>
              <h2 className="mb-3 text-sm font-semibold text-sand-200">
                Nearby Responders
              </h2>
              <div className="space-y-2">
                {emergencyResponders.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between rounded-xl border border-ocean-700/30 bg-ocean-900/40 px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-medium text-sand-200">{r.name}</p>
                      <p className="text-xs capitalize text-sand-500">{r.role}</p>
                    </div>
                    <span className="text-xs text-seafoam-400">
                      {r.distanceM}m · {r.available ? "Available" : "Busy"}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {tab === "beacon" && (
          <div className="space-y-5">
            <section className="rounded-2xl border border-ocean-700/30 bg-ocean-900/40 p-4">
              <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-sand-200">
                <Radio className="h-4 w-4 text-red-600" />
                Archipelago Beacon
              </h2>
              <p className="mb-4 text-sm text-sand-400">
                Authorized island leaders can activate a full-island distress signal.
                Surrounding islands and global support networks see a pulsing red
                beacon on the Archipelago Grid.
              </p>

              {homeDistress ? (
                <div className="space-y-3">
                  <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3">
                    <p className="text-sm font-semibold text-red-700">
                      🚨 {HOME_ISLAND} — Beacon Active
                    </p>
                    <p className="mt-1 text-sm text-sand-300">{homeDistress.reason}</p>
                    <p className="mt-1 text-xs text-sand-500">
                      Activated by {homeDistress.activatedBy} ·{" "}
                      {formatRelativeTime(homeDistress.activatedAt)}
                    </p>
                  </div>
                  {isLeader && (
                    <button
                      type="button"
                      onClick={() => deactivateIslandSOS(homeDistress.islandId)}
                      className="w-full rounded-xl border border-sand-500/30 py-2.5 text-sm font-medium text-sand-300 hover:bg-sand-500/10"
                    >
                      Deactivate Beacon
                    </button>
                  )}
                </div>
              ) : isLeader ? (
                <div className="space-y-3">
                  {!showBeaconConfirm ? (
                    <button
                      type="button"
                      onClick={() => setShowBeaconConfirm(true)}
                      className="w-full rounded-xl bg-red-600 py-3 text-sm font-bold text-white hover:bg-red-500 active:scale-[0.98]"
                    >
                      Activate Island SOS Mode
                    </button>
                  ) : (
                    <>
                      <textarea
                        value={beaconReason}
                        onChange={(e) => setBeaconReason(e.target.value)}
                        placeholder="Describe the crisis (e.g., main generator failure, water contamination)..."
                        className="w-full rounded-xl border border-ocean-700/50 bg-ocean-950/60 px-3 py-2 text-sm text-sand-200 placeholder:text-sand-600 focus:border-red-500/50 focus:outline-none"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setShowBeaconConfirm(false)}
                          className="flex-1 rounded-xl border border-ocean-700/50 py-2.5 text-sm text-sand-400"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (beaconReason.trim()) {
                              activateIslandSOS(beaconReason.trim());
                              setShowBeaconConfirm(false);
                              setBeaconReason("");
                            }
                          }}
                          disabled={!beaconReason.trim()}
                          className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-500 disabled:opacity-40"
                        >
                          Confirm SOS
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <p className="text-sm text-sand-500">
                  Island leader authorization required to activate beacon.
                </p>
              )}
            </section>

            <section>
              <h2 className="mb-3 text-sm font-semibold text-sand-200">
                Regional Distress Signals
              </h2>
              <div className="space-y-2">
                {distressIslands.map((d) => (
                  <div
                    key={d.islandId}
                    className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/5 p-3"
                  >
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                    <div>
                      <p className="font-semibold text-red-700">{d.islandName}</p>
                      <p className="text-sm text-sand-300">{d.reason}</p>
                      <p className="mt-1 text-xs text-sand-500">
                        {d.activatedBy} · {formatRelativeTime(d.activatedAt)}
                      </p>
                    </div>
                  </div>
                ))}
                {distressIslands.length === 0 && (
                  <p className="text-sm text-sand-500">No active regional beacons.</p>
                )}
              </div>
            </section>
          </div>
        )}

        {tab === "hazards" && (
          <div className="space-y-5">
            <IsleMap
              hazards={hazardPins}
              selectedId={selectedHazard?.id}
              onSelect={setSelectedHazard}
              personalPin={
                lastAlert ? { lat: lastAlert.lat, lng: lastAlert.lng } : undefined
              }
            />

            {selectedHazard && <HazardPinCard hazard={selectedHazard} />}

            <section>
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-sand-200">
                <TreePine className="h-4 w-4 text-orange-400" />
                Report Hazard
              </h2>
              <div className="space-y-3 rounded-2xl border border-ocean-700/30 bg-ocean-900/40 p-4">
                <div className="flex gap-2">
                  {(["infrastructure", "ecological"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() =>
                        setHazardForm((f) => ({
                          ...f,
                          type,
                          category: hazardCategories[type][0],
                        }))
                      }
                      className={cn(
                        "flex-1 rounded-lg py-2 text-xs font-medium",
                        hazardForm.type === type
                          ? type === "infrastructure"
                            ? "bg-orange-500/20 text-orange-300"
                            : "bg-teal-500/20 text-teal-300"
                          : "text-sand-500 hover:text-sand-300",
                      )}
                    >
                      {type === "infrastructure" ? "Infrastructure" : "Ecological"}
                    </button>
                  ))}
                </div>

                <select
                  value={hazardForm.category}
                  onChange={(e) =>
                    setHazardForm((f) => ({ ...f, category: e.target.value }))
                  }
                  className="w-full rounded-lg border border-ocean-700/50 bg-ocean-950/60 px-3 py-2 text-sm text-sand-200 focus:outline-none"
                >
                  {hazardCategories[hazardForm.type].map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <textarea
                  value={hazardForm.description}
                  onChange={(e) =>
                    setHazardForm((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="Describe the hazard and exact location..."
                  className="w-full rounded-lg border border-ocean-700/50 bg-ocean-950/60 px-3 py-2 text-sm text-sand-200 placeholder:text-sand-600 focus:outline-none"
                  rows={3}
                />

                <div className="flex gap-2">
                  {(["low", "medium", "critical"] as const).map((sev) => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() =>
                        setHazardForm((f) => ({ ...f, severity: sev }))
                      }
                      className={cn(
                        "flex-1 rounded-lg py-1.5 text-xs font-medium capitalize",
                        hazardForm.severity === sev
                          ? sev === "critical"
                            ? "bg-red-500/25 text-red-700"
                            : sev === "medium"
                              ? "bg-orange-500/25 text-orange-300"
                              : "bg-yellow-500/25 text-yellow-300"
                          : "text-sand-500",
                      )}
                    >
                      {sev}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleHazardReport}
                  disabled={!hazardForm.description.trim()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500/20 py-2.5 text-sm font-semibold text-orange-300 hover:bg-orange-500/30 disabled:opacity-40"
                >
                  <Waves className="h-4 w-4" />
                  Drop Pin on IsleMap
                </button>
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-sm font-semibold text-sand-200">
                Live Hazard Pins ({hazardPins.length})
              </h2>
              <div className="space-y-2">
                {hazardPins.map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => setSelectedHazard(h)}
                    className="w-full text-left"
                  >
                    <HazardPinCard hazard={h} />
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>
    </>
  );
}
