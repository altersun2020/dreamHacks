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
  CURRENT_HOUSEHOLD_ID,
  HOME_ISLAND,
  initialHazardPins,
  initialIslandDistress,
  islands,
} from "@/lib/mock-data";
import { queueHazardReport, queuePersonalSOS, queueIslandDistress } from "@/lib/db";
import type {
  HazardPin,
  HazardSeverity,
  HazardType,
  IslandDistress,
  PersonalSOSAlert,
  PersonalSOSType,
} from "@/lib/types";

interface SOSContextValue {
  distressIslands: IslandDistress[];
  hazardPins: HazardPin[];
  personalAlerts: PersonalSOSAlert[];
  activateIslandSOS: (reason: string) => void;
  deactivateIslandSOS: (islandId: string) => void;
  sendPersonalSOS: (type: PersonalSOSType, message?: string) => Promise<PersonalSOSAlert>;
  reportHazard: (input: {
    type: HazardType;
    category: string;
    description: string;
    severity: HazardSeverity;
    lat: number;
    lng: number;
    hasPhoto?: boolean;
  }) => Promise<HazardPin>;
  isLeader: boolean;
}

const SOSContext = createContext<SOSContextValue | null>(null);

const HOME_ISLAND_ID = islands.find((i) => i.isHome)?.id ?? "i1";

export function SOSProvider({ children }: { children: React.ReactNode }) {
  const [distressIslands, setDistressIslands] = useState<IslandDistress[]>(initialIslandDistress);
  const [hazardPins, setHazardPins] = useState<HazardPin[]>(initialHazardPins);
  const [personalAlerts, setPersonalAlerts] = useState<PersonalSOSAlert[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("islehelp-sos-distress");
    if (stored) {
      try {
        setDistressIslands(JSON.parse(stored));
      } catch {
        /* use defaults */
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("islehelp-sos-distress", JSON.stringify(distressIslands));
  }, [distressIslands]);

  const activateIslandSOS = useCallback((reason: string) => {
    const distress: IslandDistress = {
      islandId: HOME_ISLAND_ID,
      islandName: HOME_ISLAND,
      reason,
      activatedBy: "Island Council · HH-1042",
      activatedAt: new Date().toISOString(),
    };
    setDistressIslands((prev) => {
      const filtered = prev.filter((d) => d.islandId !== HOME_ISLAND_ID);
      return [...filtered, distress];
    });
    queueIslandDistress(distress);
  }, []);

  const deactivateIslandSOS = useCallback((islandId: string) => {
    setDistressIslands((prev) => prev.filter((d) => d.islandId !== islandId));
  }, []);

  const sendPersonalSOS = useCallback(
    async (type: PersonalSOSType, message?: string): Promise<PersonalSOSAlert> => {
      const coords = await getCoordinates();
      const alert: PersonalSOSAlert = {
        id: `sos-${Date.now()}`,
        type,
        lat: coords.lat,
        lng: coords.lng,
        householdId: CURRENT_HOUSEHOLD_ID,
        message,
        createdAt: new Date().toISOString(),
        status: "active",
      };
      setPersonalAlerts((prev) => [alert, ...prev]);
      await queuePersonalSOS(alert);
      return alert;
    },
    [],
  );

  const reportHazard = useCallback(
    async (input: {
      type: HazardType;
      category: string;
      description: string;
      severity: HazardSeverity;
      lat: number;
      lng: number;
      hasPhoto?: boolean;
    }): Promise<HazardPin> => {
      const pin: HazardPin = {
        id: `h-${Date.now()}`,
        ...input,
        x: 30 + Math.random() * 40,
        y: 30 + Math.random() * 40,
        reportedBy: "You (HH-1042)",
        createdAt: new Date().toISOString(),
      };
      setHazardPins((prev) => [pin, ...prev]);
      await queueHazardReport(pin);
      return pin;
    },
    [],
  );

  const value = useMemo(
    () => ({
      distressIslands,
      hazardPins,
      personalAlerts,
      activateIslandSOS,
      deactivateIslandSOS,
      sendPersonalSOS,
      reportHazard,
      isLeader: true,
    }),
    [
      distressIslands,
      hazardPins,
      personalAlerts,
      activateIslandSOS,
      deactivateIslandSOS,
      sendPersonalSOS,
      reportHazard,
    ],
  );

  return <SOSContext.Provider value={value}>{children}</SOSContext.Provider>;
}

export function useSOS(): SOSContextValue {
  const ctx = useContext(SOSContext);
  if (!ctx) throw new Error("useSOS must be used within SOSProvider");
  return ctx;
}

async function getCoordinates(): Promise<{ lat: number; lng: number }> {
  const fallback = { lat: 48.5, lng: -123.2 };
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return fallback;
  }
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(fallback),
      { timeout: 5000, enableHighAccuracy: true },
    );
  });
}
