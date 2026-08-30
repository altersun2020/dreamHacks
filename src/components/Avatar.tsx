import { cn, getAvatarTint, getInitials } from "@/lib/utils";

export function Avatar({
  name,
  size = "md",
  className,
}: {
  name: string;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold",
        size === "sm" ? "h-7 w-7 text-[10px]" : "h-10 w-10 text-xs",
        getAvatarTint(name),
        className,
      )}
    >
      {getInitials(name)}
    </span>
  );
}
