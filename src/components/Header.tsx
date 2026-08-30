import { Wifi, WifiOff } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  isOnline?: boolean;
}

export function Header({ title, subtitle, isOnline = true }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-ocean-800/30 bg-ocean-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-sand-100">
              Isle<span className="text-seafoam-400">Help</span>
            </span>
          </div>
          <h1 className="text-sm font-semibold text-sand-200">{title}</h1>
          {subtitle && (
            <p className="text-xs text-sand-400/80">{subtitle}</p>
          )}
        </div>
        <div
          className="flex items-center gap-1.5 rounded-full border border-ocean-700/50 bg-ocean-900/60 px-2.5 py-1 text-xs"
          title={isOnline ? "Connected" : "Offline — mesh sync active"}
        >
          {isOnline ? (
            <Wifi className="h-3.5 w-3.5 text-seafoam-400" />
          ) : (
            <WifiOff className="h-3.5 w-3.5 text-amber-400" />
          )}
          <span className={isOnline ? "text-seafoam-300" : "text-amber-300"}>
            {isOnline ? "Online" : "Mesh"}
          </span>
        </div>
      </div>
    </header>
  );
}
