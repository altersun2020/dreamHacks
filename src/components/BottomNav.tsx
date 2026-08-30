"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Anchor,
  BookOpen,
  Map,
  Radio,
  Siren,
  Waves,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/stream", label: "Stream", icon: Waves },
  { href: "/archipelago", label: "Grid", icon: Map },
  { href: "/sos", label: "SOS", icon: Siren, isSOS: true },
  { href: "/ledger", label: "Ledger", icon: BookOpen },
  { href: "/pulse", label: "Pulse", icon: Radio },
  { href: "/mobility", label: "Boats", icon: Anchor },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-ocean-800/20 bg-ocean-950/95 backdrop-blur-lg safe-bottom">
      <div className="mx-auto flex max-w-lg items-end justify-around px-1 py-1">
        {navItems.map(({ href, label, icon: Icon, isSOS }) => {
          const active = pathname.startsWith(href);

          if (isSOS) {
            return (
              <Link
                key={href}
                href={href}
                className="relative -mt-4 flex flex-col items-center"
              >
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full border-2 shadow-lg transition-all",
                    active
                      ? "border-red-400 bg-red-600 shadow-red-500/30"
                      : "border-red-500/50 bg-red-600/90 hover:bg-red-500",
                  )}
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <span
                  className={cn(
                    "mt-0.5 text-[10px] font-bold",
                    active ? "text-red-400" : "text-red-400/80",
                  )}
                >
                  {label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-2 text-[10px] transition-colors",
                active
                  ? "text-seafoam-400"
                  : "text-sand-400/70 hover:text-sand-200",
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5",
                  active && "drop-shadow-[0_0_6px_rgba(94,234,212,0.5)]",
                )}
              />
              <span className="font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
