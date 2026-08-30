import { AnimatedShore } from "@/components/AnimatedShore";

/** Behind everything: the island — sky, sun, clouds, flowing surf, sand. */
export function IslandBackdrop() {
  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden">
      <AnimatedShore />
    </div>
  );
}
