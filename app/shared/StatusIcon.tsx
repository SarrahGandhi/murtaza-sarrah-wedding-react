import { CircleCheck, CircleDashed, CircleMinus } from "lucide-react";
import type { RsvpStatus } from "@/lib/types";

// Deliberately loud, theme-independent status colors — these need to read at a
// glance and contrast with both the cream background and each other.
const STATUS_ICON: Record<
  RsvpStatus,
  { Icon: typeof CircleDashed; color: string }
> = {
  PENDING: { Icon: CircleDashed, color: "text-amber-600" },
  ACCEPTED: { Icon: CircleCheck, color: "text-emerald-600" },
  DECLINED: { Icon: CircleMinus, color: "text-red-600" },
};

export function StatusIcon({
  status,
  className,
}: {
  status: RsvpStatus;
  className?: string;
}) {
  const { Icon, color } = STATUS_ICON[status];
  return (
    <Icon
      strokeWidth={2.5}
      className={`inline-block w-3.5 h-3.5 align-[-0.15em] ${color} ${className ?? ""}`.trimEnd()}
      aria-hidden
    />
  );
}
